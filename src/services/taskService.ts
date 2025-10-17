
import { Task } from "@/components/tasks/types";

/**
 * Task Service - Provides functions for task CRUD operations
 * This can be easily replaced with API calls when a backend is implemented
 */
export const taskService = {
  /**
   * Get all tasks, optionally filtered by metricId and moduleId
   */
  getTasks: async (metricId?: string, moduleId?: string): Promise<Task[]> => {
    try {
      // Get tasks from localStorage (simulating database)
      const savedTasks = localStorage.getItem('kpi-tasks');
      let tasks: Task[] = [];
      
      if (savedTasks) {
        tasks = JSON.parse(savedTasks);
      }
      
      // Apply filters if provided
      if (metricId && moduleId) {
        tasks = tasks.filter(
          (task) => task.metricId === metricId && task.moduleId === moduleId
        );
      }
      
      // Simulating API delay
      return new Promise((resolve) => {
        setTimeout(() => resolve(tasks), 200);
      });
    } catch (error) {
      console.error('Error retrieving tasks:', error);
      return [];
    }
  },
  
  /**
   * Create a new task
   */
  createTask: async (task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
    try {
      // Get existing tasks
      const savedTasks = localStorage.getItem('kpi-tasks');
      let tasks: Task[] = [];
      
      if (savedTasks) {
        tasks = JSON.parse(savedTasks);
      }
      
      // Create new task with ID and timestamp
      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      // Save to localStorage (simulating database)
      localStorage.setItem('kpi-tasks', JSON.stringify([...tasks, newTask]));
      
      // Simulating API delay
      return new Promise((resolve) => {
        setTimeout(() => resolve(newTask), 200);
      });
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error('Failed to create task');
    }
  },
  
  /**
   * Update an existing task
   */
  updateTask: async (taskId: string, updates: Partial<Task>): Promise<Task> => {
    try {
      // Get existing tasks
      const savedTasks = localStorage.getItem('kpi-tasks');
      
      if (!savedTasks) {
        throw new Error('No tasks found');
      }
      
      let tasks: Task[] = JSON.parse(savedTasks);
      
      // Find and update the task
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      
      if (taskIndex === -1) {
        throw new Error('Task not found');
      }
      
      // Update the task
      const updatedTask = { ...tasks[taskIndex], ...updates };
      tasks[taskIndex] = updatedTask;
      
      // Save to localStorage (simulating database)
      localStorage.setItem('kpi-tasks', JSON.stringify(tasks));
      
      // Simulating API delay
      return new Promise((resolve) => {
        setTimeout(() => resolve(updatedTask), 200);
      });
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error('Failed to update task');
    }
  },
  
  /**
   * Delete a task
   */
  deleteTask: async (taskId: string): Promise<void> => {
    try {
      // Get existing tasks
      const savedTasks = localStorage.getItem('kpi-tasks');
      
      if (!savedTasks) {
        return;
      }
      
      let tasks: Task[] = JSON.parse(savedTasks);
      
      // Filter out the task to delete
      tasks = tasks.filter(task => task.id !== taskId);
      
      // Save to localStorage (simulating database)
      localStorage.setItem('kpi-tasks', JSON.stringify(tasks));
      
      // Simulating API delay
      return new Promise((resolve) => {
        setTimeout(resolve, 200);
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new Error('Failed to delete task');
    }
  }
};
