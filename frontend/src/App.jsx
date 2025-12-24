import { RouterProvider, createBrowserRouter } from 'react-router-dom';
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
import './index.css';

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
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <InputForm />
          </main>
          <Footer />
        </div>
      ),
    },
    {
      path: '/dashboard',
      element: (
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Dashboard />
          </main>
          <Footer />
        </div>
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
  return <RouterProvider router={router} />;
}

export default App;
