
export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  metricId: string; 
  moduleId: string;
}

export interface TaskComponentProps {
  metricId: string;
  moduleId: string;
  metricTitle: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
}

export interface TaskFormProps {
  formData: TaskFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitButtonText?: string;
}

export interface TaskFormFieldsProps {
  formData: TaskFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}
