
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface ProjectItem {
  name: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'behind';
  daysInfo?: string;
}

interface ProjectStatusCardProps {
  title: string;
  subtitle: string;
  alertMessage?: string;
  alertCount?: number;
  projects: ProjectItem[];
  className?: string;
}

const ProjectStatusCard: React.FC<ProjectStatusCardProps> = ({
  title,
  subtitle,
  alertMessage,
  alertCount,
  projects,
  className = ""
}) => {
  const getStatusColor = (status: ProjectItem['status']) => {
    switch (status) {
      case 'behind':
        return 'text-red-600';
      case 'at-risk':
        return 'text-orange-500';
      case 'on-track':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getProgressBarColor = (status: ProjectItem['status']) => {
    switch (status) {
      case 'behind':
        return 'bg-red-500';
      case 'at-risk':
        return 'bg-orange-500';
      case 'on-track':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {alertMessage && alertCount && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">Immediate Attention Required</p>
                <p className="text-sm text-red-700 mt-1">
                  {alertCount} projects have critical issues that may impact delivery dates
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {projects.map((project, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{project.name}</span>
                {project.daysInfo && (
                  <span className={`text-sm font-medium ${getStatusColor(project.status)}`}>
                    {project.daysInfo}
                  </span>
                )}
              </div>
              
              <div className="space-y-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(project.status)}`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600">{project.progress}% complete</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectStatusCard;
