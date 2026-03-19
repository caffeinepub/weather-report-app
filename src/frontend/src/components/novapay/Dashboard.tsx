import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  ChevronDown,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Home,
  LogOut,
  Send,
  Tag,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Contact, Transaction } from "../../backend.d";
import { Variant_sent_requestReceived_received_requestSent } from "../../backend.d";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import {
  useAccountInfo,
  useContacts,
  useRequests,
  useTransactions,
} from "../../hooks/useQueries";
import BillsPanel from "./BillsPanel";
import ReceiveModal from "./ReceiveModal";
import RequestMoneyModal from "./RequestMoneyModal";
import SendMoneyModal from "./SendMoneyModal";

function formatCents(cents: bigint): string {
  const amount = Number(cents) / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatTimestamp(ns: bigint): string {
  const ms = Number(ns / BigInt(1_000_000));
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ms));
}

function getTransactionLabel(tx: Transaction): string {
  if (tx.contactName) return tx.contactName;
  if (tx.description) return tx.description;
  const type = tx.transactionType;
  if (type === Variant_sent_requestReceived_received_requestSent.sent)
    return "Sent";
  if (type === Variant_sent_requestReceived_received_requestSent.received)
    return "Received";
  if (type === Variant_sent_requestReceived_received_requestSent.requestSent)
    return "Money Request";
  if (
    type === Variant_sent_requestReceived_received_requestSent.requestReceived
  )
    return "Request Received";
  return "Transaction";
}

function isDebit(tx: Transaction): boolean {
  return (
    tx.transactionType ===
      Variant_sent_requestReceived_received_requestSent.sent ||
    tx.transactionType ===
      Variant_sent_requestReceived_received_requestSent.requestSent
  );
}

const SAMPLE_CONTACTS: Contact[] = [
  {
    name: "Alice Johnson",
    contactPrincipal: {
      isAnonymous: () => false,
      toText: () => "sample-1",
    } as any,
  },
  {
    name: "Bob Martinez",
    contactPrincipal: {
      isAnonymous: () => false,
      toText: () => "sample-2",
    } as any,
  },
  {
    name: "Carol Williams",
    contactPrincipal: {
      isAnonymous: () => false,
      toText: () => "sample-3",
    } as any,
  },
  {
    name: "David Chen",
    contactPrincipal: {
      isAnonymous: () => false,
      toText: () => "sample-4",
    } as any,
  },
];

const CONTACT_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-green-100 text-green-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
];

type ActiveTab = "home" | "pay" | "offers" | "cards" | "bills";

interface DashboardProps {
  userName: string;
}

export default function Dashboard({ userName }: DashboardProps) {
  const { clear, identity } = useInternetIdentity();
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [sendOpen, setSendOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);

  const { data: account, isLoading: accountLoading } = useAccountInfo();
  const { data: transactions = [], isLoading: txLoading } = useTransactions();
  const { data: contacts = [] } = useContacts();
  const { data: requests = [] } = useRequests();

  const principal = identity?.getPrincipal().toText() ?? "";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const displayContacts = contacts.length > 0 ? contacts : SAMPLE_CONTACTS;
  const recentTx = [...transactions]
    .sort((a, b) => Number(b.timestamp - a.timestamp))
    .slice(0, 10);

  const pendingBills = requests.slice(0, 10);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2 mr-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground hidden sm:block">
              NOVAPAY
            </span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {(["home", "pay", "offers", "cards", "bills"] as ActiveTab[]).map(
              (tab) => (
                <button
                  key={tab}
                  type="button"
                  data-ocid={`nav.${tab}.tab`}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {tab}
                  {tab === "bills" && requests.length > 0 && (
                    <Badge
                      variant="destructive"
                      className="ml-1.5 h-4 px-1 text-[10px]"
                    >
                      {requests.length}
                    </Badge>
                  )}
                </button>
              ),
            )}
          </nav>

          <div className="flex-1 md:flex-none" />

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-ocid="header.bell.button"
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-accent transition-colors relative"
            >
              <Bell className="w-4 h-4 text-muted-foreground" />
            </button>

            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-accent">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-[10px] font-bold bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block max-w-[80px] truncate">
                {userName}
              </span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </div>

            <Button
              data-ocid="header.send.primary_button"
              size="sm"
              className="hidden sm:flex items-center gap-1.5 font-semibold"
              onClick={() => setSendOpen(true)}
            >
              <Send className="w-3.5 h-3.5" /> Send
            </Button>

            <button
              type="button"
              data-ocid="header.logout.button"
              onClick={clear}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-accent transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6">
        {(activeTab === "home" || activeTab === "pay") && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Greeting + Balance */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="shadow-card overflow-hidden">
                  <div className="relative bg-primary px-6 pt-6 pb-10">
                    {/* Wave decoration - decorative */}
                    <svg
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 w-full"
                      viewBox="0 0 400 40"
                      preserveAspectRatio="none"
                      style={{ height: 40 }}
                    >
                      <path
                        d="M0,20 C100,40 300,0 400,20 L400,40 L0,40 Z"
                        fill="white"
                        fillOpacity="0.08"
                      />
                      <path
                        d="M0,30 C120,10 280,50 400,25 L400,40 L0,40 Z"
                        fill="white"
                        fillOpacity="0.05"
                      />
                    </svg>
                    <p className="text-primary-foreground/80 text-sm font-medium">
                      Good day,
                    </p>
                    <h2 className="text-2xl font-bold text-primary-foreground mt-0.5">
                      {userName} 👋
                    </h2>
                    <div className="mt-6">
                      <p className="text-primary-foreground/70 text-xs uppercase tracking-widest font-medium">
                        Total Balance
                      </p>
                      {accountLoading ? (
                        <div
                          className="h-10 w-36 bg-primary-foreground/20 rounded-lg animate-pulse mt-1"
                          data-ocid="balance.loading_state"
                        />
                      ) : (
                        <p className="text-4xl font-bold text-primary-foreground mt-1">
                          {account ? formatCents(account.balance) : "$0.00"}
                        </p>
                      )}
                      {account && (
                        <p className="text-primary-foreground/60 text-xs mt-2 font-mono">
                          {account.maskedAccountNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Shortcut tiles */}
                  <CardContent className="p-4">
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        {
                          icon: Send,
                          label: "Send Money",
                          action: () => setSendOpen(true),
                          ocid: "dashboard.send.primary_button",
                        },
                        {
                          icon: Download,
                          label: "Receive",
                          action: () => setReceiveOpen(true),
                          ocid: "dashboard.receive.primary_button",
                        },
                        {
                          icon: FileText,
                          label: "Request",
                          action: () => setRequestOpen(true),
                          ocid: "dashboard.request.primary_button",
                        },
                        {
                          icon: Tag,
                          label: "Bills",
                          action: () => setActiveTab("bills"),
                          ocid: "dashboard.bills.primary_button",
                        },
                      ].map(({ icon: Icon, label, action, ocid }) => (
                        <button
                          key={label}
                          type="button"
                          data-ocid={ocid}
                          onClick={action}
                          className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-accent transition-colors group"
                        >
                          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground text-center leading-tight">
                            {label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Card className="shadow-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {txLoading ? (
                      <div
                        className="space-y-1 p-4"
                        data-ocid="transactions.loading_state"
                      >
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-3 py-2">
                            <div className="w-10 h-10 rounded-full bg-accent animate-pulse" />
                            <div className="flex-1 space-y-1.5">
                              <div className="h-3.5 bg-accent rounded animate-pulse w-32" />
                              <div className="h-3 bg-accent rounded animate-pulse w-20" />
                            </div>
                            <div className="h-4 bg-accent rounded animate-pulse w-16" />
                          </div>
                        ))}
                      </div>
                    ) : recentTx.length === 0 ? (
                      <div
                        className="text-center py-10 text-muted-foreground"
                        data-ocid="transactions.empty_state"
                      >
                        <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No transactions yet</p>
                        <p className="text-xs mt-1">
                          Send or receive money to get started
                        </p>
                      </div>
                    ) : (
                      <ScrollArea className="max-h-80">
                        <ul className="divide-y divide-border">
                          {recentTx.map((tx, idx) => {
                            const debit = isDebit(tx);
                            return (
                              <li
                                key={tx.transactionId}
                                data-ocid={`transactions.item.${idx + 1}`}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors"
                              >
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    debit
                                      ? "bg-destructive/10"
                                      : "bg-success/10"
                                  }`}
                                >
                                  {debit ? (
                                    <ArrowUpRight className="w-4 h-4 text-destructive" />
                                  ) : (
                                    <ArrowDownLeft className="w-4 h-4 text-success" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">
                                    {getTransactionLabel(tx)}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatTimestamp(tx.timestamp)}
                                  </p>
                                </div>
                                <span
                                  className={`text-sm font-semibold flex-shrink-0 ${
                                    debit ? "text-foreground" : "text-success"
                                  }`}
                                >
                                  {debit ? "-" : "+"}
                                  {formatCents(tx.amount)}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right column - Quick Pay */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <Card className="shadow-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold">
                        Quick Pay
                      </CardTitle>
                      <button
                        type="button"
                        data-ocid="quickpay.send.primary_button"
                        onClick={() => setSendOpen(true)}
                        className="text-xs text-primary font-medium hover:underline"
                      >
                        Send
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ul className="divide-y divide-border">
                      {displayContacts.slice(0, 5).map((contact, idx) => {
                        const cInitials = contact.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2);
                        return (
                          <li
                            key={contact.name}
                            data-ocid={`quickpay.item.${idx + 1}`}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors"
                          >
                            <button
                              type="button"
                              className="flex items-center gap-3 flex-1 min-w-0"
                              onClick={() => setSendOpen(true)}
                            >
                              <Avatar className="w-9 h-9 flex-shrink-0">
                                <AvatarFallback
                                  className={`text-xs font-bold ${CONTACT_COLORS[idx % CONTACT_COLORS.length]}`}
                                >
                                  {cInitials}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0 text-left">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {contact.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Tap to pay
                                </p>
                              </div>
                              <Send className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                    {displayContacts.length === 0 && (
                      <div
                        className="text-center py-6 px-4 text-muted-foreground"
                        data-ocid="quickpay.empty_state"
                      >
                        <p className="text-sm">No contacts yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Pending Bills summary */}
              {requests.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <Card className="shadow-card border-destructive/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                          <Clock className="w-4 h-4 text-destructive" />
                          Pending Bills
                        </CardTitle>
                        <Badge variant="destructive">{requests.length}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <p className="text-sm text-muted-foreground mb-3">
                        You have {requests.length} pending payment request
                        {requests.length > 1 ? "s" : ""}.
                      </p>
                      <Button
                        data-ocid="dashboard.bills.secondary_button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setActiveTab("bills")}
                      >
                        View Bills
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {activeTab === "bills" && <BillsPanel requests={pendingBills} />}

        {activeTab === "offers" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 text-muted-foreground"
          >
            <Tag className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-semibold text-foreground">
              Offers & Rewards
            </h3>
            <p className="mt-2 text-sm">
              Special offers and cashback rewards coming soon.
            </p>
          </motion.div>
        )}

        {activeTab === "cards" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 text-muted-foreground"
          >
            <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-semibold text-foreground">
              Payment Cards
            </h3>
            <p className="mt-2 text-sm">
              Virtual and physical cards coming soon.
            </p>
          </motion.div>
        )}
      </main>

      {/* Mobile bottom tab bar */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-card rounded-2xl shadow-lg border border-border flex items-center justify-around py-2 px-1">
          {(
            [
              { tab: "home", icon: Home, label: "Home" },
              { tab: "pay", icon: Send, label: "Pay" },
              { tab: "offers", icon: Tag, label: "Offers" },
              { tab: "cards", icon: CreditCard, label: "Cards" },
              { tab: "bills", icon: FileText, label: "Bills" },
            ] as { tab: ActiveTab; icon: any; label: string }[]
          ).map(({ tab, icon: Icon, label }) => (
            <button
              key={tab}
              type="button"
              data-ocid={`mobile.${tab}.tab`}
              onClick={() => setActiveTab(tab)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors relative ${
                activeTab === tab ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
              {tab === "bills" && requests.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Modals */}
      <SendMoneyModal
        open={sendOpen}
        onClose={() => setSendOpen(false)}
        contacts={contacts}
      />
      <ReceiveModal
        open={receiveOpen}
        onClose={() => setReceiveOpen(false)}
        principal={principal}
      />
      <RequestMoneyModal
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        contacts={contacts}
      />

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-muted-foreground border-t border-border mt-auto pb-20 md:pb-4">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground transition-colors"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
