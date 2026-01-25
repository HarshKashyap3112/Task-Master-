import { supabase } from '../supabaseClient'
import { ModeToggle } from "@/components/mode-toggle"

export function Navbar({ session }) {
  return (
    <nav className="bg-white dark:bg-slate-950 shadow-sm border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-xl font-bold  text-indigo-600 dark:text-orange-400">Task Master</span>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              {session?.user.email}
            </span>
            
            <ModeToggle />
            
            <button 
              className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              onClick={() => supabase.auth.signOut()}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}