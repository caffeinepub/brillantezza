import { Button } from "@/components/ui/button";
import { BookOpen, Loader2, Star, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";

interface Props {
  onLoggedIn: (isAdmin: boolean) => void;
}

export default function LoginPage({ onLoggedIn }: Props) {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();

  useEffect(() => {
    if (identity && !adminLoading && isAdmin !== undefined) {
      onLoggedIn(isAdmin);
    }
  }, [identity, isAdmin, adminLoading, onLoggedIn]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/3 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-8 px-6 w-full max-w-md"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-xl scale-110" />
          <img
            src="/assets/uploads/1773653501685-1.jpg"
            alt="BRILLANTEZZA"
            className="relative w-36 h-36 object-contain rounded-3xl shadow-2xl"
          />
        </motion.div>

        {/* Brand text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
            BRILLANTEZZA
          </h1>
          <p className="mt-2 text-muted-foreground text-lg tracking-widest uppercase text-sm font-medium">
            Learn • Achieve • Succeed
          </p>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {[
            { icon: BookOpen, label: "Class 6 & 7" },
            { icon: Star, label: "Maths & Science" },
            { icon: Zap, label: "Live Classes" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted border border-border text-muted-foreground text-xs font-medium"
            >
              <Icon className="w-3 h-3 text-primary" />
              {label}
            </div>
          ))}
        </motion.div>

        {/* Login card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="w-full bg-white border border-border rounded-2xl p-8 shadow-2xl"
        >
          <h2 className="font-display text-xl font-semibold text-foreground mb-2 text-center">
            Welcome Back
          </h2>
          <p className="text-muted-foreground text-sm text-center mb-6">
            Sign in to access your classes, notes, and more.
          </p>
          <Button
            data-ocid="login.primary_button"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base py-3 h-auto rounded-xl shadow-glow"
            onClick={() => login()}
            disabled={loginStatus === "logging-in" || adminLoading}
          >
            {loginStatus === "logging-in" || adminLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
              </>
            ) : (
              "Sign In to BRILLANTEZZA"
            )}
          </Button>
          {loginStatus === "loginError" && (
            <p
              data-ocid="login.error_state"
              className="mt-3 text-destructive text-sm text-center"
            >
              Login failed. Please try again.
            </p>
          )}
        </motion.div>

        {/* Footer */}
        <p className="text-muted-foreground text-xs text-center">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </motion.div>
    </div>
  );
}
