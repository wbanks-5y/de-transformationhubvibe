
import { useDeleteCockpitType, useToggleCockpitStatus } from "@/hooks/use-cockpit-management";
import { useCreateCockpitKPI, useUpdateCockpitKPI } from "@/hooks/use-cockpit-kpi-management";
import { useAdminCockpitState } from "./useAdminCockpitState";

type AdminCockpitState = ReturnType<typeof useAdminCockpitState>;

export const useAdminCockpitHandlers = (state: AdminCockpitState) => {
  const deleteCockpit = useDeleteCockpitType();
  const toggleStatus = useToggleCockpitStatus();
  const createKPI = useCreateCockpitKPI();
  const updateKPI = useUpdateCockpitKPI();

  const handleDeleteCockpit = async (id: string) => {
    console.log('HandleDeleteCockpit called with ID:', id);
    try {
      await deleteCockpit.mutateAsync(id);
      console.log('Cockpit deletion completed successfully');
    } catch (error) {
      console.error('Error in handleDeleteCockpit:', error);
      throw error;
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    console.log('HandleToggleStatus called:', { id, isActive });
    try {
      await toggleStatus.mutateAsync({ id, isActive });
      console.log('Status toggle completed successfully');
    } catch (error) {
      console.error('Error in handleToggleStatus:', error);
    }
  };

  const handleCreateKPI = async (data: any) => {
    console.log('HandleCreateKPI called with data:', data);
    try {
      await createKPI.mutateAsync(data);
      state.setEditingKPI(null);
      console.log('KPI creation completed successfully');
    } catch (error) {
      console.error('Error in handleCreateKPI:', error);
      throw error;
    }
  };

  const handleUpdateKPI = async (data: any) => {
    console.log('HandleUpdateKPI called with data:', data);
    if (!state.editingKPI) {
      console.error('No editing KPI found');
      return;
    }
    
    try {
      await updateKPI.mutateAsync({
        id: state.editingKPI.id,
        updates: data
      });
      state.setEditingKPI(null);
      console.log('KPI update completed successfully');
    } catch (error) {
      console.error('Error in handleUpdateKPI:', error);
    }
  };

  return {
    handleDeleteCockpit,
    handleToggleStatus,
    handleCreateKPI,
    handleUpdateKPI,
    isDeleting: deleteCockpit.isPending,
    isTogglingStatus: toggleStatus.isPending,
  };
};
