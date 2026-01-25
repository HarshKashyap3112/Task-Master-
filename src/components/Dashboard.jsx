import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { CreateTask } from './CreateTask'
import  { ToastAction } from './ui/toast'
import { TaskCard } from './TaskCard'

// Shadcn UI
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

export function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all"); // Options: "all", "active", "completed"
  const { toast } = useToast()
  // 1. Fetch Tasks
  const fetchTasks = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('id', { ascending: false })

    if (error) console.error(error)
    else setTasks(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  // 2. Calculate Progress
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.is_complete).length
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

  // 3. Toggle Complete
  const toggleTask = async (taskId, currentStatus) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, is_complete: !currentStatus } : t
    ))

    const { error } = await supabase
      .from('tasks')
      .update({ is_complete: !currentStatus })
      .eq('id', taskId)

    if (error) fetchTasks()
  }

  // Derived State: Calculate which tasks to show based on the filter
    const filteredTasks = tasks.filter((task) => {
      if (filter === "active") return !task.is_complete;    // Show only incomplete
      if (filter === "completed") return task.is_complete;  // Show only complete
      return true; // "all" -> Show everything
    });

  // 4. DELETE FUNCTION (New)
  const deleteTask = async (taskId) => {
    const taskToRestore = tasks.find(t => t.id === taskId);

    // Optimistic Update: Remove from screen immediately
    setTasks(tasks.filter(t => t.id !== taskId))

    // Remove from Database
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) {
    toast({
      variant: "destructive", // Red color
      title: "Uh oh! Something went wrong.",
      description: "There was a problem deleting your task.",
    })
    fetchTasks() // Revert changes
    }else {
    // ✅ NEW: Success Toast
   toast({
    title: "Task deleted",
    description: "The task has been removed.",
    action: (
      <ToastAction 
        altText="Undo" 
        onClick={async () => {
          // 5. ↩️ RESTORE: Insert the backup copy back into DB
          // We remove the 'id' so Supabase creates a new one (avoids conflict), 
          // or we can keep it if we want the exact same ID.
          // Let's strip the ID to be safe and treat it as a "new" copy.
          const { id, ...restOfTask } = taskToRestore; 
          
          const { error: restoreError } = await supabase
            .from('tasks')
            .insert([restOfTask]) // Insert the data back

          if (restoreError) {
             toast({ variant: "destructive", title: "Failed to undo" })
          } else {
             fetchTasks() // Refresh list to show the restored task
          }
        }}
      >
        Undo
      </ToastAction>
    ),
  })
    
    }

  }
  

 return (
  // 1. MAIN CONTAINER: Full Screen Height, Flex Column, No Window Scroll
  <main className="max-w-4xl mx-auto h-screen flex flex-col overflow-hidden px-4">
    
    {/* 2. HEADER: Fixed (Stays at top) */}
    {/* flex-shrink-0 ensures it never collapses */}
    {/* Added pt-10 to keep your top spacing */}
    <div className="flex-shrink-0 pt-10 pb-6 space-y-4">
       <div className="flex justify-between items-end">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">My Tasks</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              You have completed {completedTasks} out of {totalTasks} tasks.
            </p>
          </div>
          <CreateTask onTaskCreated={fetchTasks} />
       </div>

       <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
             <span>Progress</span>
             <span>{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
       </div>
    </div>
    {/* FILTER TABS */}
    <div className="flex gap-2 mb-4">
      <Button 
        variant={filter === "all" ? "default" : "outline"} 
        onClick={() => setFilter("all")}
        className="h-8"
      >
        All
      </Button>
      <Button 
        variant={filter === "active" ? "default" : "outline"} 
        onClick={() => setFilter("active")}
        className="h-8"
      >
        Active
      </Button>
      <Button 
        variant={filter === "completed" ? "default" : "outline"} 
        onClick={() => setFilter("completed")}
        className="h-8"
      >
        Completed
      </Button>
    </div>
    <div className="flex-1 overflow-y-auto pb-10 pr-2">
      {loading ? (
        <p>Loading tasks...</p>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-slate-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
           <p className="text-gray-500">No tasks found. Create one above!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <TaskCard 
      key={task.id} 
      task={task} 
      toggleTask={toggleTask} 
      deleteTask={deleteTask}
      fetchTasks={fetchTasks}
    />
          ))}
        </div>
      )}
    </div>
  </main>
)
}
