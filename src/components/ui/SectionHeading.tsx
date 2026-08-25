interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({ eyebrow, title, description, align = 'center' }: SectionHeadingProps) {
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left';
  return (
    <div className={`flex max-w-2xl flex-col gap-3 sm:gap-4 ${alignment}`} data-reveal>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="text-fluid-h2">{title}</h2>
      {description && (
        <p className="max-w-prose text-fluid-base text-ink-muted [.on-dark_&]:text-white/60">
          {description}
        </p>
      )}
    </div>
  );
}
