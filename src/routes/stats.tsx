import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/app-shell";
import { AuthGuard } from "@/components/auth-guard";
import { PosterSkeleton } from "@/components/poster-skeleton";
import { useAuth } from "@/lib/auth-context";
import { getUserStats, getRecentlyWatched, getUserLibrary, type LibraryEntry } from "@/lib/firestore";
import { posterUrl } from "@/lib/movies";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "Journal — Slate" },
      { name: "description", content: "Your viewing journal — hours, films, and vibes." },
    ],
  }),
  component: StatsPage,
});

function StatsPage() {
  return (
    <AppShell>
      <div className="px-4 pb-32 pt-8 sm:px-8 lg:px-10 lg:pt-10">
        <p className="label-eyebrow">
          <span className="text-[var(--gold)]">●</span>&nbsp;&nbsp;Journal · 2025
        </p>
        <h1 className="mt-3 font-serif text-4xl italic tracking-tight sm:text-6xl">
          The year, <span className="text-white/40">tallied</span> & remembered.
        </h1>

        <AuthGuard message="Sign in to see your journal.">
          <StatsContent />
        </AuthGuard>
      </div>
    </AppShell>
  );
}

function StatsContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState<{
    filmsLogged: number;
    totalRuntimeMinutes: number;
    avgRating: number;
    watchlistCount: number;
  } | null>(null);
  const [recentlyWatched, setRecentlyWatched] = useState<LibraryEntry[]>([]);
  const [allWatched, setAllWatched] = useState<LibraryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getUserStats(user.uid),
      getRecentlyWatched(user.uid, 6),
      getUserLibrary(user.uid, "watched"),
    ]).then(([s, rw, aw]) => {
      setStats(s);
      setRecentlyWatched(rw);
      setAllWatched(aw);
      setLoading(false);
    });
  }, [user]);

  // Compute genre breakdown from watched films
  const genreBreakdown = useMemo(() => {
    if (allWatched.length === 0) return [];
    const counts: Record<string, number> = {};
    for (const e of allWatched) {
      const g = e.genre || "Other";
      counts[g] = (counts[g] || 0) + 1;
    }
    const total = allWatched.length;
    return Object.entries(counts)
      .map(([g, c]) => ({ g, p: Math.round((c / total) * 100) }))
      .sort((a, b) => b.p - a.p)
      .slice(0, 5);
  }, [allWatched]);

  // Compute vibe weights from watched films
  const vibeWeights = useMemo(() => {
    if (allWatched.length === 0) return [];
    // Use genre as a proxy for vibes from library entries
    const counts: Record<string, number> = {};
    for (const e of allWatched) {
      const g = e.genre || "Film";
      counts[g] = (counts[g] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([v, w]) => ({ v, w }))
      .sort((a, b) => b.w - a.w)
      .slice(0, 7);
  }, [allWatched]);

  if (loading) {
    return (
      <div className="mt-10 flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[var(--gold)]" />
      </div>
    );
  }

  const STATS_DISPLAY = [
    {
      label: "Films logged",
      value: String(stats?.filmsLogged ?? 0),
      sub: "this year",
    },
    {
      label: "Total runtime",
      value: String(Math.round((stats?.totalRuntimeMinutes ?? 0) / 60)),
      sub: "hours in the dark",
    },
    {
      label: "Avg. rating",
      value: String(stats?.avgRating ?? "—"),
      sub: "out of 5",
    },
    {
      label: "Watchlist",
      value: String(stats?.watchlistCount ?? 0),
      sub: "queued up",
    },
  ];

  return (
    <>
      {/* Stat grid */}
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {STATS_DISPLAY.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.45 }}
            className="tile p-6"
          >
            <p className="label-eyebrow">{s.label}</p>
            <p className="mt-3 font-serif text-6xl italic leading-none">{s.value}</p>
            <p className="mt-2 text-xs text-white/45">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Two-column editorial */}
      <div className="mt-6 grid gap-3 md:grid-cols-12 md:gap-4">
        {/* Vibe / genre cloud */}
        <section className="tile p-7 md:col-span-7">
          <div className="flex items-end justify-between">
            <div>
              <p className="label-eyebrow">Genre Index</p>
              <p className="mt-1 font-serif text-2xl italic">What 2025 felt like</p>
            </div>
            <span className="font-serif text-xs italic text-[var(--gold)]">
              {vibeWeights.length} genres
            </span>
          </div>
          {vibeWeights.length > 0 ? (
            <div className="mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-3">
              {vibeWeights.map((vw) => (
                <motion.span
                  key={vw.v}
                  whileTap={{ scale: 0.96 }}
                  className="font-serif italic transition-colors hover:text-[var(--gold-soft)]"
                  style={{
                    fontSize: `${0.9 + vw.w / 3}rem`,
                    opacity: 0.5 + vw.w / 20,
                  }}
                >
                  {vw.v}
                </motion.span>
              ))}
            </div>
          ) : (
            <p className="mt-6 font-serif text-xl italic text-white/30">
              Watch some films to see your genre cloud.
            </p>
          )}
        </section>

        {/* Genre breakdown bars */}
        <section className="tile p-7 md:col-span-5">
          <p className="label-eyebrow">By Genre</p>
          <p className="mt-1 font-serif text-2xl italic">Where you spent your hours</p>
          {genreBreakdown.length > 0 ? (
            <ul className="mt-5 space-y-3">
              {genreBreakdown.map((row) => (
                <li key={row.g}>
                  <div className="flex items-baseline justify-between">
                    <span className="font-serif text-sm italic">{row.g}</span>
                    <span className="label-eyebrow">{row.p}%</span>
                  </div>
                  <div className="mt-1 h-px w-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${row.p}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-px bg-[var(--gold)]"
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 font-serif text-xl italic text-white/30">
              No data yet.
            </p>
          )}
        </section>
      </div>

      {/* Recently logged strip */}
      <section className="mt-10">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-3xl italic">Recently committed to memory</h2>
          <span className="label-eyebrow">Latest</span>
        </div>
        {recentlyWatched.length > 0 ? (
          <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6 md:gap-4">
            {recentlyWatched.map((m) => (
              <Link
                key={m.tmdbId}
                to="/movie/$id"
                params={{ id: String(m.tmdbId) }}
              >
                <motion.div
                  whileTap={{ scale: 0.96 }}
                  className="overflow-hidden rounded-xl ring-1 ring-white/10"
                >
                  <img
                    src={posterUrl(m.posterPath)}
                    alt={m.title}
                    className="aspect-[2/3] w-full object-cover"
                  />
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6 md:gap-4">
            <PosterSkeleton count={6} className="aspect-[2/3] w-full" />
          </div>
        )}
      </section>
    </>
  );
}
