export type Movie = {
  id: string;
  type: "movie" | "tv";
  status: "to-watch" | "may-watch" | "watched" | "none";
  title: string;
  year: number;
  runtime: string;
  genre: string;
  poster: string;
  backdrop?: string;
  overview: string;
  vibes: string[];
  progress?: number; // 0-100 for continue watching
  director?: string;
  cast?: string[];
};

// Using TMDB CDN — publicly accessible poster images
const TMDB = "https://image.tmdb.org/t/p/w500";

export const MOVIES: Movie[] = [
  {
    id: "dune-2",
    type: "movie",
    status: "watched",
    title: "Dune: Part Two",
    year: 2024,
    runtime: "2h 46m",
    genre: "Sci-Fi",
    poster: `${TMDB}/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg`,
    overview:
      "Paul Atreides unites with the Fremen to wage war against House Harkonnen, torn between the love of his life and the fate of the universe.",
    vibes: ["Epic", "Desert", "Mind-bending"],
    progress: 64,
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
  },
  {
    id: "severance",
    type: "tv",
    status: "to-watch",
    title: "Severance",
    year: 2022,
    runtime: "2 Seasons",
    genre: "Sci-Fi",
    poster: `${TMDB}/a1GhqhZhyK515s7tJcl52P0m5vA.jpg`,
    overview:
      "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives.",
    vibes: ["Cerebral", "Tense", "Mystery"],
    director: "Ben Stiller",
    cast: ["Adam Scott", "Zach Cherry", "Britt Lower"],
  },
  {
    id: "oppenheimer",
    type: "movie",
    status: "watched",
    title: "Oppenheimer",
    year: 2023,
    runtime: "3h 0m",
    genre: "Drama",
    poster: `${TMDB}/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg`,
    overview:
      "A dramatization of the life story of J. Robert Oppenheimer, the father of the atomic bomb.",
    vibes: ["Tense", "Historical", "Cerebral"],
    progress: 22,
    director: "Christopher Nolan",
    cast: ["Cillian Murphy", "Emily Blunt", "Robert Downey Jr."],
  },
  {
    id: "succession",
    type: "tv",
    status: "watched",
    title: "Succession",
    year: 2018,
    runtime: "4 Seasons",
    genre: "Drama",
    poster: `${TMDB}/5R182Qz2MOE2yLw4tD8hG1K6O02.jpg`,
    overview:
      "The Roy family is known for controlling the biggest media and entertainment company in the world. However, their world changes when their father steps down from the company.",
    vibes: ["Sharp", "Tense", "Dark Comedy"],
    director: "Jesse Armstrong",
    cast: ["Brian Cox", "Jeremy Strong", "Sarah Snook"],
  },
  {
    id: "interstellar",
    type: "movie",
    status: "watched",
    title: "Interstellar",
    year: 2014,
    runtime: "2h 49m",
    genre: "Sci-Fi",
    poster: `${TMDB}/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg`,
    overview:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    vibes: ["Mind-bending", "Emotional", "Cosmic"],
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
  },
  {
    id: "true-detective",
    type: "tv",
    status: "watched",
    title: "True Detective",
    year: 2014,
    runtime: "4 Seasons",
    genre: "Thriller",
    poster: `${TMDB}/yOq1XJ8Jk50d75Fz8Ew0jGikLHs.jpg`,
    overview:
      "Anthology series in which police investigations unearth the personal and professional secrets of those involved, both within and outside the law.",
    vibes: ["Dark", "Brooding", "Mystery"],
    director: "Nic Pizzolatto",
    cast: ["Matthew McConaughey", "Woody Harrelson", "Jodie Foster"],
  },
  {
    id: "blade-runner-2049",
    type: "movie",
    status: "watched",
    title: "Blade Runner 2049",
    year: 2017,
    runtime: "2h 44m",
    genre: "Sci-Fi",
    poster: `${TMDB}/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg`,
    overview:
      "A young blade runner's discovery of a long-buried secret leads him on a quest to find Rick Deckard.",
    vibes: ["Rainy Day", "Neon", "Melancholic"],
    director: "Denis Villeneuve",
    cast: ["Ryan Gosling", "Harrison Ford", "Ana de Armas"],
  },
  {
    id: "shogun",
    type: "tv",
    status: "to-watch",
    title: "Shōgun",
    year: 2024,
    runtime: "1 Season",
    genre: "Drama",
    poster: `${TMDB}/7O4iVfOMQmdCSqZeKVU6c20v0g6.jpg`,
    overview:
      "In Japan in the year 1600, at the dawn of a century-defining civil war, Lord Yoshii Toranaga is fighting for his life as his enemies on the Council of Regents unite against him.",
    vibes: ["Epic", "Historical", "Tense"],
    director: "Rachel Kondo",
    cast: ["Hiroyuki Sanada", "Cosmo Jarvis", "Anna Sawai"],
  },
  {
    id: "the-batman",
    type: "movie",
    status: "may-watch",
    title: "The Batman",
    year: 2022,
    runtime: "2h 56m",
    genre: "Action",
    poster: `${TMDB}/74xTEgt7R36Fpooo50r9T25onhq.jpg`,
    overview:
      "When a sadistic serial killer leaves cryptic clues, Batman is forced to investigate Gotham's hidden corruption.",
    vibes: ["Noir", "Rainy Day", "Brooding"],
    director: "Matt Reeves",
    cast: ["Robert Pattinson", "Zoë Kravitz", "Paul Dano"],
  },
  {
    id: "everything-everywhere",
    type: "movie",
    status: "watched",
    title: "Everything Everywhere All at Once",
    year: 2022,
    runtime: "2h 19m",
    genre: "Sci-Fi",
    poster: `${TMDB}/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg`,
    overview:
      "An aging Chinese immigrant is swept up in an insane adventure where she alone can save existence.",
    vibes: ["Wild", "Emotional", "Mind-bending"],
    director: "Daniel Kwan",
    cast: ["Michelle Yeoh", "Ke Huy Quan", "Jamie Lee Curtis"],
  },
  {
    id: "the-bear",
    type: "tv",
    status: "may-watch",
    title: "The Bear",
    year: 2022,
    runtime: "3 Seasons",
    genre: "Comedy",
    poster: `${TMDB}/xQvq3xP0Jd5WpB9F04dDIFgVqXN.jpg`,
    overview:
      "A young chef from the fine dining world comes home to Chicago to run his family sandwich shop after a heartbreaking death in his family.",
    vibes: ["Intense", "Anxious", "Heartfelt"],
    director: "Christopher Storer",
    cast: ["Jeremy Allen White", "Ayo Edebiri", "Ebon Moss-Bachrach"],
  },
  {
    id: "parasite",
    type: "movie",
    status: "watched",
    title: "Parasite",
    year: 2019,
    runtime: "2h 12m",
    genre: "Thriller",
    poster: `${TMDB}/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg`,
    overview:
      "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    vibes: ["Tense", "Sharp", "Dark Comedy"],
    director: "Bong Joon Ho",
    cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"],
  },
  {
    id: "grand-budapest",
    type: "movie",
    status: "watched",
    title: "The Grand Budapest Hotel",
    year: 2014,
    runtime: "1h 39m",
    genre: "Comedy",
    poster: `${TMDB}/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg`,
    overview:
      "A legendary concierge at a famous European hotel between the wars befriends a young employee who becomes his trusted protégé.",
    vibes: ["Whimsical", "Cozy Vibe", "Pastel"],
    director: "Wes Anderson",
    cast: ["Ralph Fiennes", "Tony Revolori", "Saoirse Ronan"],
  },
  {
    id: "her",
    type: "movie",
    status: "to-watch",
    title: "Her",
    year: 2013,
    runtime: "2h 6m",
    genre: "Romance",
    poster: `${TMDB}/lEIaL12hSkqZm3KASp4ulVtSeLZ.jpg`,
    overview:
      "In a near future, a lonely writer develops an unlikely relationship with an operating system designed to meet his every need.",
    vibes: ["Cozy Vibe", "Melancholic", "Warm"],
    director: "Spike Jonze",
    cast: ["Joaquin Phoenix", "Scarlett Johansson", "Amy Adams"],
  },
  {
    id: "arrival",
    type: "movie",
    status: "may-watch",
    title: "Arrival",
    year: 2016,
    runtime: "1h 56m",
    genre: "Sci-Fi",
    poster: `${TMDB}/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg`,
    overview:
      "A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.",
    vibes: ["Quiet", "Mind-bending", "Rainy Day"],
    director: "Denis Villeneuve",
    cast: ["Amy Adams", "Jeremy Renner", "Forest Whitaker"],
  },
  {
    id: "la-la-land",
    type: "movie",
    status: "watched",
    title: "La La Land",
    year: 2016,
    runtime: "2h 8m",
    genre: "Musical",
    poster: `${TMDB}/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg`,
    overview: "A jazz pianist falls for an aspiring actress in Los Angeles.",
    vibes: ["Warm", "Bittersweet", "Cozy Vibe"],
    director: "Damien Chazelle",
    cast: ["Ryan Gosling", "Emma Stone", "John Legend"],
  },
  {
    id: "whiplash",
    type: "movie",
    status: "watched",
    title: "Whiplash",
    year: 2014,
    runtime: "1h 46m",
    genre: "Drama",
    poster: `${TMDB}/7fn624j5lj3xTme2SgiLCeuedmO.jpg`,
    overview:
      "A promising young drummer enrolls at a cutthroat music conservatory whose ruthless instructor will stop at nothing to realize a student's potential.",
    vibes: ["Intense", "Sharp", "Pulse"],
    director: "Damien Chazelle",
    cast: ["Miles Teller", "J.K. Simmons", "Melissa Benoist"],
  },
];

export const FILTERS = [
  "All",
  "Movies",
  "TV",
  "Sci-Fi",
  "Drama",
  "Cozy Vibe",
  "Mind-bending",
  "Rainy Day",
];

export const CONTINUE_WATCHING = MOVIES.filter((m) => m.progress);
export const UP_NEXT = MOVIES.filter((m) => m.status === "to-watch").slice(0, 5);
export const RECENTLY_LOGGED = MOVIES.filter((m) => m.status === "watched").slice(0, 5);

export function getMovie(id: string) {
  return MOVIES.find((m) => m.id === id);
}
