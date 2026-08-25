import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, Loader2, MapPin, Navigation, Plane, Sparkles, Train, X } from 'lucide-react';
import { localSuggestions, suggestPlaces } from '@/services/geo';
import type { Place } from '@/types';

interface AddressInputProps {
  label: string;
  placeholder: string;
  value: Place | null;
  onChange: (place: Place | null) => void;
  tone?: 'gold' | 'silver';
  id: string;
}

function getLocationIcon(label: string, suburb?: string) {
  const text = `${label} ${suburb ?? ''}`.toLowerCase();
  if (text.includes('airport') || text.includes('tullamarine') || text.includes('avalon')) {
    return <Plane className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />;
  }
  if (text.includes('station') || text.includes('southern cross') || text.includes('flinders')) {
    return <Train className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />;
  }
  if (text.includes('cbd') || text.includes('crown') || text.includes('collins') || text.includes('promenade')) {
    return <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />;
  }
  return <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 group-hover:text-gold-deep transition-colors" />;
}

function getLocationTag(label: string, suburb?: string) {
  const text = `${label} ${suburb ?? ''}`.toLowerCase();
  if (text.includes('airport') || text.includes('tullamarine') || text.includes('avalon')) {
    return 'Airport';
  }
  if (text.includes('station') || text.includes('southern cross')) {
    return 'Transit Hub';
  }
  if (text.includes('cbd') || text.includes('crown')) {
    return 'Landmark';
  }
  return 'Suburb / Area';
}

export function AddressInput({
  label,
  placeholder,
  value,
  onChange,
  tone = 'gold',
  id,
}: AddressInputProps) {
  const [query, setQuery] = useState(value?.label ?? '');
  const [options, setOptions] = useState<Place[]>(() => localSuggestions(value?.label ?? ''));
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setQuery(value?.label ?? '');
  }, [value]);

  useEffect(() => {
    const onClickAway = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickAway);
    return () => document.removeEventListener('mousedown', onClickAway);
  }, []);

  // Update suggestions immediately on query change
  useEffect(() => {
    const local = localSuggestions(query);
    setOptions(local);

    if (query.trim().length >= 2) {
      setLoading(true);
      const timer = window.setTimeout(async () => {
        const results = await suggestPlaces(query);
        setOptions(results);
        setLoading(false);
      }, 350);
      return () => {
        window.clearTimeout(timer);
        setLoading(false);
      };
    }
  }, [query]);

  const handleFocus = () => {
    setOpen(true);
    setOptions(localSuggestions(query));
  };

  const handleSelectOption = (option: Place) => {
    onChange(option);
    setQuery(option.label);
    setOpen(false);
  };

  const dotColour = tone === 'gold' ? 'bg-gold-deep' : 'bg-ink-muted';

  return (
    <div className="relative" ref={wrapRef}>
      <div className="flex items-center justify-between">
        <label className="field-label font-bold text-slate-800 text-xs flex items-center gap-1.5" htmlFor={id}>
          {tone === 'gold' ? (
            <span className="inline-block h-2 w-2 rounded-full bg-gold-deep" />
          ) : (
            <span className="inline-block h-2 w-2 rounded-full bg-slate-400" />
          )}
          {label}
        </label>
        {open && options.length > 0 && (
          <span className="text-[0.68rem] text-slate-500 font-medium">
            {query.trim() ? `${options.length} suggestions` : 'Popular locations'}
          </span>
        )}
      </div>

      <div className="relative mt-1">
        <span
          className={`pointer-events-none absolute left-3.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ${dotColour}`}
        />
        <input
          id={id}
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          onFocus={handleFocus}
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            setOpen(true);
            if (!val.trim()) {
              onChange(null);
            } else {
              onChange({
                label: val.trim(),
                suburb: val.split(',')[0].trim() || 'Melbourne',
                lat: value?.lat ?? -37.8136,
                lng: value?.lng ?? 144.9631,
              });
            }
          }}
          onBlur={() => {
            if (query.trim()) {
              const match = options.find((o) => o.label.toLowerCase() === query.trim().toLowerCase());
              if (match) {
                onChange(match);
              } else {
                onChange({
                  label: query.trim(),
                  suburb: query.split(',')[0].trim() || 'Melbourne',
                  lat: value?.lat ?? -37.8136,
                  lng: value?.lng ?? 144.9631,
                });
              }
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (options.length > 0) {
                handleSelectOption(options[0]);
              } else if (query.trim()) {
                onChange({
                  label: query.trim(),
                  suburb: query.split(',')[0].trim() || 'Melbourne',
                  lat: value?.lat ?? -37.8136,
                  lng: value?.lng ?? 144.9631,
                });
                setOpen(false);
              }
            } else if (e.key === 'Escape') {
              setOpen(false);
            }
          }}
          className="w-full pl-9 pr-9 font-bold text-slate-900 bg-white border-slate-300 placeholder:text-slate-500 placeholder:font-normal shadow-sm focus:border-gold-deep focus:ring-1 focus:ring-gold-deep"
        />
        {loading ? (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gold-deep" />
        ) : query ? (
          <button
            type="button"
            aria-label={`Clear ${label}`}
            onClick={() => {
              setQuery('');
              onChange(null);
              setOptions(localSuggestions(''));
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-gold-ink [.on-dark_&]:text-white/60"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <AnimatePresence>
        {open && options.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute z-[1000] mt-1.5 max-h-72 w-full overflow-y-auto rounded-2xl border-2 border-gold-deep/30 bg-white p-2 shadow-2xl ring-1 ring-black/5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200"
          >
            <div className="px-2 py-1 pb-1.5 flex items-center justify-between text-[0.65rem] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <span className="flex items-center gap-1">
                {query.trim() ? (
                  <>
                    <Navigation className="h-3 w-3 text-gold-deep" /> Matching Suggestions
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3 text-gold-deep" /> Popular Melbourne Destinations
                  </>
                )}
              </span>
              <span className="text-[0.62rem] text-slate-400 font-normal">Click to select</span>
            </div>

            <ul className="mt-1 space-y-0.5">
              {options.map((option) => {
                const tag = getLocationTag(option.label, option.suburb);
                return (
                  <li key={`${option.label}-${option.lat}-${option.lng}`}>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        // Prevent input blur before click registers
                        e.preventDefault();
                        handleSelectOption(option);
                      }}
                      className="group flex w-full items-start justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 hover:bg-gold/15 active:bg-gold/25"
                    >
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        {getLocationIcon(option.label, option.suburb)}
                        <div className="min-w-0 flex-1">
                          <span className="block truncate text-xs sm:text-fluid-sm font-bold text-slate-900 group-hover:text-amber-950">
                            {option.label}
                          </span>
                          {(option.suburb || option.postcode) && (
                            <span className="block text-[0.68rem] sm:text-xs font-medium text-slate-500 group-hover:text-amber-900/80">
                              {[option.suburb, option.postcode ? `VIC ${option.postcode}` : null]
                                .filter(Boolean)
                                .join(' · ')}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="shrink-0 self-center text-[0.62rem] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-gold/30 group-hover:text-amber-950 transition-colors">
                        {tag}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

