import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell } from "@/components/app-shell";
import { MOVIES } from "@/lib/movies";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "Journal — Slate" },
      { name: "description", content: "Your viewing journal — hours, films, and vibes." },
    ],
  }),
  component: StatsPage,
});

const STATS = [
  { label: "Films logged", value: "128", sub: "this year" },
  { label: "Total runtime", value: "312", sub: "hours in the dark" },
  { label: "Avg. rating", value: "4.2", sub: "out of 5" },
  { label: "Watchlist", value: "47", sub: "queued up" },
];

const VIBE_WEIGHTS = [
  { v: "Mind-bending", w: 24 },
  { v: "Rainy Day", w: 18 },
  { v: "Cozy Vibe", w: 16 },
  { v: "Melancholic", w: 14 },
  { v: "Epic", w: 12 },
  { v: "Sharp", w: 9 },
  { v: "Whimsical", w: 7 },
];

function StatsPage() {
  return (
    <AppShell>
      <div className="px-4 pb-32 pt-8 sm:px-8 lg:px-10 lg:pt-10">
        <p className="label-eyebrow">
          <span className="text-[var(--gold)]">●</span>&nbsp;&nbsp;Journal · 2024
        </p>
        <h1 className="mt-3 font-serif text-4xl italic tracking-tight sm:text-6xl">
          The year, <span className="text-white/40">tallied</span> & remembered.
        </h1>

        {/* Stat grid */}
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.45 }}
              className="tile p-6"
            >
              <p className="label-eyebrow">{s.label}</p>
              <p className="mt-3 font-serif text-6xl italic leading-none">{s.value}</p>
              <p className="mt-2 text-xs text-white/45">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Two-column editorial */}
        <div className="mt-6 grid gap-3 md:grid-cols-12 md:gap-4">
          {/* Vibe cloud */}
          <section className="tile p-7 md:col-span-7">
            <div className="flex items-end justify-between">
              <div>
                <p className="label-eyebrow">Vibe Index</p>
                <p className="mt-1 font-serif text-2xl italic">What 2024 felt like</p>
              </div>
              <span className="font-serif text-xs italic text-[var(--gold)]">7 dominant</span>
            </div>
            <div className="mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-3">
              {VIBE_WEIGHTS.map((vw) => (
                <motion.span
                  key={vw.v}
                  whileTap={{ scale: 0.96 }}
                  className="font-serif italic transition-colors hover:text-[var(--gold-soft)]"
                  style={{
                    fontSize: `${0.9 + vw.w / 8}rem`,
                    opacity: 0.5 + vw.w / 50,
                  }}
                >
                  {vw.v}
                </motion.span>
              ))}
            </div>
          </section>

          {/* Genre breakdown bars */}
          <section className="tile p-7 md:col-span-5">
            <p className="label-eyebrow">By Genre</p>
            <p className="mt-1 font-serif text-2xl italic">Where you spent your hours</p>
            <ul className="mt-5 space-y-3">
              {[
                { g: "Sci-Fi", p: 38 },
                { g: "Drama", p: 24 },
                { g: "Thriller", p: 16 },
                { g: "Comedy", p: 12 },
                { g: "Romance", p: 10 },
              ].map((row) => (
                <li key={row.g}>
                  <div className="flex items-baseline justify-between">
                    <span className="font-serif text-sm italic">{row.g}</span>
                    <span className="label-eyebrow">{row.p}%</span>
                  </div>
                  <div className="mt-1 h-px w-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${row.p}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-px bg-[var(--gold)]"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Recently logged strip */}
        <section className="mt-10">
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-3xl italic">Recently committed to memory</h2>
            <span className="label-eyebrow">Nov · Dec</span>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6 md:gap-4">
            {MOVIES.slice(0, 6).map((m) => (
              <motion.div
                key={m.id}
                whileTap={{ scale: 0.96 }}
                className="overflow-hidden rounded-xl ring-1 ring-white/10"
              >
                <img src={m.poster} alt={m.title} className="aspect-[2/3] w-full object-cover" />
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
