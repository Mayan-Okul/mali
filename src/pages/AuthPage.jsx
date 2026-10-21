import { useState } from 'react';
import { ArrowRight, Check, Lock, Mail, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  'Know what to reorder',
  'See who owes you',
  'Understand why profit moved',
];

const inputClass =
  'w-full rounded-xl border border-black/10 bg-canvas/60 pl-11 pr-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60';

function Field({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
      />
      <input {...props} className={inputClass} />
    </div>
  );
}

function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } =
      mode === 'login'
        ? await signIn(email, password)
        : await signUp(email, password, shopName);

    setLoading(false);
    if (authError) setError(authError.message);
  }

  return (
    <div className="min-h-screen bg-canvas lg:grid lg:grid-cols-2">
      <div className="relative bg-gradient-to-br from-primary via-primary to-ink text-white px-6 py-6 lg:px-12 lg:py-10 flex flex-col">
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:44px_44px]" />

        <div className="relative flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center font-extrabold text-sm">
            M
          </div>
          <span className="font-extrabold text-lg tracking-tight font-display">Mali</span>
        </div>

        <div className="relative mt-8 lg:mt-auto lg:mb-auto">
          <h1 className="font-display text-3xl lg:text-5xl font-extrabold tracking-tight">
            Karibu tena
          </h1>
          <p className="text-white/70 text-sm mt-3 max-w-sm hidden lg:block">
            Everything your duka does, in one place.
          </p>

          <ul className="mt-8 space-y-4 hidden lg:block">
            {FEATURES.map(feature => (
              <li key={feature} className="flex items-center gap-3 text-sm font-medium">
                <span className="w-7 h-7 rounded-full bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
                  <Check size={14} strokeWidth={3} />
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-10 lg:py-8">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-black/5 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs text-muted mb-5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Main Counter
          </div>

          <h1 className="text-xl font-extrabold font-display text-ink tracking-tight">
            {mode === 'login' ? 'Counter Terminal Access' : 'Create your account'}
          </h1>
          <p className="text-sm text-muted mt-1 mb-6">
            {mode === 'login'
              ? "Sign in to see what's happening in your shop."
              : 'Set up Mali for your shop in a minute.'}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">Shop name</label>
                <Field
                  icon={Store}
                  type="text"
                  value={shopName}
                  onChange={e => setShopName(e.target.value)}
                  placeholder="Your shop name"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">Email</label>
              <Field
                icon={Mail}
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">Password</label>
              <Field
                icon={Lock}
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-xs text-expenses">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-11 bg-primary text-white font-semibold text-sm rounded-xl py-3 mt-1 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
              {!loading && <ArrowRight size={16} strokeWidth={2.5} />}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError('');
            }}
            className="w-full min-h-11 mt-4 rounded-xl border border-black/10 text-sm font-semibold text-ink hover:bg-canvas"
          >
            {mode === 'login' ? "Don't have an account? Create one" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
