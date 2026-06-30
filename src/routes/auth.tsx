import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — Slate" },
      { name: "description", content: "Sign in or create your Slate account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, user } = useAuth();
  const navigate = useNavigate();

  // Already signed in — redirect
  if (user) {
    navigate({ to: "/" });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        if (!displayName.trim()) {
          toast.error("Please enter your name");
          setLoading(false);
          return;
        }
        await signUpWithEmail(email, password, displayName);
        toast.success("Welcome to Slate!", { description: "Your account has been created." });
      } else {
        await signInWithEmail(email, password);
        toast.success("Welcome back!");
      }
      navigate({ to: "/" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      // Clean up Firebase error messages
      const clean = msg
        .replace("Firebase: ", "")
        .replace(/\(auth\/[\w-]+\)\.?/, "")
        .trim();
      toast.error(clean || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      toast.success("Welcome to Slate!");
      navigate({ to: "/" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google sign-in failed";
      if (!msg.includes("popup-closed")) {
        toast.error("Google sign-in failed");
      }
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-[var(--gold)] opacity-[0.03] blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] rounded-full bg-[var(--gold-soft)] opacity-[0.02] blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <span className="font-serif text-4xl italic leading-none tracking-tight">
              Slate<span className="text-[var(--gold)]">.</span>
            </span>
          </Link>
          <p className="label-eyebrow mt-3">A cinematic journal</p>
          <h1 className="mt-6 font-serif text-3xl italic">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
        </div>

        {/* Google button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleGoogle}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-medium transition-colors hover:bg-white/[0.08]"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </motion.button>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-[10px] uppercase tracking-[0.22em] text-white/30">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label
                htmlFor="displayName"
                className="mb-1.5 block text-[10px] uppercase tracking-[0.22em] text-white/50"
              >
                Your Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Marcus A."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-[var(--gold)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--gold)]/30 transition-colors"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-[10px] uppercase tracking-[0.22em] text-white/50"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-[var(--gold)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--gold)]/30 transition-colors"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-[10px] uppercase tracking-[0.22em] text-white/50"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 pr-11 text-sm text-white placeholder:text-white/25 focus:border-[var(--gold)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--gold)]/30 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[var(--gold)] py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:bg-[var(--gold-soft)] disabled:opacity-50"
          >
            {loading ? "Hold on..." : mode === "signin" ? "Sign In" : "Create Account"}
          </motion.button>
        </form>

        {/* Toggle mode */}
        <p className="mt-6 text-center text-sm text-white/40">
          {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="font-serif italic text-[var(--gold)] hover:text-[var(--gold-soft)] transition-colors"
          >
            {mode === "signin" ? "Sign Up" : "Sign In"}
          </button>
        </p>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-[10px] uppercase tracking-[0.22em] text-white/30 hover:text-white/60 transition-colors"
          >
            ← Back to Slate
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
