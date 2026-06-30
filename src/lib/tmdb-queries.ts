import { queryOptions } from "@tanstack/react-query";
import {
  fetchTrending,
  fetchPopular,
  fetchTopRated,
  searchMovies,
  fetchMovieDetail,
  fetchTvDetail,
  fetchSimilar,
} from "./movies";

// ─── Query Option Factories ──────────────────────────────────────────────────
// Use these with useQuery() / useSuspenseQuery() in route components.

export const trendingQueryOptions = (page = 1) =>
  queryOptions({
    queryKey: ["tmdb", "trending", page],
    queryFn: () => fetchTrending(page),
    staleTime: 1000 * 60 * 10, // 10 min
  });

export const popularQueryOptions = (page = 1) =>
  queryOptions({
    queryKey: ["tmdb", "popular", page],
    queryFn: () => fetchPopular(page),
    staleTime: 1000 * 60 * 10,
  });

export const topRatedQueryOptions = (page = 1) =>
  queryOptions({
    queryKey: ["tmdb", "top-rated", page],
    queryFn: () => fetchTopRated(page),
    staleTime: 1000 * 60 * 10,
  });

export const searchQueryOptions = (query: string, page = 1) =>
  queryOptions({
    queryKey: ["tmdb", "search", query, page],
    queryFn: () => searchMovies(query, page),
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 min
  });

export const movieDetailQueryOptions = (id: number, type: "movie" | "tv" = "movie") =>
  queryOptions({
    queryKey: ["tmdb", "detail", type, id],
    queryFn: () => (type === "tv" ? fetchTvDetail(id) : fetchMovieDetail(id)),
    staleTime: 1000 * 60 * 30, // 30 min
  });

export const similarQueryOptions = (id: number, type: "movie" | "tv" = "movie") =>
  queryOptions({
    queryKey: ["tmdb", "similar", type, id],
    queryFn: () => fetchSimilar(id, type),
    staleTime: 1000 * 60 * 30,
  });
