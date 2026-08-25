import { useCountUp } from '@/hooks/useCountUp';

interface CounterProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function Counter({ value, decimals = 0, prefix = '', suffix = '', className = '' }: CounterProps) {
  const { ref, value: current } = useCountUp(value);
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {current.toLocaleString('en-AU', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
