function SectionCard({ title, accent, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${accent}`} />
        <h2 className="font-semibold text-slate-800">{title}</h2>
      </div>
      <div className="text-slate-500 text-sm">{children}</div>
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              M
            </div>
            <span className="font-semibold text-slate-800 text-lg">Mali</span>
          </div>
          <span className="text-xs text-slate-400">Mama Nia's Duka · Demo</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Good morning 👋</h1>
          <p className="text-slate-500 text-sm mt-1">
            Here's what's happening in your shop today.
          </p>
        </div>

        {/* AI Insights placeholder — built out Thursday */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
          <h2 className="font-semibold text-emerald-800 mb-2">AI Insights</h2>
          <p className="text-emerald-700 text-sm">
            Insight cards (reorder alerts, profit trends, slow-moving products,
            unpaid customers) will render here.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SectionCard title="Sales" accent="bg-emerald-500">
            Coming soon
          </SectionCard>
          <SectionCard title="Inventory" accent="bg-amber-500">
            Coming soon
          </SectionCard>
          <SectionCard title="Customers" accent="bg-sky-500">
            Coming soon
          </SectionCard>
          <SectionCard title="Expenses" accent="bg-rose-500">
            Coming soon
          </SectionCard>
        </div>
      </main>
    </div>
  )
}

export default App
