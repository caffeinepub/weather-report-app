import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Principal } from "@icp-sdk/core/principal";
import { FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Contact } from "../../backend.d";
import { useRequestMoney } from "../../hooks/useQueries";

interface Props {
  open: boolean;
  onClose: () => void;
  contacts: Contact[];
}

export default function RequestMoneyModal({ open, onClose, contacts }: Props) {
  const [selectedContact, setSelectedContact] = useState("");
  const [manualPrincipal, setManualPrincipal] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const { mutate: requestMoney, isPending } = useRequestMoney();

  const handleRequest = () => {
    const amountNum = Number.parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    let toPrincipal: Principal;
    let contactName: string | null = null;

    try {
      if (selectedContact && selectedContact !== "manual") {
        const contact = contacts.find((c) => c.name === selectedContact);
        if (!contact) {
          toast.error("Contact not found");
          return;
        }
        toPrincipal = contact.contactPrincipal as Principal;
        contactName = contact.name;
      } else {
        toPrincipal = Principal.fromText(manualPrincipal.trim());
      }
    } catch {
      toast.error("Invalid principal ID");
      return;
    }

    const amountCents = BigInt(Math.round(amountNum * 100));
    requestMoney(
      {
        to: toPrincipal,
        amount: amountCents,
        description: description || "Money request",
        contactName,
      },
      {
        onSuccess: () => {
          toast.success("Money request sent!");
          handleClose();
        },
        onError: (err) => toast.error(`Request failed: ${err.message}`),
      },
    );
  };

  const handleClose = () => {
    setSelectedContact("");
    setManualPrincipal("");
    setAmount("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent data-ocid="request_money.dialog" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" /> Request Money
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {contacts.length > 0 && (
            <div className="space-y-2">
              <Label>Request From</Label>
              <Select
                value={selectedContact}
                onValueChange={setSelectedContact}
              >
                <SelectTrigger
                  data-ocid="request_money.select"
                  className="h-11"
                >
                  <SelectValue placeholder="Choose a contact" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map((c) => (
                    <SelectItem key={c.name} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="manual">
                    Enter Principal ID manually
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {(selectedContact === "manual" || contacts.length === 0) && (
            <div className="space-y-2">
              <Label>Recipient Principal ID</Label>
              <Input
                data-ocid="request_money.input"
                placeholder="e.g. aaaaa-aa"
                value={manualPrincipal}
                onChange={(e) => setManualPrincipal(e.target.value)}
                className="h-11 font-mono text-sm"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Amount (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                $
              </span>
              <Input
                data-ocid="request_money.amount.input"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-11 pl-7"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Input
              data-ocid="request_money.description.input"
              placeholder="What's this for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              data-ocid="request_money.cancel_button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              data-ocid="request_money.submit_button"
              className="flex-1 font-semibold"
              onClick={handleRequest}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Requesting...
                </>
              ) : (
                "Request Money"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
