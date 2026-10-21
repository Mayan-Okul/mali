import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';

function App() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center text-muted text-sm">
        Loading…
      </div>
    );
  }

  return session ? <Dashboard /> : <AuthPage />;
}

export default App;
