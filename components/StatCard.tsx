export type StatCardTone = "default" | "danger" | "warning";

const TONE_BORDER: Record<StatCardTone, string> = {
  default: "border-slate-800 bg-slate-900/60",
  danger: "border-red-900/60 bg-red-950/30",
  warning: "border-amber-900/60 bg-amber-950/20",
};

const TONE_VALUE: Record<StatCardTone, string> = {
  default: "text-slate-100",
  danger: "text-red-400",
  warning: "text-amber-400",
};

export function StatCard({
  label,
  value,
  tone = "default",
  caption,
}: {
  label: string;
  value: number;
  tone?: StatCardTone;
  caption?: string;
}) {
  return (
    <div className={`rounded-lg border ${TONE_BORDER[tone]} p-5`}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className={`mt-2 text-3xl font-semibold tabular-nums ${TONE_VALUE[tone]}`}>
        {value}
      </p>
      {caption && <p className="mt-1 text-xs text-slate-500">{caption}</p>}
    </div>
  );
}
