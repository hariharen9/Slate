import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ─── Types ───────────────────────────────────────────────────────────────────

export type MovieStatus = "to-watch" | "may-watch" | "watched";

export type LibraryEntry = {
  tmdbId: number;
  type: "movie" | "tv";
  status: MovieStatus;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  genre: string;
  year: number;
  runtime: string;
  voteAverage: number;
  overview: string;
  rating: number | null; // user's 0–5 rating
  note: string | null; // journal note
  addedAt: Timestamp | null;
  watchedAt: Timestamp | null;
};

export type UserStats = {
  filmsLogged: number;
  totalRuntimeMinutes: number;
  avgRating: number;
  watchlistCount: number;
};

// ─── Library Operations ──────────────────────────────────────────────────────

/** Upsert a movie/show into the user's library */
export async function setMovieStatus(
  uid: string,
  tmdbId: number,
  status: MovieStatus,
  meta: {
    type: "movie" | "tv";
    title: string;
    posterPath: string | null;
    backdropPath: string | null;
    genre: string;
    year: number;
    runtime: string;
    voteAverage: number;
    overview: string;
  },
) {
  const ref = doc(db, "users", uid, "library", String(tmdbId));
  const existing = await getDoc(ref);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Record<string, any> = {
    tmdbId,
    status,
    ...meta,
    addedAt: existing.exists() ? existing.data().addedAt : serverTimestamp(),
    watchedAt: status === "watched" ? serverTimestamp() : null,
  };

  // Preserve existing rating/note if updating status only
  if (existing.exists()) {
    const prev = existing.data() as LibraryEntry;
    data.rating = prev.rating ?? null;
    data.note = prev.note ?? null;
  } else {
    data.rating = null;
    data.note = null;
  }

  await setDoc(ref, data, { merge: true });
}

/** Set user rating for a movie (0–5, half-steps allowed) */
export async function setMovieRating(uid: string, tmdbId: number, rating: number) {
  const ref = doc(db, "users", uid, "library", String(tmdbId));
  await setDoc(ref, { rating }, { merge: true });
}

/** Set user journal note for a movie */
export async function setMovieNote(uid: string, tmdbId: number, note: string) {
  const ref = doc(db, "users", uid, "library", String(tmdbId));
  await setDoc(ref, { note }, { merge: true });
}

/** Get a single movie entry from the user's library */
export async function getMovieEntry(uid: string, tmdbId: number): Promise<LibraryEntry | null> {
  const ref = doc(db, "users", uid, "library", String(tmdbId));
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as LibraryEntry) : null;
}

/** Remove a movie from the user's library */
export async function removeFromLibrary(uid: string, tmdbId: number) {
  const ref = doc(db, "users", uid, "library", String(tmdbId));
  await deleteDoc(ref);
}

/** Get all movies in the user's library, optionally filtered by status and type */
export async function getUserLibrary(
  uid: string,
  status?: MovieStatus,
  typeFilter?: "movie" | "tv",
): Promise<LibraryEntry[]> {
  const colRef = collection(db, "users", uid, "library");

  const constraints = [];
  if (status) constraints.push(where("status", "==", status));
  if (typeFilter) constraints.push(where("type", "==", typeFilter));

  const q = query(colRef, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as LibraryEntry);
}

/** Get watched movies sorted by watchedAt (most recent first) */
export async function getRecentlyWatched(uid: string, limitCount = 6): Promise<LibraryEntry[]> {
  const colRef = collection(db, "users", uid, "library");
  const q = query(colRef, where("status", "==", "watched"), orderBy("watchedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as LibraryEntry).slice(0, limitCount);
}

/** Compute aggregate stats from the user's library */
export async function getUserStats(uid: string): Promise<UserStats> {
  const colRef = collection(db, "users", uid, "library");
  const snap = await getDocs(colRef);
  const entries = snap.docs.map((d) => d.data() as LibraryEntry);

  const watched = entries.filter((e) => e.status === "watched");
  const watchlist = entries.filter((e) => e.status === "to-watch" || e.status === "may-watch");

  // Parse runtime strings like "2h 46m" or "3 Seasons" into minutes
  let totalMinutes = 0;
  for (const e of watched) {
    totalMinutes += parseRuntimeToMinutes(e.runtime);
  }

  const rated = watched.filter((e) => e.rating != null && e.rating > 0);
  const avgRating =
    rated.length > 0 ? rated.reduce((sum, e) => sum + (e.rating ?? 0), 0) / rated.length : 0;

  return {
    filmsLogged: watched.length,
    totalRuntimeMinutes: totalMinutes,
    avgRating: Math.round(avgRating * 10) / 10,
    watchlistCount: watchlist.length,
  };
}

/** Parse runtime string like "2h 46m" to minutes */
function parseRuntimeToMinutes(runtime: string): number {
  if (!runtime) return 0;
  const hMatch = runtime.match(/(\d+)\s*h/);
  const mMatch = runtime.match(/(\d+)\s*m/);
  const hours = hMatch ? parseInt(hMatch[1], 10) : 0;
  const minutes = mMatch ? parseInt(mMatch[1], 10) : 0;
  return hours * 60 + minutes;
}
