
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";

import { TaskComponentProps } from "./types";
import { useTaskManagement } from "./useTaskManagement";
import TaskList from "./TaskList";
import CreateTaskDialog from "./CreateTaskDialog";
import DeleteTaskAlert from "./DeleteTaskAlert";

const TaskManagement: React.FC<TaskComponentProps> = ({ 
  metricId, 
  moduleId,
  metricTitle 
}) => {
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(true);
  
  const {
    tasks,
    newTask,
    isDialogOpen,
    isDeleteAlertOpen,
    setIsDialogOpen,
    setIsDeleteAlertOpen,
    handleInputChange,
    handleCreateTask,
    handleStatusChange,
    handleDeleteTask,
    confirmDelete
  } = useTaskManagement(metricId, moduleId);

  return (
    <Collapsible
      open={isCollapsibleOpen}
      onOpenChange={setIsCollapsibleOpen}
      className="w-full"
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Task Management</CardTitle>
              <CardDescription>Tasks related to {metricTitle}</CardDescription>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 w-9 h-9">
                {isCollapsibleOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent>
            <div className="flex justify-between mb-4">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
                </span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="text-sm text-gray-500">
                  {tasks.filter(t => t.status === 'completed').length} Completed
                </span>
              </div>
              
              <CreateTaskDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                newTask={newTask}
                onInputChange={handleInputChange}
                onCreateTask={handleCreateTask}
                metricTitle={metricTitle}
              />
            </div>
            
            <TaskList
              tasks={tasks}
              onStatusChange={handleStatusChange}
              onDeleteTask={handleDeleteTask}
            />
          </CardContent>
        </CollapsibleContent>
      </Card>
      
      <DeleteTaskAlert 
        isOpen={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
        onConfirmDelete={confirmDelete}
      />
    </Collapsible>
  );
};

export default TaskManagement;
