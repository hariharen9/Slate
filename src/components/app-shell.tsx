import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, BarChart3, Bookmark, LogIn, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

const NAV = [
  { to: "/", label: "Curated", icon: Home },
  { to: "/search", label: "Explore", icon: Search },
  { to: "/library", label: "Library", icon: Bookmark },
  { to: "/stats", label: "Journal", icon: BarChart3 },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop sidebar — editorial, no glass box, just type */}
      <aside className="fixed left-0 top-0 bottom-0 z-40 hidden w-56 flex-col justify-between px-8 py-10 lg:flex">
        <div>
          <Link to="/" className="block">
            <span className="font-serif text-3xl italic leading-none tracking-tight">
              Slate<span className="text-[var(--gold)]">.</span>
            </span>
            <span className="label-eyebrow mt-2 block">Cinematic Tracker</span>
          </Link>

          <nav className="mt-16 flex flex-col gap-5 text-sm uppercase tracking-[0.22em]">
            {NAV.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`group flex items-center gap-3 transition-colors ${
                    active ? "text-foreground" : "text-white/40 hover:text-white"
                  }`}
                >
                  <span
                    className={`h-px transition-all duration-300 ${
                      active
                        ? "w-6 bg-[var(--gold)]"
                        : "w-2 bg-white/30 group-hover:w-6 group-hover:bg-white"
                    }`}
                  />
                  <span className="text-[11px] font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt=""
                className="h-9 w-9 rounded-full ring-1 ring-white/20 object-cover"
              />
            ) : (
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[var(--gold-soft)] to-[var(--gold)] ring-1 ring-white/20">
                <span className="text-xs font-bold text-black">
                  {(user.displayName ?? user.email ?? "U")[0].toUpperCase()}
                </span>
              </div>
            )}
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-xs font-medium">
                {user.displayName ?? user.email?.split("@")[0] ?? "User"}
              </p>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors"
              >
                <LogOut className="h-2.5 w-2.5" />
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <Link to="/auth" className="flex items-center gap-3 group">
            <div className="grid h-9 w-9 place-items-center rounded-full glass">
              <LogIn className="h-4 w-4 text-white/50" />
            </div>
            <div className="leading-tight">
              <p className="text-xs font-medium group-hover:text-white transition-colors">
                Sign In
              </p>
              <p className="text-[10px] uppercase tracking-widest text-white/40">
                Track your films
              </p>
            </div>
          </Link>
        )}
      </aside>

      <main className="lg:pl-56">{children}</main>

      {/* Mobile full-width bottom bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
        <div className="flex w-full items-center justify-around border-t border-white/10 px-2 pb-6 pt-3 glass-strong rounded-t-3xl">
          {NAV.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to as never} className="flex-1">
                <motion.div
                  whileTap={{ scale: 0.92 }}
                  className={`flex flex-col items-center gap-1.5 transition-colors ${
                    active ? "text-[var(--gold)]" : "text-white/45 hover:text-white/70"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                  <span className="text-[9px] font-semibold uppercase tracking-widest">
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
