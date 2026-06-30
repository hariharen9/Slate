import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Play, ArrowUpRight, Plus, LogIn } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PosterTile } from "@/components/poster-tile";
import { HeroSkeleton, PosterSkeleton, ListSkeleton } from "@/components/poster-skeleton";
import { trendingQueryOptions, popularQueryOptions, topRatedQueryOptions } from "@/lib/tmdb-queries";
import { useAuth } from "@/lib/auth-context";
import { getRecentlyWatched, getUserLibrary, getUserStats } from "@/lib/firestore";
import { posterUrl, backdropUrl, type SlateMovie } from "@/lib/movies";
import { useEffect, useState } from "react";
import type { LibraryEntry } from "@/lib/firestore";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Slate — A cinematic journal" },
      {
        name: "description",
        content:
          "Slate is a curated cinematic journal — track films, log vibes, and revisit the moments that moved you.",
      },
      { property: "og:title", content: "Slate — A cinematic journal" },
      { property: "og:description", content: "A curated journal for the films that move you." },
    ],
  }),
  component: Home,
});

/** Convert a Firestore LibraryEntry into a SlateMovie for rendering */
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

function Home() {
  const { user } = useAuth();

  // TMDB trending for hero + discovery
  const { data: trending, isLoading: trendingLoading } = useQuery(trendingQueryOptions());
  const { data: popular } = useQuery(popularQueryOptions());
  const { data: topRated } = useQuery(topRatedQueryOptions());

  // User's Firestore data (only if signed in)
  const [recentlyWatched, setRecentlyWatched] = useState<LibraryEntry[]>([]);
  const [toWatch, setToWatch] = useState<LibraryEntry[]>([]);
  const [stats, setStats] = useState<{ filmsLogged: number; totalRuntimeMinutes: number } | null>(
    null,
  );

  useEffect(() => {
    if (!user) return;
    getRecentlyWatched(user.uid, 3).then(setRecentlyWatched);
    getUserLibrary(user.uid, "to-watch").then((items) => setToWatch(items.slice(0, 4)));
    getUserStats(user.uid).then(setStats);
  }, [user]);

  const hero = trending?.results[0];
  const secondFeature = trending?.results[1];
  const upNext =
    toWatch.length > 0
      ? toWatch.map(entryToSlateMovie)
      : (popular?.results.slice(0, 4) ?? []);
  const recentLogs =
    recentlyWatched.length > 0
      ? recentlyWatched.map(entryToSlateMovie)
      : (topRated?.results.slice(0, 3) ?? []);

  return (
    <AppShell>
      <div className="px-4 pb-32 pt-8 sm:px-8 lg:px-10 lg:pt-10">
        {/* Top editorial header */}
        <header className="flex flex-wrap items-end justify-between gap-4 lg:hidden">
          <div>
            <h1 className="font-serif text-4xl italic leading-none tracking-tight">
              Slate<span className="text-[var(--gold)]">.</span>
            </h1>
            <p className="label-eyebrow mt-2">A cinematic journal</p>
          </div>
          {user ? (
            user.photoURL ? (
              <img
                src={user.photoURL}
                alt=""
                className="h-10 w-10 rounded-full ring-1 ring-white/20 object-cover"
              />
            ) : (
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[var(--gold-soft)] to-[var(--gold)] ring-1 ring-white/20">
                <span className="text-sm font-bold text-black">
                  {(user.displayName ?? user.email ?? "U")[0].toUpperCase()}
                </span>
              </div>
            )
          ) : (
            <Link
              to="/auth"
              className="grid h-10 w-10 place-items-center rounded-full glass"
            >
              <LogIn className="h-4 w-4 text-white/50" />
            </Link>
          )}
        </header>

        {/* Page caption */}
        <div className="mt-6 mb-6 flex flex-wrap items-end justify-between gap-6 lg:mt-0">
          <div className="max-w-xl">
            <p className="label-eyebrow">
              <span className="text-[var(--gold)]">●</span>&nbsp;&nbsp;Now Showing &nbsp;·&nbsp;
              Trending
            </p>
            <h2 className="mt-3 font-serif text-3xl italic leading-[1.05] tracking-tight sm:text-5xl">
              Your slate, <span className="text-white/40">re-arranged</span> for tonight.
            </h2>
          </div>
        </div>

        {/* BENTO GRID */}
        <div className="grid auto-rows-[120px] grid-cols-2 gap-3 md:grid-cols-6 md:gap-4 lg:grid-cols-12">
          {/* Hero feature */}
          {trendingLoading || !hero ? (
            <HeroSkeleton />
          ) : (
            <Link
              to="/movie/$id"
              params={{ id: String(hero.id) }}
              className="group relative tile col-span-2 row-span-4 md:col-span-6 md:row-span-5 lg:col-span-7 lg:row-span-6"
            >
              <motion.div whileTap={{ scale: 0.99 }} className="absolute inset-0">
                <img
                  src={hero.backdrop || hero.poster}
                  alt={hero.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />

                {/* top meta */}
                <div className="absolute left-6 right-6 top-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.22em] glass">
                      Trending
                    </span>
                    {hero.director && (
                      <span className="hidden label-eyebrow sm:inline">
                        Director · {hero.director}
                      </span>
                    )}
                  </div>
                  <span className="rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] glass">
                    ★ {hero.voteAverage}
                  </span>
                </div>

                {/* bottom content */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
                  <p className="label-eyebrow mb-3">{hero.type === "tv" ? "TV Series" : "Film"}</p>
                  <h3 className="font-serif text-5xl italic leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
                    {hero.title}
                  </h3>

                  {/* meta */}
                  <div className="mt-6 flex items-end justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-white/50">
                        <span>
                          {hero.year} · {hero.runtime || hero.genre}
                        </span>
                        <span>
                          {hero.vibes.slice(0, 2).join(" · ")}
                        </span>
                      </div>
                    </div>
                    <motion.span
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-black"
                    >
                      <Play className="h-3.5 w-3.5 fill-black" />
                      Details
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            </Link>
          )}

          {/* Second feature / poster */}
          <div className="col-span-2 row-span-3 md:col-span-3 md:row-span-3 lg:col-span-3 lg:row-span-3">
            {secondFeature ? (
              <PosterTile movie={secondFeature} overlay="always" className="h-full w-full" />
            ) : (
              <PosterSkeleton className="h-full w-full" />
            )}
          </div>

          {/* Stats tile */}
          <div className="tile col-span-1 row-span-2 flex flex-col justify-between p-5 md:col-span-3 md:row-span-2 lg:col-span-2 lg:row-span-3">
            <p className="label-eyebrow">This Year</p>
            <div>
              <p className="font-serif text-6xl italic leading-none tracking-tight">
                {stats ? stats.filmsLogged : "—"}
              </p>
              <p className="mt-2 text-xs text-white/55">
                {stats ? (
                  <>
                    films logged ·{" "}
                    <span className="text-[var(--gold)]">
                      {Math.round(stats.totalRuntimeMinutes / 60)}h
                    </span>{" "}
                    watched
                  </>
                ) : (
                  "sign in to track"
                )}
              </p>
            </div>
            <Link
              to="/stats"
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-white/60 transition-colors hover:text-white"
            >
              Open Journal <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Vibe tile */}
          <div className="tile col-span-1 row-span-2 flex flex-col p-5 md:col-span-3 md:row-span-2 lg:col-span-3 lg:row-span-3">
            <div className="flex items-center justify-between">
              <p className="label-eyebrow">Tonight's Vibe</p>
              <span className="font-serif text-xs italic text-[var(--gold)]">curated</span>
            </div>
            <p className="mt-3 font-serif text-2xl italic leading-tight">
              "Rainy, slow, a little melancholic."
            </p>
            <div className="mt-auto flex flex-wrap gap-1.5">
              {["Rainy Day", "Cozy Vibe", "Cerebral", "Quiet"].map((v) => (
                <span
                  key={v}
                  className="rounded-full border border-white/12 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-white/70"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>

          {/* Up next list panel */}
          <div className="tile col-span-2 row-span-4 flex flex-col p-5 md:col-span-3 md:row-span-3 lg:col-span-4 lg:row-span-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="label-eyebrow">
                  {toWatch.length > 0 ? "Your Queue" : "Popular Now"}
                </p>
                <p className="mt-1 font-serif text-2xl italic">On the horizon</p>
              </div>
              <span className="font-serif text-xs italic text-[var(--gold)]">
                {toWatch.length > 0 ? `${toWatch.length} queued` : "trending"}
              </span>
            </div>

            {upNext.length > 0 ? (
              <ul className="mt-5 space-y-4">
                {upNext.map((m, i) => (
                  <li key={m.id}>
                    <Link
                      to="/movie/$id"
                      params={{ id: String(m.id) }}
                      className="group flex items-center gap-4"
                    >
                      <span className="w-5 font-serif text-sm italic text-white/35">
                        0{i + 1}
                      </span>
                      <div className="h-14 w-10 shrink-0 overflow-hidden rounded-md ring-1 ring-white/10">
                        <img
                          src={m.poster}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-serif text-lg italic leading-tight transition-colors group-hover:text-[var(--gold-soft)]">
                          {m.title}
                        </p>
                        <p className="label-eyebrow mt-0.5">
                          {m.year} · {m.genre}
                        </p>
                      </div>
                      <Plus className="h-4 w-4 shrink-0 text-white/30 transition-colors group-hover:text-[var(--gold)]" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <ListSkeleton count={4} />
            )}
          </div>

          {/* Recently logged: small poster tiles */}
          {recentLogs.length > 0
            ? recentLogs.map((m) => (
                <div
                  key={m.id}
                  className="col-span-1 row-span-3 md:col-span-2 md:row-span-3 lg:col-span-2 lg:row-span-3"
                >
                  <PosterTile movie={m} className="h-full w-full" />
                </div>
              ))
            : Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="col-span-1 row-span-3 md:col-span-2 md:row-span-3 lg:col-span-2 lg:row-span-3"
                >
                  <PosterSkeleton className="h-full w-full" />
                </div>
              ))}

          {/* Ticket-stub editorial card */}
          <div className="tile col-span-2 row-span-3 flex flex-col justify-between p-6 md:col-span-3 md:row-span-3 lg:col-span-6 lg:row-span-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="label-eyebrow">
                  {recentlyWatched.length > 0 ? "Last Logged" : "Editor's Pick"}
                </p>
                <p className="mt-2 font-serif text-3xl italic leading-tight">
                  {recentlyWatched.length > 0 && recentlyWatched[0].note
                    ? `"${recentlyWatched[0].note}"`
                    : '"A film about silence, dressed in noise."'}
                </p>
                <p className="mt-2 text-sm text-white/50">
                  {recentlyWatched.length > 0 ? (
                    <>
                      — your note on{" "}
                      <span className="text-white/80">{recentlyWatched[0].title}</span>
                    </>
                  ) : (
                    <>
                      — sign in to start{" "}
                      <span className="text-white/80">your journal</span>
                    </>
                  )}
                </p>
              </div>
              <div className="hidden shrink-0 text-right md:block">
                <p className="font-serif text-6xl italic leading-none text-[var(--gold)]">★</p>
                <p className="label-eyebrow mt-1">
                  {recentlyWatched.length > 0 && recentlyWatched[0].rating
                    ? `${recentlyWatched[0].rating} / 5`
                    : "— / 5"}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-dashed border-white/15 pt-4">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-white/45">
                Slate · cinematic journal
              </div>
              <p className="font-serif text-xs italic text-white/60">
                {stats ? `No. ${stats.filmsLogged} / 2025` : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
