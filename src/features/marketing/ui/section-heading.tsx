type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

/** En-tête de section réutilisable sur la landing page. */
export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center">
      <p className="text-xs font-bold tracking-[0.16em] text-primary-strong uppercase">{eyebrow}</p>
      <h2 className="font-display text-2xl font-extrabold tracking-tight text-navy text-balance sm:text-3xl">
        {title}
      </h2>
      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">{description}</p>
    </div>
  );
}
