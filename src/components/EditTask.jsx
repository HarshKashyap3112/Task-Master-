import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react"; // Import Pencil Icon

export function EditTask({ task, onTaskUpdated }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Send Update to Supabase
    const { error } = await supabase
      .from("tasks")
      .update({ title, description }) // We only update these fields
      .eq("id", task.id); // Find the task by ID

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Error updating task");
    } else {
      setOpen(false); // Close dialog
      onTaskUpdated(); // Tell Dashboard to refresh
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} className="">
      <DialogTrigger asChild>
        {/* The Edit Button (Pencil) */}
        <Button
          variant="ghost"
          size="icon"
          className=" text-blue-500 hover:text-blue-700 hover:bg-blue-50  opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <Input
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Textarea
              placeholder="Description (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}