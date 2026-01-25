import { format } from "date-fns"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { EditTask } from './EditTask' // Don't forget this!

export function TaskCard({ task, toggleTask, deleteTask, fetchTasks }) {
  return (
    <Card className={`transition-all group ${task.is_complete ? 'opacity-60 bg-gray-50 dark:bg-slate-900' : ''}`}>
      <CardContent className="p-4 flex items-start gap-4">
        
        {/* CHECKBOX */}
        <Checkbox 
          checked={task.is_complete}
          onCheckedChange={() => toggleTask(task.id, task.is_complete)}
          className="mt-1"
        />
        
        <div className="flex-1 space-y-1">
          <div className="flex justify-between items-start">
            
            {/* TITLE */}
            <h3 className={`font-semibold text-lg leading-none ${task.is_complete ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </h3>

            {/* ACTION BUTTONS (Edit & Delete) */}
            <div className="flex items-center gap-1 -mt-2 -mr-2">
              <EditTask task={task} onTaskUpdated={fetchTasks} />

              <Button 
                variant="ghost" 
                size="icon" 
                className="text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => deleteTask(task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* DESCRIPTION */}
          {task.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* DATES */}
          <div className="flex gap-4 pt-2 text-xs text-gray-400">
            {task.start_date && (
                <span>Start: {format(new Date(task.start_date), "MMM d")}</span>
            )}
            {task.due_date && (
                <span className={new Date(task.due_date) < new Date() && !task.is_complete ? "text-red-400 font-bold" : ""}>
                  Due: {format(new Date(task.due_date), "MMM d")}
                </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}