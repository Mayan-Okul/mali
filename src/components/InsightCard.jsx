const severityStyles = {
  critical: 'bg-rose-50 border-rose-200 text-rose-700',
  warning: 'bg-amber-50 border-amber-200 text-amber-700',
  info: 'bg-sky-50 border-sky-200 text-sky-700',
  positive: 'bg-emerald-50 border-emerald-200 text-emerald-700',
};

function InsightCard({ icon, title, description, severity = 'info' }) {
  return (
    <div className={`rounded-xl border p-4 flex flex-col gap-1 ${severityStyles[severity]}`}>
      <div className="flex items-center gap-2">
        <span className="text-lg leading-none">{icon}</span>
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      <p className="text-sm opacity-90">{description}</p>
    </div>
  );
}

export default InsightCard;
