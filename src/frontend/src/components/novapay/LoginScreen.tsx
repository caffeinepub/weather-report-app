import { Button } from "@/components/ui/button";
import { Globe, Loader2, Shield, Wallet, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";

export default function LoginScreen() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Wallet className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            NOVAPAY
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-2xl shadow-card border border-border p-8 text-center"
          >
            {/* Logo */}
            <div className="mx-auto mb-6 w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Wallet className="w-10 h-10 text-primary" />
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome to NovaPay
            </h1>
            <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
              Your secure, decentralized digital wallet. Send, receive, and
              manage money with confidence.
            </p>

            <Button
              data-ocid="login.primary_button"
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base h-12 rounded-xl"
              onClick={login}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Sign in to NovaPay"
              )}
            </Button>

            <p className="mt-4 text-xs text-muted-foreground">
              Secured by Internet Identity
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-3 gap-4 mt-6"
          >
            {[
              { icon: Shield, label: "Secure", desc: "End-to-end encrypted" },
              { icon: Zap, label: "Instant", desc: "Real-time transfers" },
              { icon: Globe, label: "Global", desc: "Borderless payments" },
            ].map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="bg-card rounded-xl border border-border p-4 text-center"
              >
                <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-xs font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-muted-foreground border-t border-border">
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
