import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:glass-strong group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-full",
          title: "font-serif italic tracking-wide text-[var(--gold)]",
          description:
            "group-[.toast]:text-white/60 text-xs font-medium uppercase tracking-[0.1em]",
          actionButton: "group-[.toast]:bg-[var(--gold)] group-[.toast]:text-black",
          cancelButton: "group-[.toast]:bg-white/10 group-[.toast]:text-white/60",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
