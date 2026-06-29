export type Movie = {
  id: string;
  title: string;
  year: number;
  runtime: string;
  genre: string;
  poster: string;
  backdrop?: string;
  overview: string;
  vibes: string[];
  progress?: number; // 0-100 for continue watching
};

// Using TMDB CDN — publicly accessible poster images
const TMDB = "https://image.tmdb.org/t/p/w500";
const TMDB_BD = "https://image.tmdb.org/t/p/original";

export const MOVIES: Movie[] = [
  {
    id: "dune-2",
    title: "Dune: Part Two",
    year: 2024,
    runtime: "2h 46m",
    genre: "Sci-Fi",
    poster: `${TMDB}/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg`,
    overview:
      "Paul Atreides unites with the Fremen to wage war against House Harkonnen, torn between the love of his life and the fate of the universe.",
    vibes: ["Epic", "Desert", "Mind-bending"],
    progress: 64,
  },
  {
    id: "oppenheimer",
    title: "Oppenheimer",
    year: 2023,
    runtime: "3h 0m",
    genre: "Drama",
    poster: `${TMDB}/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg`,
    overview:
      "A dramatization of the life story of J. Robert Oppenheimer, the father of the atomic bomb.",
    vibes: ["Tense", "Historical", "Cerebral"],
    progress: 22,
  },
  {
    id: "interstellar",
    title: "Interstellar",
    year: 2014,
    runtime: "2h 49m",
    genre: "Sci-Fi",
    poster: `${TMDB}/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg`,
    overview:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    vibes: ["Mind-bending", "Emotional", "Cosmic"],
  },
  {
    id: "blade-runner-2049",
    title: "Blade Runner 2049",
    year: 2017,
    runtime: "2h 44m",
    genre: "Sci-Fi",
    poster: `${TMDB}/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg`,
    overview:
      "A young blade runner's discovery of a long-buried secret leads him on a quest to find Rick Deckard.",
    vibes: ["Rainy Day", "Neon", "Melancholic"],
  },
  {
    id: "the-batman",
    title: "The Batman",
    year: 2022,
    runtime: "2h 56m",
    genre: "Action",
    poster: `${TMDB}/74xTEgt7R36Fpooo50r9T25onhq.jpg`,
    overview:
      "When a sadistic serial killer leaves cryptic clues, Batman is forced to investigate Gotham's hidden corruption.",
    vibes: ["Noir", "Rainy Day", "Brooding"],
  },
  {
    id: "everything-everywhere",
    title: "Everything Everywhere All at Once",
    year: 2022,
    runtime: "2h 19m",
    genre: "Sci-Fi",
    poster: `${TMDB}/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg`,
    overview:
      "An aging Chinese immigrant is swept up in an insane adventure where she alone can save existence.",
    vibes: ["Wild", "Emotional", "Mind-bending"],
  },
  {
    id: "parasite",
    title: "Parasite",
    year: 2019,
    runtime: "2h 12m",
    genre: "Thriller",
    poster: `${TMDB}/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg`,
    overview:
      "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    vibes: ["Tense", "Sharp", "Dark Comedy"],
  },
  {
    id: "grand-budapest",
    title: "The Grand Budapest Hotel",
    year: 2014,
    runtime: "1h 39m",
    genre: "Comedy",
    poster: `${TMDB}/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg`,
    overview:
      "A legendary concierge at a famous European hotel between the wars befriends a young employee who becomes his trusted protégé.",
    vibes: ["Whimsical", "Cozy Vibe", "Pastel"],
  },
  {
    id: "her",
    title: "Her",
    year: 2013,
    runtime: "2h 6m",
    genre: "Romance",
    poster: `${TMDB}/lEIaL12hSkqZm3KASp4ulVtSeLZ.jpg`,
    overview:
      "In a near future, a lonely writer develops an unlikely relationship with an operating system designed to meet his every need.",
    vibes: ["Cozy Vibe", "Melancholic", "Warm"],
  },
  {
    id: "arrival",
    title: "Arrival",
    year: 2016,
    runtime: "1h 56m",
    genre: "Sci-Fi",
    poster: `${TMDB}/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg`,
    overview:
      "A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.",
    vibes: ["Quiet", "Mind-bending", "Rainy Day"],
  },
  {
    id: "la-la-land",
    title: "La La Land",
    year: 2016,
    runtime: "2h 8m",
    genre: "Musical",
    poster: `${TMDB}/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg`,
    overview:
      "A jazz pianist falls for an aspiring actress in Los Angeles.",
    vibes: ["Warm", "Bittersweet", "Cozy Vibe"],
  },
  {
    id: "whiplash",
    title: "Whiplash",
    year: 2014,
    runtime: "1h 46m",
    genre: "Drama",
    poster: `${TMDB}/7fn624j5lj3xTme2SgiLCeuedmO.jpg`,
    overview:
      "A promising young drummer enrolls at a cutthroat music conservatory whose ruthless instructor will stop at nothing to realize a student's potential.",
    vibes: ["Intense", "Sharp", "Pulse"],
  },
];

export const FILTERS = ["All", "Movies", "TV", "Sci-Fi", "Drama", "Cozy Vibe", "Mind-bending", "Rainy Day"];

export const CONTINUE_WATCHING = MOVIES.filter((m) => m.progress);
export const UP_NEXT = [MOVIES[2], MOVIES[3], MOVIES[8], MOVIES[9], MOVIES[10]];
export const RECENTLY_LOGGED = [MOVIES[7], MOVIES[6], MOVIES[5], MOVIES[11], MOVIES[4]];

export function getMovie(id: string) {
  return MOVIES.find((m) => m.id === id);
}
