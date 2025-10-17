-- Phase 1: Database Schema Enhancement for Multi-Provider Authentication
-- This migration adds support for tracking authentication providers and enhanced user management

-- Create auth_providers table to track which authentication methods each user has used
CREATE TABLE IF NOT EXISTS public.auth_providers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider_type VARCHAR(50) NOT NULL CHECK (provider_type IN ('email', 'google', 'apple', 'microsoft', 'entra')),
    provider_id VARCHAR(255), -- External provider user ID
    provider_email VARCHAR(255), -- Email from the provider
    linked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_primary BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}', -- Store additional provider-specific data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique provider per user
    UNIQUE(user_id, provider_type),
    -- Ensure only one primary provider per user
    EXCLUDE (user_id WITH =) WHERE (is_primary = true)
);

-- Add indexes for performance
CREATE INDEX idx_auth_providers_user_id ON public.auth_providers(user_id);
CREATE INDEX idx_auth_providers_provider_type ON public.auth_providers(provider_type);
CREATE INDEX idx_auth_providers_last_used ON public.auth_providers(last_used_at DESC);

-- Add columns to profiles table for enhanced user management
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_auth_provider VARCHAR(50);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sync_status VARCHAR(20) DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending', 'error'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verification_date TIMESTAMP WITH TIME ZONE;

-- Create user_activity table for tracking user actions and analytics
CREATE TABLE IF NOT EXISTS public.user_activity (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- 'login', 'logout', 'profile_update', etc.
    provider_type VARCHAR(50), -- Which provider was used for login
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for user_activity
CREATE INDEX idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX idx_user_activity_type ON public.user_activity(activity_type);
CREATE INDEX idx_user_activity_created_at ON public.user_activity(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_auth_providers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auth_providers updated_at
CREATE TRIGGER trigger_auth_providers_updated_at
    BEFORE UPDATE ON public.auth_providers
    FOR EACH ROW
    EXECUTE FUNCTION update_auth_providers_updated_at();

-- Enable RLS on new tables
ALTER TABLE public.auth_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies for auth_providers
CREATE POLICY "Users can view their own auth providers" ON public.auth_providers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own auth providers" ON public.auth_providers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own auth providers" ON public.auth_providers
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own auth providers" ON public.auth_providers
    FOR DELETE USING (auth.uid() = user_id);

-- Admin policy for auth_providers (assuming admin role exists)
CREATE POLICY "Admins can manage all auth providers" ON public.auth_providers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- RLS Policies for user_activity
CREATE POLICY "Users can view their own activity" ON public.user_activity
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert user activity" ON public.user_activity
    FOR INSERT WITH CHECK (true); -- Allow system to log activities

-- Admin policy for user_activity
CREATE POLICY "Admins can view all user activity" ON public.user_activity
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Create function to log user activity
CREATE OR REPLACE FUNCTION log_user_activity(
    p_user_id UUID,
    p_activity_type VARCHAR(50),
    p_provider_type VARCHAR(50) DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    activity_id UUID;
BEGIN
    INSERT INTO public.user_activity (
        user_id,
        activity_type,
        provider_type,
        ip_address,
        user_agent,
        metadata
    ) VALUES (
        p_user_id,
        p_activity_type,
        p_provider_type,
        p_ip_address,
        p_user_agent,
        p_metadata
    ) RETURNING id INTO activity_id;
    
    RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update login stats
CREATE OR REPLACE FUNCTION update_login_stats(
    p_user_id UUID,
    p_provider_type VARCHAR(50)
)
RETURNS void AS $$
BEGIN
    UPDATE public.profiles 
    SET 
        login_count = COALESCE(login_count, 0) + 1,
        last_login_at = NOW(),
        last_auth_provider = p_provider_type,
        updated_at = NOW()
    WHERE id = p_user_id;
    
    -- Update or insert auth_provider record
    INSERT INTO public.auth_providers (user_id, provider_type, last_used_at)
    VALUES (p_user_id, p_provider_type, NOW())
    ON CONFLICT (user_id, provider_type) 
    DO UPDATE SET 
        last_used_at = NOW(),
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.auth_providers TO authenticated;
GRANT SELECT, INSERT ON public.user_activity TO authenticated;
GRANT EXECUTE ON FUNCTION log_user_activity TO authenticated;
GRANT EXECUTE ON FUNCTION update_login_stats TO authenticated;

-- Create view for user management dashboard
CREATE OR REPLACE VIEW public.user_management_summary AS
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.role,
    p.status,
    p.organization_id,
    p.login_count,
    p.last_login_at,
    p.last_auth_provider,
    p.is_verified,
    p.created_at,
    p.updated_at,
    -- Count of auth providers per user
    COALESCE(ap_count.provider_count, 0) as auth_provider_count,
    -- Array of auth provider types
    COALESCE(ap_types.provider_types, ARRAY[]::text[]) as auth_provider_types,
    -- Recent activity count (last 30 days)
    COALESCE(ua_count.recent_activity_count, 0) as recent_activity_count
FROM public.profiles p
LEFT JOIN (
    SELECT 
        user_id, 
        COUNT(*) as provider_count
    FROM public.auth_providers 
    GROUP BY user_id
) ap_count ON p.id = ap_count.user_id
LEFT JOIN (
    SELECT 
        user_id,
        array_agg(provider_type ORDER BY last_used_at DESC) as provider_types
    FROM public.auth_providers
    GROUP BY user_id
) ap_types ON p.id = ap_types.user_id
LEFT JOIN (
    SELECT 
        user_id,
        COUNT(*) as recent_activity_count
    FROM public.user_activity
    WHERE created_at >= NOW() - INTERVAL '30 days'
    GROUP BY user_id
) ua_count ON p.id = ua_count.user_id;

-- Grant access to the view
GRANT SELECT ON public.user_management_summary TO authenticated;

-- Add RLS policy for the view
CREATE POLICY "Admins can view user management summary" ON public.user_management_summary
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Create indexes for better performance on the view
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_last_login ON public.profiles(last_login_at DESC NULLS LAST);

COMMENT ON TABLE public.auth_providers IS 'Tracks authentication providers used by each user';
COMMENT ON TABLE public.user_activity IS 'Logs user activities for analytics and audit purposes';
COMMENT ON VIEW public.user_management_summary IS 'Comprehensive view for user management dashboard';