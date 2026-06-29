import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { Movie } from "@/lib/movies";

type Props = {
  movie: Movie;
  className?: string;
  /** Overlay variant: 'minimal' shows nothing until hover, 'always' shows label always */
  overlay?: "minimal" | "always" | "none";
};

export function PosterTile({ movie, className, overlay = "minimal" }: Props) {
  return (
    <Link
      to="/movie/$id"
      params={{ id: movie.id }}
      className={`group relative block tile ${className ?? ""}`}
    >
      <motion.div
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.015 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className="absolute inset-0"
      >
        <img
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.04]"
        />

        {overlay !== "none" && (
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent transition-opacity duration-500 ${
              overlay === "always"
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            }`}
          />
        )}

        {overlay !== "none" && (
          <div
            className={`absolute inset-x-0 bottom-0 p-4 transition-all duration-500 ${
              overlay === "always"
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
            }`}
          >
            <p className="font-serif text-xl italic leading-tight">{movie.title}</p>
            <p className="label-eyebrow mt-1">
              {movie.year} · {movie.genre}
            </p>
          </div>
        )}

        {/* gold corner index mark */}
        <div className="absolute right-3 top-3 font-serif text-xs italic text-[var(--gold)] opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          ↗
        </div>
      </motion.div>
    </Link>
  );
}
