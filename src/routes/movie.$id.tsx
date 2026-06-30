import { useEffect, useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookmarkPlus,
  Eye,
  CheckCircle2,
  Play,
  Tv,
  Film,
  Star,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { PosterTile } from "@/components/poster-tile";
import { PosterSkeleton } from "@/components/poster-skeleton";
import { movieDetailQueryOptions, similarQueryOptions } from "@/lib/tmdb-queries";
import { profileUrl } from "@/lib/movies";
import { useAuth } from "@/lib/auth-context";
import {
  setMovieStatus,
  setMovieRating,
  setMovieNote,
  getMovieEntry,
  type MovieStatus,
  type LibraryEntry,
} from "@/lib/firestore";

export const Route = createFileRoute("/movie/$id")({
  head: ({ params }) => {
    const title = `Movie — Slate`;
    return {
      meta: [
        { title },
        { name: "description", content: "Slate movie detail." },
        { property: "og:title", content: title },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center bg-background text-foreground">
      <Link to="/" className="underline">
        Back home
      </Link>
    </div>
  ),
  component: MovieDetail,
});

function MovieDetail() {
  const { id } = Route.useParams();
  const router = useRouter();
  const { user } = useAuth();
  const numericId = parseInt(id, 10);

  // Determine type — try movie first, fall back to TV
  const [mediaType, setMediaType] = useState<"movie" | "tv">("movie");

  const {
    data: movie,
    isLoading,
    isError,
    error,
  } = useQuery({
    ...movieDetailQueryOptions(numericId, mediaType),
    retry: (failureCount, err) => {
      // If movie lookup fails, try TV
      if (failureCount === 0 && mediaType === "movie") {
        setMediaType("tv");
        return true;
      }
      return false;
    },
  });

  const { data: similarFilms } = useQuery({
    ...similarQueryOptions(numericId, movie?.type ?? mediaType),
    enabled: !!movie,
  });

  // User's library entry for this movie
  const [entry, setEntry] = useState<LibraryEntry | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [journalNote, setJournalNote] = useState("");
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    if (!user || !numericId) return;
    getMovieEntry(user.uid, numericId).then((e) => {
      setEntry(e);
      if (e?.note) setJournalNote(e.note);
      if (e?.rating) setUserRating(e.rating);
    });
  }, [user, numericId]);

  // Escape key to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showTrailer) {
          setShowTrailer(false);
        } else {
          router.history.back();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, showTrailer]);

  const handleStatusChange = async (status: MovieStatus) => {
    if (!user) {
      toast.error("Sign in to save movies", {
        action: {
          label: "Sign In",
          onClick: () => router.navigate({ to: "/auth" }),
        },
      });
      return;
    }
    if (!movie) return;

    const labels: Record<MovieStatus, string> = {
      "to-watch": "Added to Watchlist",
      "may-watch": "Marked as May Watch",
      watched: "Marked as Watched",
    };

    await setMovieStatus(user.uid, numericId, status, {
      type: movie.type,
      title: movie.title,
      posterPath: movie.posterPath,
      backdropPath: movie.backdropPath,
      genre: movie.genre,
      year: movie.year,
      runtime: movie.runtime,
      voteAverage: movie.voteAverage,
      overview: movie.overview,
    });

    setEntry((prev) => ({
      ...(prev ?? ({} as LibraryEntry)),
      tmdbId: numericId,
      type: movie.type,
      status,
      title: movie.title,
      posterPath: movie.posterPath,
      backdropPath: movie.backdropPath,
      genre: movie.genre,
      year: movie.year,
      runtime: movie.runtime,
      voteAverage: movie.voteAverage,
      overview: movie.overview,
      rating: prev?.rating ?? null,
      note: prev?.note ?? null,
      addedAt: prev?.addedAt ?? null,
      watchedAt: null,
    }));

    toast.success(labels[status], { description: movie.title });
  };

  const handleRating = async (rating: number) => {
    if (!user) return;
    setUserRating(rating);
    await setMovieRating(user.uid, numericId, rating);
    toast.success(`Rated ${rating} / 5`);
  };

  const handleNoteSave = async () => {
    if (!user || !journalNote.trim()) return;
    await setMovieNote(user.uid, numericId, journalNote.trim());
    toast.success("Journal note saved");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[var(--gold)]" />
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-white/70">
        <div className="text-center">
          <p className="font-serif text-2xl italic">Movie not found</p>
          <Link to="/" className="mt-4 inline-block text-[var(--gold)] underline">
            Go home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Ambient blurred backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <img
          src={movie.backdrop || movie.poster}
          alt=""
          aria-hidden
          className="h-full w-full scale-110 object-cover opacity-45 blur-3xl"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/75 to-black" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-6 sm:px-8 lg:px-10">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => router.history.back()}
          className="flex items-center gap-2 rounded-full px-4 py-2 glass"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-[10px] uppercase tracking-[0.22em]">Back</span>
        </motion.button>
        <p className="font-serif text-sm italic text-[var(--gold)]">
          ★ {movie.voteAverage}
        </p>
      </div>

      {/* Editorial bento detail */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-44 pt-8 sm:px-8 lg:px-10">
        <div className="grid gap-4 md:grid-cols-12 lg:gap-6">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="tile md:col-span-5"
          >
            <img
              src={movie.poster}
              alt={movie.title}
              className="aspect-[2/3] w-full object-cover"
            />
          </motion.div>

          {/* Right Column Content */}
          <div className="flex flex-col gap-4 md:col-span-7">
            {/* Title + meta */}
            <div>
              <p className="label-eyebrow flex items-center gap-2">
                {movie.type === "tv" ? (
                  <Tv className="h-3 w-3" />
                ) : (
                  <Film className="h-3 w-3" />
                )}
                {movie.type === "tv" ? "TV Series" : "Movie"} · {movie.genre} · {movie.year}
              </p>
              <h1 className="mt-3 font-serif text-5xl italic leading-[0.95] tracking-tight sm:text-7xl">
                {movie.title}
              </h1>

              <p className="mt-6 max-w-xl font-serif text-lg italic leading-relaxed text-white/75">
                {movie.overview}
              </p>

              {/* meta strip */}
              <div className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-white/10">
                {[
                  { l: "Rating", v: String(movie.voteAverage) },
                  { l: "Runtime", v: movie.runtime || "—" },
                  { l: "Year", v: String(movie.year) },
                ].map((m) => (
                  <div key={m.l} className="bg-[var(--ink)] p-5 text-center">
                    <p className="label-eyebrow">{m.l}</p>
                    <p className="mt-2 font-serif text-3xl italic text-[var(--gold-soft)]">
                      {m.v}
                    </p>
                  </div>
                ))}
              </div>

              {movie.trailerKey && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTrailer(true)}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:bg-[var(--gold)]"
                >
                  <Play className="h-3.5 w-3.5 fill-black" />
                  Play Trailer
                </motion.button>
              )}
            </div>

            {/* Credits Tile */}
            <div className="tile p-6">
              <p className="label-eyebrow">Credits</p>
              <div className="mt-6 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
                {movie.director && (
                  <div className="flex flex-col gap-3">
                    <p className="text-[10px] uppercase tracking-widest text-white/40">
                      Director
                    </p>
                    <div className="flex flex-col items-center gap-2 w-max">
                      <div className="grid h-14 w-14 place-items-center rounded-full border border-white/10 bg-[var(--ink)] shadow-lg">
                        <span className="font-serif text-lg italic text-[var(--gold)]">
                          {movie.director[0]}
                        </span>
                      </div>
                      <p className="font-serif text-lg italic leading-tight text-center max-w-[100px]">
                        {movie.director}
                      </p>
                    </div>
                  </div>
                )}

                {movie.cast && movie.cast.length > 0 && (
                  <div className="sm:col-span-1 xl:col-span-3 sm:border-l sm:border-dashed sm:border-white/15 sm:pl-8">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-3">
                      Top Cast
                    </p>
                    <div className="flex flex-wrap gap-x-8 gap-y-6">
                      {movie.cast.map((actor) => (
                        <div key={actor.name} className="flex flex-col items-center gap-2">
                          {actor.profilePath ? (
                            <img
                              src={profileUrl(actor.profilePath)}
                              alt={actor.name}
                              className="h-14 w-14 rounded-full border border-white/10 shadow-lg object-cover"
                            />
                          ) : (
                            <div className="grid h-14 w-14 place-items-center rounded-full border border-white/10 bg-[var(--ink)] shadow-lg">
                              <span className="font-serif text-lg italic text-[var(--gold)]">
                                {actor.name[0]}
                              </span>
                            </div>
                          )}
                          <p className="font-serif text-sm italic leading-tight max-w-[90px] text-center">
                            {actor.name}
                          </p>
                          <p className="text-[9px] uppercase tracking-widest text-white/35 max-w-[90px] text-center truncate">
                            {actor.character}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Vibe tile */}
          <div className="tile p-6 md:col-span-5">
            <p className="label-eyebrow">The Vibe</p>
            <p className="mt-2 font-serif text-2xl italic">How it feels</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {movie.vibes.map((v) => (
                <span
                  key={v}
                  className="rounded-full border border-white/12 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/80"
                >
                  {v}
                </span>
              ))}
              {movie.genres.map((g) => (
                <span
                  key={g.id}
                  className="rounded-full border border-white/12 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/60"
                >
                  {g.name}
                </span>
              ))}
            </div>
          </div>

          {/* Journal note tile */}
          <div className="tile p-6 md:col-span-7">
            <div className="flex items-start justify-between">
              <p className="label-eyebrow">Your Journal</p>
              {user && (
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => handleRating(n)}
                      className="transition-colors"
                    >
                      <Star
                        className={`h-4 w-4 ${
                          n <= userRating
                            ? "fill-[var(--gold)] text-[var(--gold)]"
                            : "text-white/20"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            {user ? (
              <>
                <textarea
                  value={journalNote}
                  onChange={(e) => setJournalNote(e.target.value)}
                  placeholder="What did this film make you feel?"
                  rows={3}
                  className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] p-4 font-serif text-lg italic leading-snug text-white/85 placeholder:text-white/25 focus:border-[var(--gold)]/30 focus:outline-none transition-colors"
                />
                <div className="mt-4 flex items-center justify-between border-t border-dashed border-white/15 pt-4">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-white/45">
                    {journalNote.trim() ? "Edited" : "Empty draft"}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNoteSave}
                    disabled={!journalNote.trim()}
                    className="rounded-full bg-[var(--gold)]/20 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)] transition-colors hover:bg-[var(--gold)]/30 disabled:opacity-30"
                  >
                    Save Note
                  </motion.button>
                </div>
              </>
            ) : (
              <>
                <p className="mt-3 font-serif text-2xl italic leading-snug text-white/85">
                  "Let this one sit before committing thoughts to ink."
                </p>
                <div className="mt-6 border-t border-dashed border-white/15 pt-4 text-[10px] uppercase tracking-[0.22em] text-white/45">
                  Sign in to write journal notes
                </div>
              </>
            )}
          </div>
        </div>

        {/* Similar Films */}
        {similarFilms && similarFilms.length > 0 && (
          <div className="mt-16">
            <p className="label-eyebrow">
              <span className="text-[var(--gold)]">●</span>&nbsp;&nbsp;You might also like
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 md:gap-4">
              {similarFilms.slice(0, 6).map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <PosterTile movie={m} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating action bar */}
      <div className="fixed inset-x-0 bottom-6 z-20 flex justify-center px-4 md:bottom-8">
        <div className="flex items-center gap-1 rounded-full p-1.5 glass-strong">
          <ActionButton
            icon={BookmarkPlus}
            label="To Watch"
            active={entry?.status === "to-watch"}
            onClick={() => handleStatusChange("to-watch")}
          />
          <span className="h-5 w-px bg-white/10" />
          <ActionButton
            icon={Eye}
            label="May Watch"
            active={entry?.status === "may-watch"}
            onClick={() => handleStatusChange("may-watch")}
          />
          <span className="h-5 w-px bg-white/10" />
          <ActionButton
            icon={CheckCircle2}
            label="Watched"
            active={entry?.status === "watched"}
            accent={entry?.status === "watched"}
            onClick={() => handleStatusChange("watched")}
          />
        </div>
      </div>

      {/* Trailer modal */}
      {showTrailer && movie.trailerKey && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${movie.trailerKey}?autoplay=1&rel=0`}
              title="Trailer"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="h-full w-full"
            />
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full glass"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  accent,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  accent?: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.93 }}
      className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${
        accent || active
          ? "bg-[var(--gold)] text-black hover:bg-[var(--gold-soft)]"
          : "text-white/85 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </motion.button>
  );
}
