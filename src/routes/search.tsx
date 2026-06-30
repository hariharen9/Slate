import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PosterTile } from "@/components/poster-tile";
import { PosterSkeleton } from "@/components/poster-skeleton";
import { searchQueryOptions, trendingQueryOptions } from "@/lib/tmdb-queries";

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
  const [debouncedQ, setDebouncedQ] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(q.trim()), 300);
    return () => clearTimeout(timer);
  }, [q]);

  // Search TMDB when query is present
  const {
    data: searchData,
    isLoading: searchLoading,
    isFetching: searchFetching,
  } = useQuery(searchQueryOptions(debouncedQ));

  // Show trending when no search query
  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    ...trendingQueryOptions(),
    enabled: debouncedQ.length === 0,
  });

  const isSearching = debouncedQ.length > 0;
  const results = isSearching ? (searchData?.results ?? []) : (trendingData?.results ?? []);
  const isLoading = isSearching ? searchLoading : trendingLoading;
  const totalResults = isSearching ? (searchData?.totalResults ?? 0) : (trendingData?.results.length ?? 0);

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
          <span className="shrink-0 font-serif text-xs italic text-[var(--gold)]">
            {searchFetching ? (
              <span className="inline-block h-3 w-3 animate-spin rounded-full border border-[var(--gold)] border-t-transparent" />
            ) : isSearching ? (
              `${totalResults} results`
            ) : (
              "trending"
            )}
          </span>
        </div>

        {isLoading ? (
          <div className="mt-10 grid auto-rows-[220px] grid-cols-2 gap-3 sm:auto-rows-[260px] sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
            <PosterSkeleton count={10} className="h-full w-full" />
          </div>
        ) : (
          <div className="mt-10 grid auto-rows-[220px] grid-cols-2 gap-3 sm:auto-rows-[260px] sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
            {results.map((m) => (
              <PosterTile key={m.id} movie={m} className="h-full w-full" />
            ))}
            {results.length === 0 && (
              <p className="col-span-full py-16 text-center font-serif text-2xl italic text-white/40">
                {isSearching
                  ? "The vault is silent on that one."
                  : "Loading the catalog…"}
              </p>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
