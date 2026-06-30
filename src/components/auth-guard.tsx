import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Optional custom message */
  message?: string;
};

/**
 * Wraps pages that require authentication.
 * Shows a gentle sign-in prompt instead of blocking with a modal.
 */
export function AuthGuard({ children, message }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[var(--gold)]" />
      </div>
    );
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center"
      >
        <div className="grid h-20 w-20 place-items-center rounded-full glass">
          <LogIn className="h-8 w-8 text-white/40" />
        </div>
        <p className="mt-6 font-serif text-3xl italic text-white/70">
          {message ?? "Sign in to see your collection."}
        </p>
        <p className="mt-2 max-w-sm text-sm text-white/40">
          Your watchlists, journal notes, and stats are tied to your account.
        </p>
        <Link
          to="/auth"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:bg-[var(--gold-soft)]"
        >
          <LogIn className="h-3.5 w-3.5" />
          Sign In
        </Link>
      </motion.div>
    );
  }

  return <>{children}</>;
}
