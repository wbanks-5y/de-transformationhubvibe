
import { CockpitMetric } from '@/types/cockpit';
import { MetricDisplay } from '@/types/metrics';
import { 
  convertMetricDisplayToCockpitMetric, 
  convertCockpitMetricUpdatesToMetricDisplay,
  CockpitManagementState 
} from '../types/adminTypes';
import { useCockpitData, useCockpitTypes } from '@/hooks/use-cockpit-data';
import { useCockpitKPIs } from '@/hooks/use-cockpit-kpis';
import { useCreateCockpitType, useUpdateCockpitType, useDeleteCockpitType, useToggleCockpitStatus } from '@/hooks/use-cockpit-management';
import { useCreateCockpitKPI, useUpdateCockpitKPI, useDeleteCockpitKPI } from '@/hooks/use-cockpit-kpi-management';
import { useCreateCockpitMetric } from '@/hooks/use-cockpit-metric-management';
import { useCreateCockpitSection } from '@/hooks/use-cockpit-sections';
import { toast } from 'sonner';

export const useCockpitManagementHandlers = (state: CockpitManagementState) => {
  // Data hooks
  const { data: cockpitTypes } = useCockpitTypes();
  const { data: cockpitData } = useCockpitData(state.selectedCockpit);
  const selectedCockpitType = cockpitTypes?.find(c => c.id === state.selectedCockpit);
  const { data: cockpitKPIs } = useCockpitKPIs(selectedCockpitType?.id);

  // Mutation hooks
  const createCockpitType = useCreateCockpitType();
  const updateCockpitType = useUpdateCockpitType();
  const deleteCockpitType = useDeleteCockpitType();
  const toggleCockpitStatus = useToggleCockpitStatus();
  
  const createSection = useCreateCockpitSection();
  const createKPI = useCreateCockpitKPI();
  const updateKPI = useUpdateCockpitKPI();
  const deleteKPI = useDeleteCockpitKPI();
  
  const createMetric = useCreateCockpitMetric();

  // Cockpit handlers
  const handleCreateCockpit = async (data: any) => {
    try {
      await createCockpitType.mutateAsync(data);
      state.setShowCockpitForm(false);
      toast.success("Cockpit created successfully");
    } catch (error) {
      console.error('Error creating cockpit:', error);
      toast.error("Failed to create cockpit");
    }
  };

  const handleDeleteCockpit = async (id: string) => {
    if (confirm('Are you sure you want to delete this cockpit? This will also delete all related sections, KPIs, and metrics.')) {
      try {
        await deleteCockpitType.mutateAsync(id);
        if (state.selectedCockpit === id) {
          state.setSelectedCockpit('');
          state.setSelectedSection('');
          state.setActiveTab('cockpits');
        }
      } catch (error) {
        console.error('Error deleting cockpit:', error);
      }
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      await toggleCockpitStatus.mutateAsync({ id, isActive });
    } catch (error) {
      console.error('Error toggling cockpit status:', error);
    }
  };

  // Section handlers
  const handleCreateSection = async (data: any) => {
    try {
      await createSection.mutateAsync(data);
      state.setShowSectionForm(false);
      toast.success("Section created successfully");
    } catch (error) {
      console.error('Error creating section:', error);
      toast.error("Failed to create section");
    }
  };

  // KPI handlers
  const handleCreateKPI = async (data: any) => {
    try {
      const kpiData = {
        ...data,
        cockpit_type_id: data.cockpit_type_id || selectedCockpitType?.id
      };
      await createKPI.mutateAsync(kpiData);
      state.setShowKPIForm(false);
      toast.success("KPI created successfully");
    } catch (error) {
      console.error('Error creating KPI:', error);
      toast.error("Failed to create KPI");
    }
  };

  const handleDeleteKPI = async (id: string) => {
    if (confirm('Are you sure you want to delete this KPI?')) {
      try {
        await deleteKPI.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting KPI:', error);
      }
    }
  };

  // Metric handlers
  const handleCreateMetric = async (data: any) => {
    try {
      await createMetric.mutateAsync(data);
      state.setShowMetricForm(false);
      toast.success("Metric created successfully");
    } catch (error) {
      console.error('Error creating metric:', error);
      toast.error("Failed to create metric");
    }
  };

  return {
    // Data
    cockpitData,
    cockpitKPIs,
    
    // Cockpit handlers
    handleCreateCockpit,
    handleDeleteCockpit,
    handleToggleStatus,
    
    // Section handlers
    handleCreateSection,
    
    // KPI handlers
    handleCreateKPI,
    handleDeleteKPI,
    
    // Metric handlers
    handleCreateMetric,
  };
};
