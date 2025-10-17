
interface User {
  id: string;
  email?: string;
  created_at: string;
  last_sign_in_at?: string | null;
  full_name?: string;
  company?: string;
  job_title?: string;
  phone?: string;
  status?: string;
}

interface PendingInvitation {
  id: string;
  email: string;
  invited_at: string;
  status: string;
}

export const filteredUsers = (
  users: User[], 
  pendingInvitations: PendingInvitation[], 
  activeTab: string, 
  searchTerm: string
): User[] => {
  let filtered = users;
  
  // Filter by tab first
  if (activeTab === "active") {
    // Active users are those who have actually logged in (have last_sign_in_at)
    filtered = filtered.filter(user => user.last_sign_in_at !== null && user.last_sign_in_at !== undefined);
  } else if (activeTab === "pending") {
    // For pending tab, show both pending user profiles and pending invitations
    const pendingUsers = filtered.filter(user => user.status === 'pending');
    const invitationUsers: User[] = pendingInvitations.map(invitation => ({
      id: invitation.id,
      email: invitation.email,
      created_at: invitation.invited_at,
      last_sign_in_at: null,
      full_name: 'Pending Invitation',
      company: '',
      job_title: '',
      phone: '',
      status: 'pending'
    }));
    
    // Combine and deduplicate by email
    const combined = [...pendingUsers, ...invitationUsers];
    filtered = combined.filter((user, index, self) => 
      index === self.findIndex((u) => u.email === user.email)
    );
  } else if (activeTab === "approved") {
    filtered = filtered.filter(user => user.status === 'approved');
  } else if (activeTab === "rejected") {
    filtered = filtered.filter(user => user.status === 'rejected');
  }
  
  // Apply search filter
  if (searchTerm) {
    filtered = filtered.filter(
      user => 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  return filtered;
};
