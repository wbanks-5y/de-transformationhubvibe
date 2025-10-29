import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useOrganization } from '@/context/OrganizationContext';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

type UserProfile = {
  full_name: string;
  company: string;
  job_title?: string;
  phone?: string;
};

export default function UserProfile() {
  const { user } = useAuth();
  const { organizationClient } = useOrganization();
  const { preferences, updatePreference, resetPreferences } = useUserPreferences();
  const [profile, setProfile] = useState<UserProfile>({
    full_name: '',
    company: '',
    job_title: '',
    phone: '',
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user || !organizationClient) return;
      
      try {
        const { data, error } = await organizationClient
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setProfile({
            full_name: data.full_name || '',
            company: data.company || '',
            job_title: data.job_title || '',
            phone: data.phone || '',
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadUserProfile();
  }, [user, organizationClient]);

  const handleSaveProfile = async () => {
    if (!user || !organizationClient) return;
    
    setIsSaving(true);
    try {
      const { error } = await organizationClient
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email || '',
          ...profile,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success("Your profile has been updated successfully");
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error("There was a problem updating your profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Home
        </Button>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal information and company details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email || ''} disabled />
                <p className="text-xs text-muted-foreground">Your email address is managed through your account settings</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  placeholder="John Doe" 
                  value={profile.full_name}
                  onChange={(e) => handleProfileChange('full_name', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input 
                  id="company" 
                  placeholder="Acme Inc" 
                  value={profile.company}
                  onChange={(e) => handleProfileChange('company', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input 
                  id="jobTitle" 
                  placeholder="Manager" 
                  value={profile.job_title || ''}
                  onChange={(e) => handleProfileChange('job_title', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  placeholder="+1 (555) 123-4567" 
                  value={profile.phone || ''}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} disabled={isSaving || isLoadingProfile}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>Customize your app experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme Preference</Label>
                <Select 
                  value={preferences.theme} 
                  onValueChange={(value) => updatePreference('theme', value as 'light' | 'dark' | 'system')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="layout">Dashboard Layout</Label>
                <Select 
                  value={preferences.dashboardLayout} 
                  onValueChange={(value) => updatePreference('dashboardLayout', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="expanded">Expanded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div>
                <Button variant="outline" onClick={resetPreferences}>
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
