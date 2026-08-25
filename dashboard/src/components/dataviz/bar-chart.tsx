"use client";

import { useId, useState } from "react";

import { formatCompactNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

export type BarChartSeries = {
  key: string;
  label: string;
  /** Validated categorical/sequential hex — see dataviz palette reference. */
  color: string;
  /** Aligned 1:1 with the chart's `categories` array. */
  values: number[];
};

/**
 * Horizontal bar chart (single or grouped, up to 2 series). Built as plain
 * HTML/CSS rows rather than a charting library — see CLAUDE.md "Charts".
 *
 * Follows the dataviz skill's mark spec: <=24px bars, 4px rounded data-end
 * (square at the baseline), a 2px gap between grouped bars, hairline
 * gridlines, per-row hover+focus tooltip carrying every series, and a
 * screen-reader-only table so every value is reachable without hovering.
 */
export function BarChart({
  title,
  categories,
  series,
}: {
  title: string;
  categories: string[];
  series: BarChartSeries[];
}) {
  // Formatting is decided here, not passed in as a prop: a Server
  // Component parent can't hand a function to a Client Component across
  // the RSC boundary (see CLAUDE.md "Charts").
  const valueFormatter = formatCompactNumber;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const captionId = useId();
  const isMultiSeries = series.length > 1;
  const barThickness = isMultiSeries ? 16 : 20;

  const domainMax = niceMax(
    Math.max(1, ...series.flatMap((s) => s.values))
  );
  const ticks = [0, domainMax / 2, domainMax];

  const labelColClass =
    "grid-cols-[minmax(0,9rem)_1fr] sm:grid-cols-[minmax(0,13rem)_1fr]";

  return (
    <div className="w-full">
      <h3 id={captionId} className="sr-only">
        {title}
      </h3>

      {isMultiSeries && (
        <div className="mb-4 flex flex-wrap items-center gap-4">
          {series.map((s) => (
            <div
              key={s.key}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <span
                aria-hidden
                className="h-2 w-3 shrink-0 rounded-[2px]"
                style={{ backgroundColor: s.color }}
              />
              {s.label}
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2.5">
        {categories.map((category, i) => {
          const isActive = activeIndex === i;
          const summary = series
            .map((s) => `${s.label}: ${valueFormatter(s.values[i] ?? 0)}`)
            .join(", ");

          return (
            <div
              key={`${category}-${i}`}
              tabIndex={0}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex((v) => (v === i ? null : v))}
              onFocus={() => setActiveIndex(i)}
              onBlur={() => setActiveIndex((v) => (v === i ? null : v))}
              aria-label={`${category}: ${summary}`}
              className={cn(
                "group relative grid items-center gap-3 rounded-md px-1.5 py-1 outline-none focus-visible:ring-2 focus-visible:ring-ring",
                labelColClass
              )}
            >
              <span
                className="truncate text-sm text-foreground/90"
                title={category}
              >
                {category}
              </span>

              <div className="relative flex flex-col justify-center gap-0.5 py-1">
                <div className="pointer-events-none absolute inset-0 flex justify-between">
                  {ticks.map((t) => (
                    <span key={t} className="w-px bg-border" />
                  ))}
                </div>

                {series.map((s) => {
                  const raw = s.values[i] ?? 0;
                  const width =
                    raw > 0 ? Math.max((raw / domainMax) * 100, 1.5) : 0;
                  return (
                    <div key={s.key} className="flex items-center gap-2">
                      <div
                        className={cn(
                          "rounded-r-[4px] transition-[filter] duration-150",
                          isActive && "brightness-125"
                        )}
                        style={{
                          width: `${width}%`,
                          height: barThickness,
                          backgroundColor: s.color,
                        }}
                      />
                      {!isMultiSeries && raw > 0 && (
                        <span className="text-xs font-medium tabular-nums text-muted-foreground">
                          {valueFormatter(raw)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {isActive && (
                <div
                  role="tooltip"
                  className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 w-max max-w-64 -translate-x-1/2 rounded-md border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md"
                >
                  <p className="mb-1 truncate font-medium">{category}</p>
                  <div className="space-y-0.5">
                    {series.map((s) => (
                      <p key={s.key} className="flex items-center gap-1.5">
                        <span
                          aria-hidden
                          className="h-2 w-3 shrink-0 rounded-[2px]"
                          style={{ backgroundColor: s.color }}
                        />
                        <span className="font-semibold tabular-nums">
                          {valueFormatter(s.values[i] ?? 0)}
                        </span>
                        <span className="text-muted-foreground">
                          {s.label}
                        </span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={cn("mt-2 grid gap-3", labelColClass)}>
        <span aria-hidden />
        <div className="flex justify-between text-[11px] text-muted-foreground">
          {ticks.map((t, idx) => (
            <span key={t} className={idx === ticks.length - 1 ? "text-right" : ""}>
              {valueFormatter(t)}
            </span>
          ))}
        </div>
      </div>

      {/* Same data as a real table — reachable without hovering/focusing a bar. */}
      <table className="sr-only" aria-labelledby={captionId}>
        <thead>
          <tr>
            <th scope="col">Elemento</th>
            {series.map((s) => (
              <th scope="col" key={s.key}>
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.map((category, i) => (
            <tr key={`${category}-row-${i}`}>
              <th scope="row">{category}</th>
              {series.map((s) => (
                <td key={s.key}>{valueFormatter(s.values[i] ?? 0)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Rounds up to a clean 1/2/5×10^n ceiling so axis ticks read as round numbers. */
function niceMax(value: number): number {
  if (value <= 0) return 1;
  const exponent = Math.floor(Math.log10(value));
  const magnitude = 10 ** exponent;
  const fraction = value / magnitude;
  const niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return niceFraction * magnitude;
}
