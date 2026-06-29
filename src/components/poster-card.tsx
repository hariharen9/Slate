import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { Movie } from "@/lib/movies";

type Props = {
  movie: Movie;
  size?: "sm" | "md" | "lg";
  showProgress?: boolean;
};

const SIZES = {
  sm: "w-32 sm:w-36",
  md: "w-40 sm:w-44",
  lg: "w-48 sm:w-56",
};

export function PosterCard({ movie, size = "md", showProgress }: Props) {
  return (
    <Link
      to="/movie/$id"
      params={{ id: movie.id }}
      className={`group relative block shrink-0 ${SIZES[size]}`}
    >
      <motion.div
        whileTap={{ scale: 0.95 }}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-white/5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/10"
      >
        <img
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="w-full p-3">
            <p className="text-sm font-semibold leading-tight tracking-tight text-white">
              {movie.title}
            </p>
            <p className="mt-0.5 text-xs text-white/60">
              {movie.year} · {movie.genre}
            </p>
          </div>
        </div>
        {showProgress && movie.progress != null && (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
            <div className="h-full bg-white" style={{ width: `${movie.progress}%` }} />
          </div>
        )}
      </motion.div>
    </Link>
  );
}
