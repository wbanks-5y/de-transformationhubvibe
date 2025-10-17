
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Trash2, UserCircle, Clock } from "lucide-react";
import { Task } from "./types";
import { getStatusBadgeColor, formatStatusLabel } from "./taskUtils";

interface TaskItemProps {
  task: Task;
  onStatusChange: (taskId: string, status: 'pending' | 'in-progress' | 'completed') => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onStatusChange, onDeleteTask }) => {
  return (
    <div 
      className="flex items-start justify-between p-4 border rounded-md hover:bg-gray-50 transition-colors"
    >
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <h4 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
            {task.title}
          </h4>
          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getStatusBadgeColor(task.status)}`}>
            {formatStatusLabel(task.status)}
          </span>
        </div>
        
        {task.description && (
          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
        )}
        
        <div className="flex items-center text-xs text-gray-500 space-x-4">
          {task.assignee && (
            <div className="flex items-center">
              <UserCircle className="h-3 w-3 mr-1" />
              <span>{task.assignee}</span>
            </div>
          )}
          
          {task.dueDate && (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="ghost"
          size="sm"
          disabled={task.status === 'completed'}
          onClick={() => onStatusChange(task.id, 'completed')}
          title="Mark as completed"
        >
          <CheckCircle2 className={`h-4 w-4 ${task.status === 'completed' ? 'text-green-500' : 'text-gray-400'}`} />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDeleteTask(task.id)}
          title="Delete task"
        >
          <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
        </Button>
      </div>
    </div>
  );
};

export default TaskItem;
