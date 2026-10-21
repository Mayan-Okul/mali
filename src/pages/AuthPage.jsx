import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

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
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-black/5 shadow-sm p-8">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-extrabold text-sm">
            M
          </div>
          <span className="font-extrabold text-ink text-lg tracking-tight">Mali</span>
        </div>

        <h1 className="text-xl font-extrabold text-ink mb-1">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="text-sm text-muted mb-6">
          {mode === 'login'
            ? 'Sign in to see what\'s happening in your shop.'
            : 'Set up Mali for your shop in a minute.'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">Shop name</label>
              <input
                type="text"
                value={shopName}
                onChange={e => setShopName(e.target.value)}
                placeholder="Nia's Duka"
                className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {error && <p className="text-xs text-expenses">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-semibold text-sm rounded-xl py-2.5 mt-1 disabled:opacity-60"
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="text-xs text-muted text-center mt-5">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError('');
            }}
            className="text-primary font-semibold"
          >
            {mode === 'login' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
