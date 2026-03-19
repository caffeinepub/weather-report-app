import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, FileText, XCircle } from "lucide-react";
import { motion } from "motion/react";
import type { Request } from "../../backend.d";
import { Variant_pending_completed_rejected } from "../../backend.d";

function formatCents(cents: bigint): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(cents) / 100);
}

function formatTimestamp(ns: bigint): string {
  const ms = Number(ns / BigInt(1_000_000));
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(ms));
}

interface Props {
  requests: Request[];
}

export default function BillsPanel({ requests }: Props) {
  const statusColor = (status: string) => {
    if (status === Variant_pending_completed_rejected.pending)
      return "bg-yellow-100 text-yellow-700";
    if (status === Variant_pending_completed_rejected.completed)
      return "bg-green-100 text-green-700";
    return "bg-red-100 text-red-700";
  };

  const StatusIcon = (status: string) => {
    if (status === Variant_pending_completed_rejected.pending)
      return <Clock className="w-4 h-4" />;
    if (status === Variant_pending_completed_rejected.completed)
      return <CheckCircle className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Bills & Payment Requests
            {requests.length > 0 && (
              <Badge variant="secondary">{requests.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {requests.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="bills.empty_state"
            >
              <CheckCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <h3 className="text-base font-semibold text-foreground">
                All Clear!
              </h3>
              <p className="text-sm mt-1">
                No pending payment requests at this time.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {requests.map((req, idx) => (
                <li
                  key={req.requestId}
                  data-ocid={`bills.item.${idx + 1}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-accent/50 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${statusColor(req.status as string)}`}
                  >
                    {StatusIcon(req.status as string)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {req.contactName || "Payment Request"}
                      </p>
                      <Badge
                        variant="outline"
                        className={`text-[10px] capitalize ${statusColor(req.status as string)}`}
                      >
                        {req.status as string}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {req.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatTimestamp(req.timestamp)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-base font-bold text-foreground">
                      {formatCents(req.amount)}
                    </p>
                    {req.status ===
                      Variant_pending_completed_rejected.pending && (
                      <div className="flex gap-2 mt-2">
                        <Button
                          data-ocid={`bills.confirm_button.${idx + 1}`}
                          size="sm"
                          className="h-7 text-xs"
                        >
                          Pay
                        </Button>
                        <Button
                          data-ocid={`bills.cancel_button.${idx + 1}`}
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
