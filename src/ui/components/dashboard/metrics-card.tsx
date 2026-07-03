interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

export function MetricsCard({ title, value, subtitle, color = '#22c55e' }: MetricsCardProps) {
  return (
    <div className="bg-slate-800 p-4 rounded-lg text-center">
      <div className="text-2xl font-bold" style={{ color }}>
        {value}
      </div>
      <div className="text-sm text-slate-400">{title}</div>
      {subtitle && (
        <div className="text-xs text-slate-500 mt-1">{subtitle}</div>
      )}
    </div>
  );
}