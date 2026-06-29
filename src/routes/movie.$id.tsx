import { useEffect } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Bookmark, BookmarkPlus, Eye, CheckCircle2, Play, Tv, Film } from "lucide-react";
import { getMovie, MOVIES } from "@/lib/movies";
import { toast } from "sonner";
import { PosterTile } from "@/components/poster-tile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/movie/$id")({
  head: ({ params }) => {
    const m = MOVIES.find((mv) => mv.id === params.id);
    const title = m ? `${m.title} (${m.year}) — Slate` : "Slate";
    return {
      meta: [
        { title },
        { name: "description", content: m?.overview ?? "Slate movie detail." },
        { property: "og:title", content: title },
        { property: "og:description", content: m?.overview ?? "" },
        ...(m ? [{ property: "og:image", content: m.poster }] : []),
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
  const movie = getMovie(id);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.history.back();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  const similarFilms = MOVIES.filter((m) => m.genre === movie?.genre && m.id !== movie?.id).slice(
    0,
    4,
  );

  if (!movie) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-white/70">
        <Link to="/" className="underline">
          Movie not found — go home
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Ambient blurred backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <img
          src={movie.backdrop ?? movie.poster}
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
        <p className="font-serif text-sm italic text-[var(--gold)]">No. 001 / 128</p>
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
                {movie.type === "tv" ? <Tv className="h-3 w-3" /> : <Film className="h-3 w-3" />}
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
                  { l: "Rating", v: "8.4" },
                  { l: "Runtime", v: movie.runtime },
                  { l: "Year", v: String(movie.year) },
                ].map((m) => (
                  <div key={m.l} className="bg-[var(--ink)] p-5 text-center">
                    <p className="label-eyebrow">{m.l}</p>
                    <p className="mt-2 font-serif text-3xl italic text-[var(--gold-soft)]">{m.v}</p>
                  </div>
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:bg-[var(--gold)]"
              >
                <Play className="h-3.5 w-3.5 fill-black" />
                Play Trailer
              </motion.button>
            </div>

            {/* Credits Tile (Filling the empty space) */}
            <div className="tile p-6">
              <p className="label-eyebrow">Credits</p>
              <div className="mt-6 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
                {movie.director && (
                  <div className="flex flex-col gap-3">
                    <p className="text-[10px] uppercase tracking-widest text-white/40">Director</p>
                    <div className="flex flex-col items-center gap-2 w-max">
                      <Avatar className="h-14 w-14 border border-white/10 shadow-lg">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${movie.director}`} />
                        <AvatarFallback className="bg-[var(--ink)] text-[var(--gold)] font-serif italic">
                          {movie.director[0]}
                        </AvatarFallback>
                      </Avatar>
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
                        <div key={actor} className="flex flex-col items-center gap-2">
                          <Avatar className="h-14 w-14 border border-white/10 shadow-lg">
                            <AvatarImage
                              src={`https://i.pravatar.cc/150?u=${actor}`}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-[var(--ink)] text-[var(--gold)] font-serif italic">
                              {actor[0]}
                            </AvatarFallback>
                          </Avatar>
                          <p className="font-serif text-lg italic leading-tight max-w-[100px] text-center">
                            {actor}
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
            </div>
          </div>

          {/* Journal note tile */}
          <div className="tile p-6 md:col-span-7">
            <div className="flex items-start justify-between">
              <p className="label-eyebrow">Your Journal</p>
              <p className="font-serif text-xs italic text-[var(--gold)]">draft</p>
            </div>
            <p className="mt-3 font-serif text-2xl italic leading-snug text-white/85">
              "A film that hums in the chest long after the credits — let it breathe for a day
              before logging."
            </p>
            <div className="mt-6 flex items-center justify-between border-t border-dashed border-white/15 pt-4 text-[10px] uppercase tracking-[0.22em] text-white/45">
              <span>Saved · 11:42 PM</span>
              <span className="font-serif text-sm italic text-[var(--gold-soft)]">★ 4.5</span>
            </div>
          </div>
        </div>

        {/* Similar Films */}
        {similarFilms.length > 0 && (
          <div className="mt-16">
            <p className="label-eyebrow">
              <span className="text-[var(--gold)]">●</span>&nbsp;&nbsp;You might also like
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
              {similarFilms.map((m, i) => (
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
            icon={movie.status === "to-watch" ? Bookmark : BookmarkPlus}
            label="To Watch"
            active={movie.status === "to-watch"}
            onClick={() => toast.success("Added to Watchlist", { description: movie.title })}
          />
          <span className="h-5 w-px bg-white/10" />
          <ActionButton
            icon={Eye}
            label="May Watch"
            active={movie.status === "may-watch"}
            onClick={() => toast("Marked as May Watch", { description: movie.title })}
          />
          <span className="h-5 w-px bg-white/10" />
          <ActionButton
            icon={CheckCircle2}
            label="Watched"
            active={movie.status === "watched"}
            accent={movie.status === "watched"}
            onClick={() => toast("Marked as Watched", { description: movie.title })}
          />
        </div>
      </div>
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
