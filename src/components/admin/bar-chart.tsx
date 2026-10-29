import { cn } from '@/lib/cn'

// A small column chart in plain HTML and CSS (no chart library), used by the admin reports.
// Columns stack their series upwards from a zero line; negative values hang below it.
// Every column is focusable and shows its numbers on hover or focus; each report also has a
// table with the same numbers. Marks follow the dataviz rules: <= 24px wide, 4px rounded ends,
// 2px gaps between stacked parts, text in ink (never the series colour).

export type ChartSeries = { key: string; label: string; className: string }
export type ChartColumn = {
  key: string
  label: string
  longLabel: string
  values: Record<string, number>
}

export function BarChart({
  title,
  series,
  columns,
  format,
  height = 180,
}: {
  title: string
  series: ChartSeries[]
  columns: ChartColumn[]
  format: (value: number) => string
  height?: number
}) {
  const totals = columns.map((column) => {
    const values = series.map((s) => column.values[s.key] ?? 0)
    return {
      up: values.filter((v) => v > 0).reduce((a, b) => a + b, 0),
      down: values.filter((v) => v < 0).reduce((a, b) => a + b, 0),
      net: values.reduce((a, b) => a + b, 0),
    }
  })
  const top = Math.max(0, ...totals.map((t) => t.up))
  const bottom = Math.min(0, ...totals.map((t) => t.down))
  const range = top - bottom || 1
  const zero = (-bottom / range) * 100
  const peak = totals.reduce((best, t, i) => (t.net > (totals[best]?.net ?? 0) ? i : best), 0)
  const trough = totals.reduce((low, t, i) => (t.net < (totals[low]?.net ?? 0) ? i : low), 0)

  return (
    <figure className="flex flex-col gap-3">
      <figcaption className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-semibold">{title}</span>
        {series.length > 1 ? (
          <span className="flex flex-wrap gap-4 text-caption text-ink/70">
            {series.map((s) => (
              <span key={s.key} className="flex items-center gap-1.5">
                <span aria-hidden className={cn('size-2.5 rounded-[2px]', s.className)} />
                {s.label}
              </span>
            ))}
          </span>
        ) : null}
      </figcaption>

      {/* The top margin leaves room for the best month's label above its column. */}
      <div className={cn('relative mt-6', bottom < 0 && 'mb-6')} style={{ height }}>
        {/* Recessive scale: a line at the top value (labelled on its column) and the zero line. */}
        {top > 0 ? (
          <div className="absolute inset-x-0 top-0 border-t border-dashed border-line" />
        ) : null}
        <div className="absolute inset-x-0 border-t border-ink/30" style={{ bottom: `${zero}%` }} />

        <div
          className="absolute inset-0 grid"
          style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
        >
          {columns.map((column, index) => {
            const total = totals[index]!
            const up = series.filter((s) => (column.values[s.key] ?? 0) > 0)
            const down = series.filter((s) => (column.values[s.key] ?? 0) < 0)
            const summary = [
              ...series.map((s) => `${s.label} ${format(column.values[s.key] ?? 0)}`),
              ...(series.length > 1 ? [`Total ${format(total.net)}`] : []),
            ].join(', ')
            return (
              <div
                key={column.key}
                tabIndex={0}
                aria-label={`${column.longLabel}: ${summary}`}
                className="group relative h-full outline-none hover:bg-ink/5 focus-visible:bg-ink/5"
              >
                {up.length > 0 ? (
                  <div
                    className="absolute left-1/2 flex w-[min(24px,70%)] -translate-x-1/2 flex-col-reverse gap-[2px] overflow-hidden rounded-t-[4px]"
                    style={{ bottom: `${zero}%`, height: `${(total.up / range) * 100}%` }}
                  >
                    {up.map((s) => (
                      <div
                        key={s.key}
                        className={s.className}
                        style={{ flexGrow: column.values[s.key], minHeight: 1 }}
                      />
                    ))}
                  </div>
                ) : null}
                {down.length > 0 ? (
                  <div
                    className="absolute left-1/2 flex w-[min(24px,70%)] -translate-x-1/2 flex-col gap-[2px] overflow-hidden rounded-b-[4px]"
                    style={{ top: `${100 - zero}%`, height: `${(-total.down / range) * 100}%` }}
                  >
                    {down.map((s) => (
                      <div
                        key={s.key}
                        className={s.className}
                        style={{ flexGrow: -(column.values[s.key] ?? 0), minHeight: 1 }}
                      />
                    ))}
                  </div>
                ) : null}

                {/* Direct labels only for the best month and, if any month lost money, the worst. */}
                {index === peak && total.net > 0 ? (
                  <span
                    aria-hidden
                    className="absolute left-1/2 -translate-x-1/2 text-caption font-medium whitespace-nowrap text-ink/80 tabular-nums group-hover:opacity-0 group-focus-visible:opacity-0"
                    style={{ bottom: `calc(${zero + (total.up / range) * 100}% + 4px)` }}
                  >
                    {format(total.net)}
                  </span>
                ) : null}

                {index === trough && total.net < 0 ? (
                  <span
                    aria-hidden
                    className="absolute left-1/2 -translate-x-1/2 text-caption font-medium whitespace-nowrap text-ink/80 tabular-nums group-hover:opacity-0 group-focus-visible:opacity-0"
                    style={{ top: `calc(${100 - zero + (-total.down / range) * 100}% + 4px)` }}
                  >
                    {format(total.net)}
                  </span>
                ) : null}

                <div
                  role="tooltip"
                  className={cn(
                    'pointer-events-none absolute bottom-full z-10 mb-2 hidden w-max min-w-36 flex-col gap-1 rounded-control border border-line bg-control p-3 text-caption shadow-float group-hover:flex group-focus-visible:flex',
                    index < columns.length / 2 ? 'left-0' : 'right-0',
                  )}
                >
                  <span className="font-semibold">{column.longLabel}</span>
                  {series.map((s) => (
                    <span key={s.key} className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-1.5 text-ink/70">
                        <span aria-hidden className={cn('size-2 rounded-[2px]', s.className)} />
                        {s.label}
                      </span>
                      <span className="tabular-nums">{format(column.values[s.key] ?? 0)}</span>
                    </span>
                  ))}
                  {series.length > 1 ? (
                    <span className="flex justify-between gap-4 border-t border-line pt-1 font-semibold">
                      Total <span className="tabular-nums">{format(total.net)}</span>
                    </span>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div
        aria-hidden
        className="grid text-center text-caption text-ink/55"
        style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
      >
        {columns.map((column) => (
          <span key={column.key}>{column.label}</span>
        ))}
      </div>
    </figure>
  )
}
