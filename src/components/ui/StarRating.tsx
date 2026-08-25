import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  size?: number;
  onChange?: (value: number) => void;
  className?: string;
}

export function StarRating({ value, size = 16, onChange, className = '' }: StarRatingProps) {
  const interactive = typeof onChange === 'function';

  return (
    <div
      className={`flex items-center gap-1 ${className}`}
      role={interactive ? 'radiogroup' : undefined}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(value);
        const icon = (
          <Star
            style={{ width: size, height: size }}
            className={filled ? 'fill-gold text-gold-deep' : 'text-line [.on-dark_&]:text-white/25'}
          />
        );
        return interactive ? (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === Math.round(value)}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            onClick={() => onChange?.(star)}
            className="p-1 transition-transform duration-200 hover:scale-125"
          >
            {icon}
          </button>
        ) : (
          <span key={star}>{icon}</span>
        );
      })}
    </div>
  );
}
