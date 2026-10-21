import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatKES, getHourlySales } from '../../lib/dashboardStats';
import { Card, CardEmpty } from './ui';

const DAY = 24 * 60 * 60 * 1000;

export default function HourlySalesChart({ sales, products }) {
  const [tab, setTab] = useState('today');
  const day = tab === 'today' ? new Date() : new Date(Date.now() - DAY);
  const data = getHourlySales(sales, products, day);
  const hasData = data.some(b => b.revenue > 0);

  return (
    <Card
      title="Hourly sales"
      action={
        <div className="flex items-center gap-1 bg-canvas rounded-xl p-1">
          {['today', 'yesterday'].map(key => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`min-h-11 px-3 sm:px-4 rounded-lg text-xs font-semibold capitalize ${
                tab === key ? 'bg-primary text-white' : 'text-muted hover:text-ink'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      }
    >
      {hasData ? (
        <div className="h-64 px-3 py-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--color-muted)" strokeOpacity={0.15} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: 'var(--color-muted)' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={12}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'var(--color-muted)' }}
                axisLine={false}
                tickLine={false}
                width={38}
              />
              <Tooltip
                cursor={{ fill: 'var(--color-ink)', fillOpacity: 0.04 }}
                formatter={value => formatKES(value)}
                contentStyle={{ borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)', fontSize: 12 }}
              />
              <Bar dataKey="revenue" fill="var(--color-primary)" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <CardEmpty>{tab === 'today' ? 'No sales yet today.' : 'No sales yesterday.'}</CardEmpty>
      )}
    </Card>
  );
}
