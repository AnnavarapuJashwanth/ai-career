import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Landing from './pages/Landing';
import InputForm from './pages/InputForm';
import Dashboard from './pages/Dashboard';
import DemoDashboard from './pages/DemoDashboard';
import { LoginPage, SignupPage } from './pages/AuthPages';
import About from './pages/About';
import Features from './pages/Features';
import SkillGapPage from './pages/SkillGapPage';
import MarketTrendsPage from './pages/MarketTrendsPage';
import CoursesPage from './pages/CoursesPage';
import ProfilePage from './pages/ProfilePage';
import RoleDiscoveryQuiz from './pages/RoleDiscoveryQuiz';
import ProtectedRoute from './components/common/ProtectedRoute';
import './index.css';

// Token validation and cleanup on app load
const validateAndCleanupAuth = () => {
  try {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Decode JWT to check expiration
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        
        // If token expired, clear everything
        if (currentTime >= expirationTime) {
          console.log('Token expired, clearing auth...');
          localStorage.removeItem('authToken');
          localStorage.removeItem('careerai_user');
        }
      }
    }
  } catch (error) {
    // If token is invalid or corrupted, clear it
    console.log('Invalid token, clearing auth...');
    localStorage.removeItem('authToken');
    localStorage.removeItem('careerai_user');
  }
};

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Landing />
          </main>
          <Footer />
        </div>
      ),
    },
    {
      path: '/generate',
      element: (
        <ProtectedRoute>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <InputForm />
            </main>
            <Footer />
          </div>
        </ProtectedRoute>
      ),
    },
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute>
          <Header />
          <Dashboard />
          <Footer />
        </ProtectedRoute>
      ),
    },
    {
      path: '/dashboard-old',
      element: (
        <ProtectedRoute>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Dashboard />
            </main>
            <Footer />
          </div>
        </ProtectedRoute>
      ),
    },
    {
      path: '/profile',
      element: (
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/demo',
      element: (
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <DemoDashboard />
          </main>
          <Footer />
        </div>
      ),
    },
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/signup',
      element: <SignupPage />,
    },
    {
      path: '/about',
      element: (
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <About />
          </main>
          <Footer />
        </div>
      ),
    },
    {
      path: '/features',
      element: (
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Features />
          </main>
          <Footer />
        </div>
      ),
    },
    {
      path: '/skill-gap',
      element: <SkillGapPage />,
    },
    {
      path: '/market-trends',
      element: <MarketTrendsPage />,
    },
    {
      path: '/courses',
      element: <CoursesPage />,
    },
    {
      path: '/role-discovery',
      element: (
        <ProtectedRoute>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <RoleDiscoveryQuiz />
            </main>
            <Footer />
          </div>
        </ProtectedRoute>
      ),
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_skipActionErrorRevalidation: true,
      v7_partialHydration: true,
      v7_startTransition: true,
    },
  }
);

function App() {
  useEffect(() => {
    // Validate and cleanup auth on initial mount
    validateAndCleanupAuth();
    
    // Set up periodic check every 5 minutes
    const interval = setInterval(validateAndCleanupAuth, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
