import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import { Route, Routes } from 'react-router'
import { useUser } from '@clerk/clerk-react'
import { Navigate } from 'react-router'
import ProblemsPage from './pages/ProblemsPage'
import ProblemPage from './pages/ProblemPage'
import { useCreateSession } from './hooks/useSessions'
import DashboardPage from './pages/DashboardPage'
import AxiosAuthSync from './components/AxiosAuthSync'   // 👈 add this import
import SessionPage from './pages/SessionPage'
function App() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <AxiosAuthSync />   {/* 👈 add this, runs once, renders nothing */}

     <Routes>
  <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
  <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />
  <Route path="/problem/:id" element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to="/" />} />
  <Route path="/session/:id" element={isSignedIn ? <SessionPage /> : <Navigate to="/" />} />
</Routes>
    </>
  );
}

export default App