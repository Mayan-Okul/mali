import { useState } from 'react';
import { ArrowRight, Check, Lock, Mail, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { readLastShop, rememberShopName } from '../lib/lastShop';

const FEATURES = [
  'Know what to reorder',
  'See who owes you',
  'Understand why profit moved',
];

// Names what Mali tracks. No figures here: nobody is signed in yet,
// so any number on this screen would be invented.
const TRACKED = [
  ['Reorder alerts', 'Know what to reorder before stock runs out.'],
  ['Deni owed', 'See who owes you, and how much.'],
  ['Profit movement', 'Understand why profit moved.'],
];

const inputClass =
  'w-full h-12 rounded-xl border border-slate-200 bg-blue-50 pl-11 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20';

function Field({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
      />
      <input {...props} className={inputClass} />
    </div>
  );
}
const ERRORS = [
  ['invalid login', 'Wrong email or password. Please try again.'],
  ['already registered', 'This email already has an account. Try signing in instead.'],
  ['at least 6 characters', 'Your password must be at least 6 characters.'],
  ['different from the old', 'Choose a password you have not used before.'],
  ['not confirmed', 'Please confirm your email first. Check your inbox.'],
  ['rate limit', 'Too many attempts. Please wait a few minutes and try again.'],
  ['fetch', "Can't connect. Check your internet and try again."],
];

function friendlyError(message) {
  const text = String(message || '').toLowerCase();
  const match = ERRORS.find(([phrase]) => text.includes(phrase));
  return match ? match[1] : 'Something went wrong. Please try again.';
}

function AuthPage({ recoveryMode = false, onRecoveryDone }) {
  const { signIn, signUp, resetPassword, updatePassword } = useAuth();
  const [mode, setMode] = useState(recoveryMode ? 'reset' : 'login'); // 'login' | 'signup' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastShop, setLastShop] = useState(readLastShop);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);

    if (recoveryMode) {
      const { error: updateError } = await updatePassword(password);
      setLoading(false);
      if (updateError) setError(friendlyError(updateError.message));
      else onRecoveryDone?.();
      return;
    }

    const { data, error: authError } =
      mode === 'login'
        ? await signIn(email, password)
        : await signUp(email, password, shopName);

    setLoading(false);
    if (authError) {
      setError(friendlyError(authError.message));
      return;
    }

    // Remember this browser's last shop name for the welcome-back headline.
    const name =
      mode === 'signup' ? shopName : data?.user?.user_metadata?.shop_name;
    if (name) {
      rememberShopName(name);
      setLastShop(name);
    }
  }

  async function handleForgotPassword() {
    setError('');
    setNotice('');
    if (!email.trim()) {
      setError('Enter your email above so we know where to send the reset link.');
      return;
    }
    const { error: resetError } = await resetPassword(email);
    if (resetError) setError(friendlyError(resetError.message));
    else setNotice('Check your inbox — we sent you a password reset link.');
  }

  return (
    <div className="min-h-screen bg-slate-50 font-display lg:grid lg:grid-cols-2">
      <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-900 to-emerald-950 px-6 py-7 text-white lg:px-14 lg:py-14 xl:px-16 xl:py-16">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(rgba(255,255,255,0.12)_1.5px,transparent_1.5px)] bg-[size:24px_24px]" />

        <div className="relative flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center font-extrabold text-lg">
            M
            <span className="absolute -right-1 -bottom-1 w-3 h-3 rounded-full bg-amber-500 border-2 border-emerald-900" />
          </div>
          <div>
            <div className="text-lg font-bold leading-tight">Mali POS</div>
            <div className="text-[13px] font-normal text-emerald-200">
              Retail POS &amp; Ledger
            </div>
          </div>
        </div>

        <div className="relative mt-10 lg:mt-auto lg:mb-auto">
          <h1 className="text-2xl lg:text-[30px] font-bold leading-tight tracking-[-0.02em]">
            {lastShop ? `Karibu tena, ${lastShop}!` : 'Run your duka smarter'}
          </h1>
          <p className="text-[15px] leading-relaxed text-emerald-100 mt-3 max-w-[440px]">
            {lastShop
              ? "Sign in to open your counter, record customer deni, and track today's inventory."
              : 'Everything your duka does, in one place.'}
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

        <div className="relative mt-10 lg:mt-12 hidden sm:block">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            What Mali tracks
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            {TRACKED.map(([label, note]) => (
              <div
                key={label}
                className="rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md"
              >
                <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-200">
                  {label}
                </div>
                <div className="text-sm font-bold leading-snug mt-1.5">{note}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-8 mt-8 border-t border-white/10 text-[13px] text-emerald-200">
            <Store size={16} />
            Built in Kisumu for Kenyan dukas
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-8 sm:py-10 lg:py-8">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-8 lg:p-10">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {recoveryMode
              ? 'Set a new password'
              : mode === 'login'
                ? 'Counter Terminal Access'
                : 'Create your account'}
          </h1>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            {recoveryMode
              ? 'Choose a fresh password for your Mali account.'
              : mode === 'login'
                ? "Sign in to see what's happening in your shop."
                : 'Set up Mali for your shop in a minute.'}
          </p>

          {!recoveryMode && (
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-blue-50 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                  setNotice('');
                }}
                aria-pressed={mode === 'login'}
                className={`rounded-lg px-3 py-2.5 text-sm border transition-colors ${
                  mode === 'login'
                    ? 'bg-white border-slate-200/80 shadow-sm font-bold text-slate-900'
                    : 'border-transparent font-medium text-slate-500 hover:text-slate-700'
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError('');
                  setNotice('');
                }}
                aria-pressed={mode === 'signup'}
                className={`rounded-lg px-3 py-2.5 text-sm border transition-colors ${
                  mode === 'signup'
                    ? 'bg-white border-slate-200/80 shadow-sm font-bold text-slate-900'
                    : 'border-transparent font-medium text-slate-500 hover:text-slate-700'
                }`}
              >
                Create account
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!recoveryMode && mode === 'signup' && (
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Shop name
                </label>
                <Field
                  icon={Store}
                  type="text"
                  value={shopName}
                  onChange={e => setShopName(e.target.value)}
                  placeholder="Your shop name"
                />
              </div>
            )}

            {!recoveryMode && (
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Email
                </label>
                <Field
                  icon={Mail}
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                {recoveryMode ? 'New password' : 'Password'}
              </label>
              <Field
                icon={Lock}
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={recoveryMode ? 'new-password' : 'current-password'}
              />
            </div>

            {!recoveryMode && mode === 'login' && (
              <div className="-mt-2">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900 hover:underline underline-offset-2"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {error && <p className="text-xs text-expenses">{error}</p>}
            {notice && <p className="text-xs font-semibold text-emerald-600">{notice}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[52px] bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg text-white font-bold text-base tracking-wide rounded-xl mt-1 flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(5,150,105,0.3)] transition-all disabled:opacity-60 disabled:hover:bg-emerald-600 disabled:hover:shadow-none"
            >
              {loading
                ? 'Please wait…'
                : recoveryMode
                  ? 'Save new password'
                  : mode === 'login'
                    ? 'Sign in'
                    : 'Create account'}
              {!loading && <ArrowRight size={16} strokeWidth={2.5} />}
            </button>
          </form>

          {recoveryMode && (
            <button
              type="button"
              onClick={() => onRecoveryDone?.()}
              className="w-full min-h-11 mt-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Not now — take me to my shop
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
