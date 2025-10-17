
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TaskForm from "./TaskForm";
import { TaskFormData } from "./types";

interface CreateTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newTask: TaskFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCreateTask: () => void;
  metricTitle: string;
}

const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({
  isOpen,
  onOpenChange,
  newTask,
  onInputChange,
  onCreateTask,
  metricTitle
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center">
          <Plus className="mr-1 h-4 w-4" /> New Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Create a new task related to {metricTitle}
          </DialogDescription>
        </DialogHeader>
        
        <TaskForm
          formData={newTask}
          onInputChange={onInputChange}
          onSubmit={onCreateTask}
          onCancel={() => onOpenChange(false)}
          submitButtonText="Create Task"
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
