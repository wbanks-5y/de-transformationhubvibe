
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TaskFormFieldsProps } from "./types";

const TaskFormFields: React.FC<TaskFormFieldsProps> = ({ 
  formData, 
  onInputChange 
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={onInputChange}
          placeholder="What needs to be done?"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onInputChange}
          placeholder="Add details about this task"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="assignee">Assignee</Label>
          <Input
            id="assignee"
            name="assignee"
            value={formData.assignee}
            onChange={onInputChange}
            placeholder="Who will do this task?"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={onInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskFormFields;
