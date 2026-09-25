-- ==============================================================================
-- WASTE2VALUE — Database Schema & Row Level Security Migration
-- Migration: 0001_initial_schema.sql
-- Description: Production database foundation with normalized tables, triggers,
--              indexes, and strict Row Level Security (RLS) policies.
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. PROFILES TABLE (Associated with auth.users)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('household', 'student', 'business', 'recycler', 'ngo')) DEFAULT 'household',
    city TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    interests TEXT[] DEFAULT ARRAY['reuse', 'donate']::TEXT[],
    notifications_enabled BOOLEAN NOT NULL DEFAULT true,
    reduced_motion BOOLEAN NOT NULL DEFAULT false,
    search_radius_km INTEGER NOT NULL DEFAULT 10 CHECK (search_radius_km > 0 AND search_radius_km <= 100),
    onboarding_completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'Application user profile metadata associated with auth.users without duplicating secrets.';

-- ==============================================================================
-- 2. RECEIVERS TABLE (Circular economy partners & drop-off locations)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.receivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('ngo', 'reuse_center', 'recycler', 'buyer', 'community')),
    type_label TEXT NOT NULL,
    distance_km NUMERIC(6,2) NOT NULL DEFAULT 0.0 CHECK (distance_km >= 0),
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    accepted_categories TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    accepted_conditions TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    supported_value_paths TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    open_hours TEXT NOT NULL,
    is_open_now BOOLEAN NOT NULL DEFAULT true,
    description TEXT NOT NULL,
    verification_status TEXT NOT NULL CHECK (verification_status IN ('verified', 'unverified', 'demo')) DEFAULT 'demo',
    contact_email TEXT,
    contact_phone TEXT,
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.receivers IS 'Verified and demo organizations, NGOs, recyclers, and community reuse centers.';

-- ==============================================================================
-- 3. ITEMS TABLE (Waste and circular material items)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('Furniture', 'Electronics', 'Clothing', 'Plastic', 'Paper', 'Metal', 'Glass', 'Other')),
    material TEXT NOT NULL,
    condition TEXT NOT NULL CHECK (condition IN ('Usable', 'Repairable', 'Recyclable', 'Parts Only', 'Unknown')),
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    is_ai_assisted BOOLEAN NOT NULL DEFAULT false,
    ai_confidence TEXT CHECK (ai_confidence IN ('High', 'Medium', 'Low')),
    recommended_value_path TEXT NOT NULL CHECK (recommended_value_path IN ('reuse', 'donate', 'resell', 'recycle')),
    selected_value_path TEXT CHECK (selected_value_path IN ('reuse', 'donate', 'resell', 'recycle')),
    receiver_id UUID REFERENCES public.receivers(id) ON DELETE SET NULL,
    status TEXT NOT NULL CHECK (status IN ('identified', 'value_selected', 'receiver_found', 'handover_scheduled', 'completed', 'cancelled')) DEFAULT 'identified',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.items IS 'Individual scanned and categorized items in the circular lifecycle.';

-- ==============================================================================
-- 4. AI ASSESSMENTS TABLE (Audit trail of Vision and Value AI analyses)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.ai_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID REFERENCES public.items(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    detected_object TEXT NOT NULL,
    category TEXT NOT NULL,
    material TEXT NOT NULL,
    condition TEXT NOT NULL,
    confidence TEXT NOT NULL CHECK (confidence IN ('High', 'Medium', 'Low')),
    confidence_score NUMERIC(4,3) CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
    quality_issues TEXT[] DEFAULT ARRAY[]::TEXT[],
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    summary_reasoning TEXT,
    paths_evaluation JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.ai_assessments IS 'Three-AI assessment logs containing detected attributes and value matrix evaluations.';

-- ==============================================================================
-- 5. HANDOVER RECORDS TABLE (Handover scheduling and tracking timeline)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.handover_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.receivers(id) ON DELETE RESTRICT,
    value_path TEXT NOT NULL CHECK (value_path IN ('reuse', 'donate', 'resell', 'recycle')),
    status TEXT NOT NULL CHECK (status IN ('identified', 'value_selected', 'receiver_found', 'handover_scheduled', 'completed', 'cancelled')) DEFAULT 'receiver_found',
    scheduled_date TIMESTAMPTZ,
    notes TEXT,
    timeline JSONB NOT NULL DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.handover_records IS 'Handover coordination and milestone progression.';

-- ==============================================================================
-- 6. IMPACT RECORDS TABLE (Environmental and resource telemetry per user)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.impact_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    total_diverted INTEGER NOT NULL DEFAULT 0 CHECK (total_diverted >= 0),
    reused_count INTEGER NOT NULL DEFAULT 0 CHECK (reused_count >= 0),
    donated_count INTEGER NOT NULL DEFAULT 0 CHECK (donated_count >= 0),
    resold_count INTEGER NOT NULL DEFAULT 0 CHECK (resold_count >= 0),
    recycled_count INTEGER NOT NULL DEFAULT 0 CHECK (recycled_count >= 0),
    estimated_weight_kg NUMERIC(8,2) NOT NULL DEFAULT 0.0 CHECK (estimated_weight_kg >= 0),
    estimated_co2_kg NUMERIC(8,2) NOT NULL DEFAULT 0.0 CHECK (estimated_co2_kg >= 0),
    is_estimated BOOLEAN NOT NULL DEFAULT true,
    data_label TEXT NOT NULL DEFAULT 'Estimated',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.impact_records IS 'User circular economy impact metrics adhering to data honesty transparency.';

-- ==============================================================================
-- 7. INDEXES (Optimized query execution)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_items_user_id ON public.items(user_id);
CREATE INDEX IF NOT EXISTS idx_items_status ON public.items(status);
CREATE INDEX IF NOT EXISTS idx_items_category ON public.items(category);
CREATE INDEX IF NOT EXISTS idx_receivers_is_active ON public.receivers(is_active);
CREATE INDEX IF NOT EXISTS idx_receivers_city ON public.receivers(city);
CREATE INDEX IF NOT EXISTS idx_handover_user_id ON public.handover_records(user_id);
CREATE INDEX IF NOT EXISTS idx_handover_item_id ON public.handover_records(item_id);
CREATE INDEX IF NOT EXISTS idx_ai_assessments_item_id ON public.ai_assessments(item_id);
CREATE INDEX IF NOT EXISTS idx_ai_assessments_user_id ON public.ai_assessments(user_id);

-- ==============================================================================
-- 8. AUTOMATIC PROFILE AND IMPACT INITIALIZATION TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, role, city)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', ''),
        CASE
            WHEN NEW.raw_user_meta_data->>'role' IN ('household', 'student', 'business', 'recycler', 'ngo')
            THEN NEW.raw_user_meta_data->>'role'
            ELSE 'household'
        END,
        NEW.raw_user_meta_data->>'city'
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.impact_records (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$;

-- Trigger execution on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on every application table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.handover_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_records ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- PROFILES POLICIES
-- ------------------------------------------------------------------------------
-- Users can view their own profile
CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- RECEIVERS POLICIES
-- ------------------------------------------------------------------------------
-- Receivers are public directory records (only active ones visible to authenticated and anon users)
CREATE POLICY "Active receivers are visible to authenticated users"
    ON public.receivers FOR SELECT
    USING (is_active = true);

-- Modifying receivers requires service_role / administrative access
-- (No public insert/update/delete policies defined)

-- ------------------------------------------------------------------------------
-- ITEMS POLICIES
-- ------------------------------------------------------------------------------
-- Users can view their own items
CREATE POLICY "Users can read own items"
    ON public.items FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own items
CREATE POLICY "Users can insert own items"
    ON public.items FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own items
CREATE POLICY "Users can update own items"
    ON public.items FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own items
CREATE POLICY "Users can delete own items"
    ON public.items FOR DELETE
    USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- AI ASSESSMENTS POLICIES
-- ------------------------------------------------------------------------------
-- Users can access assessments for their own items
CREATE POLICY "Users can read own ai assessments"
    ON public.ai_assessments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ai assessments"
    ON public.ai_assessments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- HANDOVER RECORDS POLICIES
-- ------------------------------------------------------------------------------
-- Users can view their own handover records
CREATE POLICY "Users can read own handover records"
    ON public.handover_records FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create handover records for their items (verifies item ownership to prevent IDOR)
CREATE POLICY "Users can insert own handover records"
    ON public.handover_records FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.items
            WHERE items.id = handover_records.item_id
              AND items.user_id = auth.uid()
        )
    );

-- Users can update their own handover records
CREATE POLICY "Users can update own handover records"
    ON public.handover_records FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.items
            WHERE items.id = handover_records.item_id
              AND items.user_id = auth.uid()
        )
    );

-- ------------------------------------------------------------------------------
-- IMPACT RECORDS POLICIES
-- ------------------------------------------------------------------------------
-- Users can view their own impact telemetry
CREATE POLICY "Users can read own impact records"
    ON public.impact_records FOR SELECT
    USING (auth.uid() = user_id);

-- Direct client modification of impact telemetry is disallowed (data honesty enforcement).
-- Telemetry is maintained exclusively by database triggers and verified backend service operations.

-- ==============================================================================
-- 10. SEED INITIAL RECEIVERS (Demonstration data for discovery)
-- ==============================================================================
INSERT INTO public.receivers (
    name, type, type_label, distance_km, address, city,
    accepted_categories, accepted_conditions, supported_value_paths,
    open_hours, is_open_now, description, verification_status, contact_email, contact_phone
) VALUES
(
    'Community Furniture Reuse Center',
    'reuse_center',
    'Reuse Organization',
    2.4,
    '450 Mission Street, Suite 102',
    'San Francisco, CA',
    ARRAY['Furniture']::TEXT[],
    ARRAY['Usable', 'Repairable']::TEXT[],
    ARRAY['reuse', 'donate']::TEXT[],
    'Open today until 6:00 PM',
    true,
    'Non-profit workshop accepting timber furniture for community refurbishment and affordable redistribution.',
    'demo',
    'intake@furniturereuse.org',
    '+1 (415) 555-0142'
),
(
    'GreenLoop Community Exchange',
    'community',
    'Community Reuse Center',
    3.1,
    '890 Folsom Street',
    'San Francisco, CA',
    ARRAY['Furniture', 'Electronics', 'Clothing', 'Other']::TEXT[],
    ARRAY['Usable', 'Repairable', 'Parts Only']::TEXT[],
    ARRAY['reuse', 'donate', 'resell']::TEXT[],
    'Open today until 5:30 PM',
    true,
    'Neighborhood circular hub hosting weekly swap meets and tool library repairs for household goods.',
    'demo',
    'hello@greenloop.org',
    NULL
),
(
    'Bay Eco-Recycling Facility',
    'recycler',
    'Certified Recycler',
    5.8,
    '1200 Industrial Parkway',
    'San Francisco, CA',
    ARRAY['Metal', 'Plastic', 'Glass', 'Electronics']::TEXT[],
    ARRAY['Recyclable', 'Parts Only']::TEXT[],
    ARRAY['recycle']::TEXT[],
    'Mon–Sat: 8:00 AM – 4:00 PM',
    true,
    'High-grade material disassembly and mechanical recycling partner ensuring zero-landfill diversion.',
    'demo',
    'operations@bayecorecycle.com',
    NULL
),
(
    'Habitat ReStore & Donation Hub',
    'ngo',
    'Charity Donation Partner',
    4.5,
    '710 Brannan Street',
    'San Francisco, CA',
    ARRAY['Furniture', 'Other']::TEXT[],
    ARRAY['Usable']::TEXT[],
    ARRAY['donate', 'resell']::TEXT[],
    'Open today until 7:00 PM',
    true,
    'Donation depot supporting low-income home improvement and community housing initiatives.',
    'demo',
    NULL,
    NULL
)
ON CONFLICT DO NOTHING;
