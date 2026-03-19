import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Copy, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  principal: string;
}

// Simple QR-like visual representation using a grid pattern
function SimpleQRDisplay({ value }: { value: string }) {
  const size = 13;
  // Build flat cell array with row/col info for stable keys
  const cells: { r: number; c: number; filled: boolean }[] = [];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const charIdx = (r * size + c) % Math.max(value.length, 1);
      const charCode = value.charCodeAt(charIdx % value.length) || 0;
      const cornerSize = 3;
      const inCorner =
        (r < cornerSize && c < cornerSize) ||
        (r < cornerSize && c >= size - cornerSize) ||
        (r >= size - cornerSize && c < cornerSize);
      const filled = inCorner ? true : (charCode + r * 7 + c * 13) % 3 !== 0;
      cells.push({ r, c, filled });
    }
  }

  return (
    <div className="inline-block p-3 bg-white border-2 border-border rounded-xl shadow-card">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${size}, 12px)`,
          gap: 2,
        }}
      >
        {cells.map(({ r, c, filled }) => (
          <div
            key={`cell-${r}-${c}`}
            style={{
              width: 12,
              height: 12,
              backgroundColor: filled ? "#111827" : "white",
              borderRadius: 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ReceiveModal({ open, onClose, principal }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(principal);
    setCopied(true);
    toast.success("Principal ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent data-ocid="receive.dialog" className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-4 h-4 text-primary" /> Receive Money
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2">
          <p className="text-sm text-muted-foreground text-center">
            Share your Principal ID or QR code to receive payments
          </p>

          <SimpleQRDisplay value={principal} />

          <div className="w-full bg-muted rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1 font-medium">
              Your Principal ID
            </p>
            <p className="text-xs font-mono text-foreground break-all leading-relaxed">
              {principal || "Loading..."}
            </p>
          </div>

          <div className="flex gap-3 w-full">
            <Button
              data-ocid="receive.copy.primary_button"
              variant="outline"
              className="flex-1"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4 text-success" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy ID
                </>
              )}
            </Button>
            <Button
              data-ocid="receive.close_button"
              className="flex-1"
              onClick={onClose}
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
