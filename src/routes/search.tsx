import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search as SearchIcon } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PosterTile } from "@/components/poster-tile";
import { MOVIES } from "@/lib/movies";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Explore — Slate" },
      { name: "description", content: "Search the entire catalog of movies and TV series." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return MOVIES;
    return MOVIES.filter(
      (m) =>
        m.title.toLowerCase().includes(t) ||
        m.genre.toLowerCase().includes(t) ||
        m.vibes.some((v) => v.toLowerCase().includes(t)),
    );
  }, [q]);

  return (
    <AppShell>
      <div className="px-4 pb-32 pt-8 sm:px-8 lg:px-10 lg:pt-10">
        <p className="label-eyebrow">
          <span className="text-[var(--gold)]">●</span>&nbsp;&nbsp;Explore
        </p>
        <h1 className="mt-3 font-serif text-4xl italic tracking-tight sm:text-6xl">
          Search the <span className="text-white/40">catalog.</span>
        </h1>

        <div className="mt-8 flex items-center gap-3 border-b border-white/15 pb-3">
          <SearchIcon className="h-5 w-5 text-white/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="rainy day, sci-fi, Villeneuve…"
            className="w-full bg-transparent font-serif text-2xl italic text-white placeholder:text-white/30 focus:outline-none"
          />
          <span className="font-serif text-xs italic text-[var(--gold)]">
            {results.length} results
          </span>
        </div>

        <div className="mt-10 grid auto-rows-[220px] grid-cols-2 gap-3 sm:auto-rows-[260px] sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
          {results.map((m) => (
            <PosterTile key={m.id} movie={m} className="h-full w-full" />
          ))}
          {results.length === 0 && (
            <p className="col-span-full py-16 text-center font-serif text-2xl italic text-white/40">
              The vault is silent on that one.
            </p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
