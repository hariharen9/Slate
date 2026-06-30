// ─── TMDB API Client ─────────────────────────────────────────────────────────
// Replaces the old static MOVIES array with live TMDB data.
// All functions use the Bearer read-access token for authentication.

const BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p";

function headers() {
  return {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_READ_TOKEN}`,
    "Content-Type": "application/json",
  };
}

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), { headers: headers() });
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

// ─── Image helpers ───────────────────────────────────────────────────────────

export function posterUrl(path: string | null, size: "w342" | "w500" | "w780" = "w500"): string {
  if (!path) return "/placeholder-poster.svg";
  return `${IMG}/${size}${path}`;
}

export function backdropUrl(
  path: string | null,
  size: "w780" | "w1280" | "original" = "w1280",
): string {
  if (!path) return "";
  return `${IMG}/${size}${path}`;
}

export function profileUrl(path: string | null, size: "w185" | "h632" = "w185"): string {
  if (!path) return "";
  return `${IMG}/${size}${path}`;
}

// ─── Shared types ────────────────────────────────────────────────────────────

export type SlateMovie = {
  id: number;
  type: "movie" | "tv";
  title: string;
  year: number;
  runtime: string;
  genre: string;
  genres: { id: number; name: string }[];
  poster: string;
  posterPath: string | null;
  backdrop: string;
  backdropPath: string | null;
  overview: string;
  voteAverage: number;
  vibes: string[];
  director?: string;
  cast?: { name: string; character: string; profilePath: string | null }[];
  trailerKey?: string; // YouTube key
};

// ─── TMDB response shapes (partial) ─────────────────────────────────────────

type TMDBMovie = {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
  number_of_seasons?: number;
  media_type?: string;
};

type TMDBCredits = {
  cast: { name: string; character: string; profile_path: string | null; order: number }[];
  crew: { name: string; job: string }[];
};

type TMDBVideo = {
  key: string;
  site: string;
  type: string;
};

type TMDBPage<T> = {
  page: number;
  total_pages: number;
  total_results: number;
  results: T[];
};

// ─── Genre map ───────────────────────────────────────────────────────────────

let genreCache: Record<number, string> = {};

export async function fetchGenres(): Promise<Record<number, string>> {
  if (Object.keys(genreCache).length > 0) return genreCache;
  const [movies, tv] = await Promise.all([
    tmdbFetch<{ genres: { id: number; name: string }[] }>("/genre/movie/list"),
    tmdbFetch<{ genres: { id: number; name: string }[] }>("/genre/tv/list"),
  ]);
  const map: Record<number, string> = {};
  for (const g of [...movies.genres, ...tv.genres]) map[g.id] = g.name;
  genreCache = map;
  return map;
}

// ─── Vibe mapping (genre → vibe keywords) ────────────────────────────────────

const GENRE_VIBES: Record<string, string[]> = {
  "Science Fiction": ["Mind-bending", "Cosmic"],
  Thriller: ["Tense", "Dark"],
  Drama: ["Emotional", "Cerebral"],
  Comedy: ["Whimsical", "Sharp"],
  Horror: ["Dark", "Intense"],
  Romance: ["Warm", "Bittersweet"],
  Action: ["Epic", "Pulse"],
  Adventure: ["Epic", "Wild"],
  Animation: ["Whimsical", "Cozy Vibe"],
  Mystery: ["Cerebral", "Mystery"],
  Fantasy: ["Epic", "Mind-bending"],
  Documentary: ["Quiet", "Cerebral"],
  Music: ["Warm", "Pulse"],
  War: ["Historical", "Tense"],
  History: ["Historical", "Epic"],
  Crime: ["Noir", "Brooding"],
  Family: ["Cozy Vibe", "Heartfelt"],
  Western: ["Brooding", "Desert"],
};

function genreToVibes(genres: { id: number; name: string }[]): string[] {
  const vibes = new Set<string>();
  for (const g of genres) {
    const mapped = GENRE_VIBES[g.name];
    if (mapped) mapped.forEach((v) => vibes.add(v));
  }
  return vibes.size > 0 ? [...vibes].slice(0, 3) : ["Cinematic"];
}

// ─── Normalization ───────────────────────────────────────────────────────────

function normalizeMovie(raw: TMDBMovie, type: "movie" | "tv"): SlateMovie {
  const title = raw.title ?? raw.name ?? "Untitled";
  const dateStr = raw.release_date ?? raw.first_air_date ?? "";
  const year = dateStr ? parseInt(dateStr.substring(0, 4), 10) : 0;
  const genres = raw.genres ?? [];
  const genreNames = raw.genre_ids
    ? raw.genre_ids.map((id) => ({ id, name: genreCache[id] ?? "Unknown" }))
    : genres;
  const primaryGenre = genreNames[0]?.name ?? "Film";

  let runtime = "";
  if (type === "movie" && raw.runtime) {
    const h = Math.floor(raw.runtime / 60);
    const m = raw.runtime % 60;
    runtime = h > 0 ? `${h}h ${m}m` : `${m}m`;
  } else if (type === "tv" && raw.number_of_seasons) {
    runtime = `${raw.number_of_seasons} Season${raw.number_of_seasons > 1 ? "s" : ""}`;
  }

  return {
    id: raw.id,
    type,
    title,
    year,
    runtime,
    genre: primaryGenre,
    genres: genreNames,
    poster: posterUrl(raw.poster_path),
    posterPath: raw.poster_path,
    backdrop: backdropUrl(raw.backdrop_path),
    backdropPath: raw.backdrop_path,
    overview: raw.overview ?? "",
    voteAverage: Math.round(raw.vote_average * 10) / 10,
    vibes: genreToVibes(genreNames),
  };
}

function normalizeMultiResult(raw: TMDBMovie): SlateMovie {
  const type = raw.media_type === "tv" ? "tv" : "movie";
  return normalizeMovie(raw, type);
}

// ─── API Functions ───────────────────────────────────────────────────────────

export async function fetchTrending(
  page = 1,
): Promise<{ results: SlateMovie[]; totalPages: number }> {
  await fetchGenres(); // ensure cache
  const data = await tmdbFetch<TMDBPage<TMDBMovie>>("/trending/all/week", {
    page: String(page),
  });
  return {
    results: data.results
      .filter((r) => r.media_type === "movie" || r.media_type === "tv")
      .map(normalizeMultiResult),
    totalPages: data.total_pages,
  };
}

export async function fetchPopular(
  page = 1,
): Promise<{ results: SlateMovie[]; totalPages: number }> {
  await fetchGenres();
  const data = await tmdbFetch<TMDBPage<TMDBMovie>>("/movie/popular", {
    page: String(page),
  });
  return {
    results: data.results.map((r) => normalizeMovie(r, "movie")),
    totalPages: data.total_pages,
  };
}

export async function fetchTopRated(
  page = 1,
): Promise<{ results: SlateMovie[]; totalPages: number }> {
  await fetchGenres();
  const data = await tmdbFetch<TMDBPage<TMDBMovie>>("/movie/top_rated", {
    page: String(page),
  });
  return {
    results: data.results.map((r) => normalizeMovie(r, "movie")),
    totalPages: data.total_pages,
  };
}

export async function searchMovies(
  query: string,
  page = 1,
): Promise<{ results: SlateMovie[]; totalPages: number; totalResults: number }> {
  if (!query.trim()) return { results: [], totalPages: 0, totalResults: 0 };
  await fetchGenres();
  const data = await tmdbFetch<TMDBPage<TMDBMovie>>("/search/multi", {
    query,
    page: String(page),
    include_adult: "false",
  });
  return {
    results: data.results
      .filter((r) => r.media_type === "movie" || r.media_type === "tv")
      .map(normalizeMultiResult),
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

export async function fetchMovieDetail(id: number): Promise<SlateMovie> {
  await fetchGenres();
  const [detail, credits, videos] = await Promise.all([
    tmdbFetch<TMDBMovie>(`/movie/${id}`),
    tmdbFetch<TMDBCredits>(`/movie/${id}/credits`),
    tmdbFetch<{ results: TMDBVideo[] }>(`/movie/${id}/videos`),
  ]);

  const movie = normalizeMovie(detail, "movie");
  const director = credits.crew.find((c) => c.job === "Director");
  if (director) movie.director = director.name;
  movie.cast = credits.cast.slice(0, 6).map((c) => ({
    name: c.name,
    character: c.character,
    profilePath: c.profile_path,
  }));

  const trailer = videos.results.find(
    (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"),
  );
  if (trailer) movie.trailerKey = trailer.key;

  return movie;
}

export async function fetchTvDetail(id: number): Promise<SlateMovie> {
  await fetchGenres();
  const [detail, credits, videos] = await Promise.all([
    tmdbFetch<TMDBMovie>(`/tv/${id}`),
    tmdbFetch<TMDBCredits>(`/tv/${id}/credits`),
    tmdbFetch<{ results: TMDBVideo[] }>(`/tv/${id}/videos`),
  ]);

  const show = normalizeMovie(detail, "tv");
  const creator = credits.crew.find(
    (c) => c.job === "Executive Producer" || c.job === "Creator" || c.job === "Director",
  );
  if (creator) show.director = creator.name;
  show.cast = credits.cast.slice(0, 6).map((c) => ({
    name: c.name,
    character: c.character,
    profilePath: c.profile_path,
  }));

  const trailer = videos.results.find(
    (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"),
  );
  if (trailer) show.trailerKey = trailer.key;

  return show;
}

export async function fetchSimilar(
  id: number,
  type: "movie" | "tv",
): Promise<SlateMovie[]> {
  await fetchGenres();
  const endpoint = type === "tv" ? `/tv/${id}/recommendations` : `/movie/${id}/recommendations`;
  const data = await tmdbFetch<TMDBPage<TMDBMovie>>(endpoint);
  return data.results.slice(0, 6).map((r) => normalizeMovie(r, type));
}

// ─── Backward-compatible exports (for components that still use old types) ──

export type Movie = SlateMovie;

export const FILTERS = [
  "All",
  "Movies",
  "TV",
  "Sci-Fi",
  "Drama",
  "Action",
  "Comedy",
  "Thriller",
];
