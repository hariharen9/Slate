import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/components/app-shell";
import { PosterTile } from "@/components/poster-tile";
import { AuthGuard } from "@/components/auth-guard";
import { PosterSkeleton } from "@/components/poster-skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth-context";
import { getUserLibrary, type LibraryEntry, type MovieStatus } from "@/lib/firestore";
import { posterUrl, backdropUrl, type SlateMovie } from "@/lib/movies";
import { Film, Tv } from "lucide-react";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Library — Slate" },
      { name: "description", content: "Your curated watchlist, history, and backlogs." },
    ],
  }),
  component: LibraryPage,
});

type Filter = "all" | "movie" | "tv";

function entryToSlateMovie(entry: LibraryEntry): SlateMovie {
  return {
    id: entry.tmdbId,
    type: entry.type,
    title: entry.title,
    year: entry.year,
    runtime: entry.runtime,
    genre: entry.genre,
    genres: [],
    poster: posterUrl(entry.posterPath),
    posterPath: entry.posterPath,
    backdrop: backdropUrl(entry.backdropPath),
    backdropPath: entry.backdropPath,
    overview: entry.overview,
    voteAverage: entry.voteAverage,
    vibes: [],
  };
}

function LibraryPage() {
  const [filter, setFilter] = useState<Filter>("all");

  return (
    <AppShell>
      <div className="px-4 pb-32 pt-8 sm:px-8 lg:px-10 lg:pt-10">
        <p className="label-eyebrow">
          <span className="text-[var(--gold)]">●</span>&nbsp;&nbsp;Library
        </p>
        <h1 className="mt-3 font-serif text-4xl italic tracking-tight sm:text-6xl">
          Your <span className="text-white/40">queue,</span> catalogued.
        </h1>

        <AuthGuard message="Sign in to build your collection.">
          <Tabs defaultValue="to-watch" className="mt-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
              <TabsList className="bg-white/5 p-1 glass">
                <TabsTrigger
                  value="to-watch"
                  className="text-xs uppercase tracking-widest data-[state=active]:bg-[var(--gold)] data-[state=active]:text-black rounded-full px-4 py-1.5"
                >
                  To Watch
                </TabsTrigger>
                <TabsTrigger
                  value="may-watch"
                  className="text-xs uppercase tracking-widest data-[state=active]:bg-[var(--gold)] data-[state=active]:text-black rounded-full px-4 py-1.5"
                >
                  May Watch
                </TabsTrigger>
                <TabsTrigger
                  value="watched"
                  className="text-xs uppercase tracking-widest data-[state=active]:bg-[var(--gold)] data-[state=active]:text-black rounded-full px-4 py-1.5"
                >
                  Watched
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
                  All
                </FilterButton>
                <FilterButton active={filter === "movie"} onClick={() => setFilter("movie")}>
                  <Film className="h-3.5 w-3.5" /> Movies
                </FilterButton>
                <FilterButton active={filter === "tv"} onClick={() => setFilter("tv")}>
                  <Tv className="h-3.5 w-3.5" /> TV Series
                </FilterButton>
              </div>
            </div>

            <TabsContent value="to-watch" className="mt-6">
              <LibraryGrid status="to-watch" filter={filter} />
            </TabsContent>
            <TabsContent value="may-watch" className="mt-6">
              <LibraryGrid status="may-watch" filter={filter} />
            </TabsContent>
            <TabsContent value="watched" className="mt-6">
              <LibraryGrid status="watched" filter={filter} />
            </TabsContent>
          </Tabs>
        </AuthGuard>
      </div>
    </AppShell>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] uppercase tracking-widest transition-colors border ${
        active
          ? "border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/10"
          : "border-white/10 text-white/50 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function LibraryGrid({ status, filter }: { status: MovieStatus; filter: Filter }) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LibraryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const typeFilter = filter === "all" ? undefined : filter;
    getUserLibrary(user.uid, status, typeFilter).then((items) => {
      setEntries(items);
      setLoading(false);
    });
  }, [user, status, filter]);

  if (loading) {
    return (
      <div className="grid auto-rows-[220px] grid-cols-2 gap-3 sm:auto-rows-[260px] sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
        <PosterSkeleton count={6} className="h-full w-full" />
      </div>
    );
  }

  const results = entries.map(entryToSlateMovie);

  if (results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-20 flex flex-col items-center justify-center text-center"
      >
        <div className="grid h-20 w-20 place-items-center rounded-full glass">
          <Film className="h-8 w-8 text-white/40" />
        </div>
        <p className="mt-6 font-serif text-3xl italic text-white/60">Nothing here yet.</p>
        <p className="mt-2 text-sm text-white/40">
          Add items to your {status.replace("-", " ")} list.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid auto-rows-[220px] grid-cols-2 gap-3 sm:auto-rows-[260px] sm:grid-cols-3 md:gap-4 lg:grid-cols-5"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.08 } },
      }}
    >
      <AnimatePresence mode="popLayout">
        {results.map((m) => (
          <motion.div
            key={m.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <PosterTile movie={m} className="h-full w-full" />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
