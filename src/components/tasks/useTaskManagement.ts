
import { useState, useEffect } from "react";
import { Task } from "./types";
import { toast } from "@/hooks/use-toast";
import { taskService } from "@/services/taskService";

export function useTaskManagement(metricId: string, moduleId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
    dueDate: new Date().toISOString().split('T')[0],
    status: 'pending' as const
  });

  // Load tasks from service on component mount
  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      try {
        const loadedTasks = await taskService.getTasks(metricId, moduleId);
        setTasks(loadedTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
        toast.error("Error loading tasks");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTasks();
  }, [metricId, moduleId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    setIsLoading(true);
    try {
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        assignee: newTask.assignee,
        dueDate: newTask.dueDate,
        status: newTask.status,
        metricId,
        moduleId
      };
      
      const createdTask = await taskService.createTask(taskData);
      setTasks([...tasks, createdTask]);
      setNewTask({
        title: '',
        description: '',
        assignee: '',
        dueDate: new Date().toISOString().split('T')[0],
        status: 'pending'
      });
      
      setIsDialogOpen(false);
      
      toast.success(`"${createdTask.title}" has been added to your tasks.`);
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error("Error creating task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (taskId: string, status: 'pending' | 'in-progress' | 'completed') => {
    setIsLoading(true);
    try {
      await taskService.updateTask(taskId, { status });
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, status } : task
      );
      setTasks(updatedTasks);
      
      toast.success(`Task status changed to ${status}`);
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error("Error updating task status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      setIsLoading(true);
      try {
        await taskService.deleteTask(taskToDelete);
        const updatedTasks = tasks.filter((task) => task.id !== taskToDelete);
        setTasks(updatedTasks);
        setIsDeleteAlertOpen(false);
        setTaskToDelete(null);
        
        toast.success("The task has been removed");
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error("Error deleting task");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    tasks,
    newTask,
    isDialogOpen,
    isDeleteAlertOpen,
    taskToDelete,
    isLoading,
    setIsDialogOpen,
    setIsDeleteAlertOpen,
    handleInputChange,
    handleCreateTask,
    handleStatusChange,
    handleDeleteTask,
    confirmDelete
  };
}
