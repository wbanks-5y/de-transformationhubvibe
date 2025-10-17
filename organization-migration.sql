-- Phase 1: Multi-Customer Organization Structure Migration
-- Creates organizations table and adds organization_id to profiles table

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    website TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    address JSONB,
    
    -- Subscription & Access Control
    tier VARCHAR(50) DEFAULT 'essential' CHECK (tier IN ('essential', 'professional', 'enterprise')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending', 'cancelled')),
    max_users INTEGER DEFAULT 10,
    
    -- Configuration
    settings JSONB DEFAULT '{}',
    features JSONB DEFAULT '[]',
    
    -- Branding & Customization  
    brand_colors JSONB DEFAULT '{}',
    custom_domain VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Subscription dates
    subscription_starts_at TIMESTAMP WITH TIME ZONE,
    subscription_ends_at TIMESTAMP WITH TIME ZONE
);

-- Add organization_id to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_status ON organizations(status);
CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON profiles(organization_id);

-- Create organization_roles table for organization-specific roles
CREATE TABLE IF NOT EXISTS organization_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permissions JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(organization_id, role_id)
);

-- Create organization_user_roles table for user roles within organizations
CREATE TABLE IF NOT EXISTS organization_user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES profiles(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    
    UNIQUE(organization_id, user_id, role_id)
);

-- Enable Row Level Security on all new tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations table
DROP POLICY IF EXISTS "Organizations are viewable by members" ON organizations;
CREATE POLICY "Organizations are viewable by members" ON organizations
    FOR SELECT USING (
        id IN (
            SELECT p.organization_id 
            FROM profiles p 
            WHERE p.id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Organization admins can update their organization" ON organizations;
CREATE POLICY "Organization admins can update their organization" ON organizations
    FOR UPDATE USING (
        id IN (
            SELECT our.organization_id 
            FROM organization_user_roles our
            JOIN roles r ON our.role_id = r.id
            WHERE our.user_id = auth.uid() 
            AND r.name IN ('admin', 'owner')
            AND our.is_active = true
        )
    );

-- RLS Policies for organization_roles table
DROP POLICY IF EXISTS "Organization roles viewable by org members" ON organization_roles;
CREATE POLICY "Organization roles viewable by org members" ON organization_roles
    FOR SELECT USING (
        organization_id IN (
            SELECT p.organization_id 
            FROM profiles p 
            WHERE p.id = auth.uid()
        )
    );

-- RLS Policies for organization_user_roles table  
DROP POLICY IF EXISTS "Organization user roles viewable by org members" ON organization_user_roles;
CREATE POLICY "Organization user roles viewable by org members" ON organization_user_roles
    FOR SELECT USING (
        organization_id IN (
            SELECT p.organization_id 
            FROM profiles p 
            WHERE p.id = auth.uid()
        )
    );

-- Function to get user's organization
CREATE OR REPLACE FUNCTION get_user_organization()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT organization_id 
        FROM profiles 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is organization admin
CREATE OR REPLACE FUNCTION is_organization_admin(org_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM organization_user_roles our
        JOIN roles r ON our.role_id = r.id
        WHERE our.user_id = auth.uid()
        AND our.organization_id = COALESCE(org_id, get_user_organization())
        AND r.name IN ('admin', 'owner')
        AND our.is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_updated_at 
    BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_roles_updated_at 
    BEFORE UPDATE ON organization_roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default organization for existing users (migration safety)
DO $$
BEGIN
    -- Create a default organization if none exists
    IF NOT EXISTS (SELECT 1 FROM organizations LIMIT 1) THEN
        INSERT INTO organizations (
            name, 
            slug, 
            description, 
            tier,
            status
        ) VALUES (
            '5Y Technology', 
            '5y-technology', 
            'Default organization for existing users',
            'enterprise',
            'active'
        );
        
        -- Assign all existing users to the default organization
        UPDATE profiles 
        SET organization_id = (SELECT id FROM organizations WHERE slug = '5y-technology')
        WHERE organization_id IS NULL;
    END IF;
END $$;

-- Verify the migration
SELECT 'Organizations table created' as status;
SELECT COUNT(*) as organization_count FROM organizations;
SELECT COUNT(*) as profiles_with_org FROM profiles WHERE organization_id IS NOT NULL;