import { useState } from 'react'
import { supabase } from '../supabaseClient'

// Shadcn Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function CreateTask({ onTaskCreated }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [dueDate, setDueDate] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)

    const { error } = await supabase
      .from('tasks')
      .insert([
        { 
          title, 
          description,
          start_date: startDate ? new Date(startDate) : null,
          due_date: dueDate ? new Date(dueDate) : null,
          is_complete: false
        }
      ])

    setLoading(false)

    if (error) {
      alert(error.message)
    } else {
      setOpen(false)
      // Reset form
      setTitle('')
      setDescription('')
      setStartDate('')
      setDueDate('')
      
      if (onTaskCreated) onTaskCreated()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-orange-400 dark:hover:bg-orange-600 ] text-white">
          Create New Task
        </Button>
      </DialogTrigger>
      
      {/* sm:max-w-[425px] controls the width. You can change to [600px] if you want it wider */}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          
          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              placeholder="e.g. Finish the report"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />
          </div>

          {/* Dates Row - Using Shadcn Inputs with type="date" */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start">Start Date</Label>
              {/* This is the shadcn Input, but acting as a native date picker */}
              <Input 
                id="start"
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block" 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="due">Due Date</Label>
              <Input 
                id="due"
                type="date" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="block"
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea 
              id="desc" 
              placeholder="Add extra details..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            {/* type="button" on Cancel prevents it from submitting the form */}
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Task'}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  )
}