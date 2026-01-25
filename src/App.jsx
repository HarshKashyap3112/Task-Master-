import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom' // 👈 Import Routes
import { supabase } from './supabaseClient'
import Auth from './components/Auth'
import { Navbar } from './components/Navbar.jsx'
import { Dashboard } from './components/Dashboard.jsx'
import { ProtectedRoute } from './components/ProtectedRoute' // 👈 Import the guard
import { Toaster } from "@/components/ui/toaster"
function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  // 1. Keep Session Logic Here (So Navbar can use it!)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  // 2. Loading Spinner (Prevent flicker)
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors hide-scrollbar" style={{ overflowY: 'scroll', height: '300px' }}>
      
      {/* 3. Navbar is ALWAYS here, but only shows if logged in */}
      {session && <Navbar session={session} />}

      <Routes>
        {/* 🟢 PUBLIC ROUTE (Login) */}
        {/* If user is already logged in, redirect them to Dashboard */}
        <Route 
          path="/" 
          element={!session ? <Auth /> : <Navigate to="/dashboard" />} 
        />

        {/* 🔒 PROTECTED ROUTE (Dashboard) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute session={session}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch-all: Redirect random URLs to Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App