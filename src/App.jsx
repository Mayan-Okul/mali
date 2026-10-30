import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';

function App() {
  const { session, loading, recovery, endRecovery } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center text-muted text-sm">
        Loading…
      </div>
    );
  }

  if (recovery) {
    return <AuthPage recoveryMode onRecoveryDone={endRecovery} />;
  }

  return session ? <Dashboard /> : <AuthPage />;
}

export default App;
