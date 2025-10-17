
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import BackButton from "@/components/ui/back-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOrganization } from "@/context/OrganizationContext";
import { toast } from "sonner";
import { Loader2, Save, Building2, Users, Target, Briefcase } from "lucide-react";

interface CompanyProfile {
  id?: string;
  company_name: string;
  description: string;
  industry: string;
  company_size: string;
  headquarters_location: string;
  business_model: string;
  target_market: string;
  key_products_services: string;
  key_markets: string;
  competitive_advantages: string;
  mission_statement: string;
  vision_statement: string;
  core_values: string;
  strategic_priorities: string;
  organizational_structure: string;
  current_challenges: string;
  financial_year_end: string;
}

const CompanyProfile: React.FC = () => {
  const { organizationClient } = useOrganization();
  
  const [profile, setProfile] = useState<CompanyProfile>({
    company_name: '',
    description: '',
    industry: '',
    company_size: '',
    headquarters_location: '',
    business_model: '',
    target_market: '',
    key_products_services: '',
    key_markets: '',
    competitive_advantages: '',
    mission_statement: '',
    vision_statement: '',
    core_values: '',
    strategic_priorities: '',
    organizational_structure: '',
    current_challenges: '',
    financial_year_end: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (organizationClient) {
      fetchCompanyProfile();
    }
  }, [organizationClient]);

  const fetchCompanyProfile = async () => {
    if (!organizationClient) {
      console.log('No organization client available');
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const { data, error } = await organizationClient
        .from('company_profile')
        .select('*')
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        setProfile(data);
      } else {
        // No profile exists, enable editing mode
        setIsEditing(true);
      }
    } catch (error: any) {
      console.error('Error fetching company profile:', error);
      toast.error('Failed to load company profile');
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!organizationClient) {
      toast.error('Organization not available');
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Validate required fields
      if (!profile.company_name.trim()) {
        toast.error('Company name is required');
        return;
      }

      let result;
      if (profile.id) {
        // Update existing profile
        result = await organizationClient
          .from('company_profile')
          .update(profile)
          .eq('id', profile.id)
          .select()
          .single();
      } else {
        // Create new profile
        result = await organizationClient
          .from('company_profile')
          .insert([profile])
          .select()
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      setProfile(result.data);
      setIsEditing(false);
      toast.success(profile.id ? 'Company profile updated successfully' : 'Company profile created successfully');
    } catch (error: any) {
      console.error('Error saving company profile:', error);
      toast.error('Failed to save company profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof CompanyProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const companySizeOptions = [
    { value: 'startup', label: 'Startup (1-10 employees)' },
    { value: 'small', label: 'Small (11-50 employees)' },
    { value: 'medium', label: 'Medium (51-200 employees)' },
    { value: 'large', label: 'Large (201-1000 employees)' },
    { value: 'enterprise', label: 'Enterprise (1000+ employees)' }
  ];

  const industryOptions = [
    'Technology', 'Manufacturing', 'Healthcare', 'Finance', 'Retail', 
    'Education', 'Consulting', 'Real Estate', 'Food & Beverage', 
    'Transportation', 'Energy', 'Media', 'Government', 'Non-profit', 'Other'
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <Helmet>
        <title>Company Profile - Admin Dashboard</title>
      </Helmet>
      
      <div className="flex items-center justify-between">
        <div>
          <BackButton />
          <h1 className="text-2xl font-bold mt-4 mb-2 flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Company Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your organization's profile and information
          </p>
        </div>
        
        <div className="flex gap-2">
          {!isEditing && profile.id && (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              Edit Profile
            </Button>
          )}
          {isEditing && (
            <>
              <Button 
                onClick={() => {
                  setIsEditing(false);
                  fetchCompanyProfile();
                }} 
                variant="outline"
              >
                Cancel
              </Button>
              <Button onClick={saveProfile} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Profile
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Core details about your organization
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  value={profile.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select 
                  value={profile.industry} 
                  onValueChange={(value) => handleInputChange('industry', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions.map(industry => (
                      <SelectItem key={industry} value={industry.toLowerCase()}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company_size">Company Size</Label>
                <Select 
                  value={profile.company_size} 
                  onValueChange={(value) => handleInputChange('company_size', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="headquarters_location">Headquarters Location</Label>
                <Input
                  id="headquarters_location"
                  value={profile.headquarters_location}
                  onChange={(e) => handleInputChange('headquarters_location', e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g., New York, NY, USA"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Company Description</Label>
              <Textarea
                id="description"
                value={profile.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                disabled={!isEditing}
                placeholder="Brief description of your company"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Business Model & Strategy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Business Model & Strategy
            </CardTitle>
            <CardDescription>
              Strategic information about your business
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <Label htmlFor="business_model">Business Model</Label>
              <Textarea
                id="business_model"
                value={profile.business_model}
                onChange={(e) => handleInputChange('business_model', e.target.value)}
                disabled={!isEditing}
                placeholder="Describe your business model"
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor="target_market">Target Market</Label>
              <Textarea
                id="target_market"
                value={profile.target_market}
                onChange={(e) => handleInputChange('target_market', e.target.value)}
                disabled={!isEditing}
                placeholder="Describe your target market"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="key_products_services">Key Products & Services</Label>
              <Textarea
                id="key_products_services"
                value={profile.key_products_services}
                onChange={(e) => handleInputChange('key_products_services', e.target.value)}
                disabled={!isEditing}
                placeholder="List your main products and services"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="key_markets">Key Markets</Label>
              <Input
                id="key_markets"
                value={profile.key_markets}
                onChange={(e) => handleInputChange('key_markets', e.target.value)}
                disabled={!isEditing}
                placeholder="e.g., North America, Europe, Asia-Pacific"
              />
            </div>
          </CardContent>
        </Card>

        {/* Mission & Vision */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Mission, Vision & Values
            </CardTitle>
            <CardDescription>
              Your organization's purpose and guiding principles
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <Label htmlFor="mission_statement">Mission Statement</Label>
              <Textarea
                id="mission_statement"
                value={profile.mission_statement}
                onChange={(e) => handleInputChange('mission_statement', e.target.value)}
                disabled={!isEditing}
                placeholder="Your company's mission statement"
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor="vision_statement">Vision Statement</Label>
              <Textarea
                id="vision_statement"
                value={profile.vision_statement}
                onChange={(e) => handleInputChange('vision_statement', e.target.value)}
                disabled={!isEditing}
                placeholder="Your company's vision statement"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="core_values">Core Values</Label>
              <Textarea
                id="core_values"
                value={profile.core_values}
                onChange={(e) => handleInputChange('core_values', e.target.value)}
                disabled={!isEditing}
                placeholder="Your company's core values"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Organizational Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Organizational Details
            </CardTitle>
            <CardDescription>
              Structure, priorities, and operational information
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <Label htmlFor="organizational_structure">Organizational Structure</Label>
              <Textarea
                id="organizational_structure"
                value={profile.organizational_structure}
                onChange={(e) => handleInputChange('organizational_structure', e.target.value)}
                disabled={!isEditing}
                placeholder="Describe your organizational structure"
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor="strategic_priorities">Strategic Priorities</Label>
              <Textarea
                id="strategic_priorities"
                value={profile.strategic_priorities}
                onChange={(e) => handleInputChange('strategic_priorities', e.target.value)}
                disabled={!isEditing}
                placeholder="List your strategic priorities"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="competitive_advantages">Competitive Advantages</Label>
              <Textarea
                id="competitive_advantages"
                value={profile.competitive_advantages}
                onChange={(e) => handleInputChange('competitive_advantages', e.target.value)}
                disabled={!isEditing}
                placeholder="What gives you a competitive edge?"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="current_challenges">Current Challenges</Label>
              <Textarea
                id="current_challenges"
                value={profile.current_challenges}
                onChange={(e) => handleInputChange('current_challenges', e.target.value)}
                disabled={!isEditing}
                placeholder="Key challenges your organization faces"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="financial_year_end">Financial Year End</Label>
              <Input
                id="financial_year_end"
                value={profile.financial_year_end}
                onChange={(e) => handleInputChange('financial_year_end', e.target.value)}
                disabled={!isEditing}
                placeholder="e.g., December 31"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyProfile;
