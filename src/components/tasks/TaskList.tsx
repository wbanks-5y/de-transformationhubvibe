
import React from "react";
import { Task } from "./types";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (taskId: string, status: 'pending' | 'in-progress' | 'completed') => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onStatusChange, onDeleteTask }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed rounded-lg">
        <p className="text-gray-500">No tasks yet. Create your first task!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  );
};

export default TaskList;
