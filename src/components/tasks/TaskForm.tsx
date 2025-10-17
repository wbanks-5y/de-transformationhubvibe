
import React from "react";
import { Button } from "@/components/ui/button";
import TaskFormFields from "./TaskFormFields";
import { TaskFormProps } from "./types";

const TaskForm: React.FC<TaskFormProps> = ({
  formData,
  onInputChange,
  onSubmit,
  onCancel,
  submitButtonText = "Submit"
}) => {
  return (
    <>
      <TaskFormFields 
        formData={formData}
        onInputChange={onInputChange}
      />
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          {submitButtonText}
        </Button>
      </div>
    </>
  );
};

export default TaskForm;
