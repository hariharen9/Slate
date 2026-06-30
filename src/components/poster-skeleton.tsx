import { motion } from "framer-motion";

type Props = {
  count?: number;
  className?: string;
};

/** Shimmer skeleton matching the poster tile aspect ratio */
export function PosterSkeleton({ count = 1, className }: Props) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
          className={`tile overflow-hidden ${className ?? ""}`}
        >
          <div className="relative h-full w-full animate-pulse bg-white/[0.04]">
            {/* Shimmer sweep */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          </div>
        </motion.div>
      ))}
    </>
  );
}

/** Horizontal skeleton for list items */
export function ListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="h-14 w-10 shrink-0 rounded-md bg-white/[0.06]" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-white/[0.06]" />
            <div className="h-3 w-1/2 rounded bg-white/[0.04]" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Large hero skeleton */
export function HeroSkeleton() {
  return (
    <div className="tile col-span-2 row-span-4 md:col-span-6 md:row-span-5 lg:col-span-7 lg:row-span-6 animate-pulse">
      <div className="relative h-full w-full bg-white/[0.04]">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 space-y-4">
          <div className="h-3 w-28 rounded bg-white/[0.08]" />
          <div className="h-12 w-2/3 rounded bg-white/[0.08]" />
          <div className="h-px w-full bg-white/[0.06]" />
        </div>
      </div>
    </div>
  );
}
