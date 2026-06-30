import type { ReactNode } from "react";
import type { SlateMovie } from "@/lib/movies";
import { PosterCard } from "./poster-card";

type Props = {
  title: string;
  movies: SlateMovie[];
  action?: ReactNode;
  showProgress?: boolean;
  size?: "sm" | "md" | "lg";
};

export function PosterRow({ title, movies, action, showProgress, size }: Props) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between px-4 sm:px-6 md:px-8">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
        {action}
      </div>
      <div className="flex gap-4 overflow-x-auto px-4 pb-2 sm:px-6 md:px-8">
        {movies.map((m) => (
          <PosterCard key={m.id} movie={m} size={size} showProgress={showProgress} />
        ))}
      </div>
    </section>
  );
}
