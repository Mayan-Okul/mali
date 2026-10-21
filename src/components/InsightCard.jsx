function InsightRow({ icon: Icon, tone, title, description, aiTag }) {
  return (
    <div className="px-5 py-4 flex gap-3.5">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tone}`}>
        <Icon size={17} strokeWidth={2.2} />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-display font-semibold text-sm text-ink">{title}</h3>
          {aiTag && (
            <span className="text-[10px] font-bold uppercase tracking-wide bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
              AI
            </span>
          )}
        </div>
        <p className="text-sm text-muted leading-relaxed mt-0.5">{description}</p>
      </div>
    </div>
  );
}

export default InsightRow;
