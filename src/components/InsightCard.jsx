function InsightRow({ icon: Icon, color, title, description, aiTag }) {
  return (
    <div className="px-5 py-4 flex gap-3.5">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}1A`, color }}
      >
        <Icon size={17} strokeWidth={2.2} />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-ink">{title}</h3>
          {aiTag && (
            <span className="text-[10px] font-bold uppercase tracking-wide bg-primary/10 text-primary px-1.5 py-0.5 rounded">
              AI
            </span>
          )}
        </div>
        <p className="text-sm text-muted leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default InsightRow;
