/**
 * Waste2Value — Supabase Database Types
 * Represents the Postgres database schema definitions, tables, rows, inserts, and updates.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string; // references auth.users.id
          name: string;
          email: string;
          role: 'household' | 'student' | 'business' | 'recycler' | 'ngo';
          city: string | null;
          latitude: number | null;
          longitude: number | null;
          interests: string[];
          notifications_enabled: boolean;
          reduced_motion: boolean;
          search_radius_km: number;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          email: string;
          role?: 'household' | 'student' | 'business' | 'recycler' | 'ngo';
          city?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          interests?: string[];
          notifications_enabled?: boolean;
          reduced_motion?: boolean;
          search_radius_km?: number;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: 'household' | 'student' | 'business' | 'recycler' | 'ngo';
          city?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          interests?: string[];
          notifications_enabled?: boolean;
          reduced_motion?: boolean;
          search_radius_km?: number;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      items: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          category: string;
          material: string;
          condition: string;
          image_url: string;
          thumbnail_url: string | null;
          is_ai_assisted: boolean;
          ai_confidence: string | null;
          recommended_value_path: 'reuse' | 'donate' | 'resell' | 'recycle';
          selected_value_path: 'reuse' | 'donate' | 'resell' | 'recycle' | null;
          receiver_id: string | null;
          status:
            | 'identified'
            | 'value_selected'
            | 'receiver_found'
            | 'handover_scheduled'
            | 'completed'
            | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          category: string;
          material: string;
          condition: string;
          image_url: string;
          thumbnail_url?: string | null;
          is_ai_assisted?: boolean;
          ai_confidence?: string | null;
          recommended_value_path: 'reuse' | 'donate' | 'resell' | 'recycle';
          selected_value_path?: 'reuse' | 'donate' | 'resell' | 'recycle' | null;
          receiver_id?: string | null;
          status?:
            | 'identified'
            | 'value_selected'
            | 'receiver_found'
            | 'handover_scheduled'
            | 'completed'
            | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          category?: string;
          material?: string;
          condition?: string;
          image_url?: string;
          thumbnail_url?: string | null;
          is_ai_assisted?: boolean;
          ai_confidence?: string | null;
          recommended_value_path?: 'reuse' | 'donate' | 'resell' | 'recycle';
          selected_value_path?: 'reuse' | 'donate' | 'resell' | 'recycle' | null;
          receiver_id?: string | null;
          status?:
            | 'identified'
            | 'value_selected'
            | 'receiver_found'
            | 'handover_scheduled'
            | 'completed'
            | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ai_assessments: {
        Row: {
          id: string;
          item_id: string | null;
          user_id: string;
          detected_object: string;
          category: string;
          material: string;
          condition: string;
          confidence: 'High' | 'Medium' | 'Low';
          confidence_score: number | null;
          quality_issues: string[];
          tags: string[];
          summary_reasoning: string | null;
          paths_evaluation: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          item_id?: string | null;
          user_id: string;
          detected_object: string;
          category: string;
          material: string;
          condition: string;
          confidence: 'High' | 'Medium' | 'Low';
          confidence_score?: number | null;
          quality_issues?: string[];
          tags?: string[];
          summary_reasoning?: string | null;
          paths_evaluation?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          item_id?: string | null;
          user_id?: string;
          detected_object?: string;
          category?: string;
          material?: string;
          condition?: string;
          confidence?: 'High' | 'Medium' | 'Low';
          confidence_score?: number | null;
          quality_issues?: string[];
          tags?: string[];
          summary_reasoning?: string | null;
          paths_evaluation?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      receivers: {
        Row: {
          id: string;
          name: string;
          type: 'ngo' | 'reuse_center' | 'recycler' | 'buyer' | 'community';
          type_label: string;
          distance_km: number;
          address: string;
          city: string;
          latitude: number | null;
          longitude: number | null;
          accepted_categories: string[];
          accepted_conditions: string[];
          supported_value_paths: string[];
          open_hours: string;
          is_open_now: boolean;
          description: string;
          verification_status: 'verified' | 'unverified' | 'demo';
          contact_email: string | null;
          contact_phone: string | null;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: 'ngo' | 'reuse_center' | 'recycler' | 'buyer' | 'community';
          type_label: string;
          distance_km?: number;
          address: string;
          city: string;
          latitude?: number | null;
          longitude?: number | null;
          accepted_categories?: string[];
          accepted_conditions?: string[];
          supported_value_paths?: string[];
          open_hours: string;
          is_open_now?: boolean;
          description: string;
          verification_status?: 'verified' | 'unverified' | 'demo';
          contact_email?: string | null;
          contact_phone?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: 'ngo' | 'reuse_center' | 'recycler' | 'buyer' | 'community';
          type_label?: string;
          distance_km?: number;
          address?: string;
          city?: string;
          latitude?: number | null;
          longitude?: number | null;
          accepted_categories?: string[];
          accepted_conditions?: string[];
          supported_value_paths?: string[];
          open_hours?: string;
          is_open_now?: boolean;
          description?: string;
          verification_status?: 'verified' | 'unverified' | 'demo';
          contact_email?: string | null;
          contact_phone?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      handover_records: {
        Row: {
          id: string;
          item_id: string;
          user_id: string;
          receiver_id: string;
          value_path: 'reuse' | 'donate' | 'resell' | 'recycle';
          status:
            | 'identified'
            | 'value_selected'
            | 'receiver_found'
            | 'handover_scheduled'
            | 'completed'
            | 'cancelled';
          scheduled_date: string | null;
          notes: string | null;
          timeline: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          item_id: string;
          user_id: string;
          receiver_id: string;
          value_path: 'reuse' | 'donate' | 'resell' | 'recycle';
          status?:
            | 'identified'
            | 'value_selected'
            | 'receiver_found'
            | 'handover_scheduled'
            | 'completed'
            | 'cancelled';
          scheduled_date?: string | null;
          notes?: string | null;
          timeline?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          item_id?: string;
          user_id?: string;
          receiver_id?: string;
          value_path?: 'reuse' | 'donate' | 'resell' | 'recycle';
          status?:
            | 'identified'
            | 'value_selected'
            | 'receiver_found'
            | 'handover_scheduled'
            | 'completed'
            | 'cancelled';
          scheduled_date?: string | null;
          notes?: string | null;
          timeline?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'handover_records_item_id_fkey';
            columns: ['item_id'];
            isOneToOne: false;
            referencedRelation: 'items';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'handover_records_receiver_id_fkey';
            columns: ['receiver_id'];
            isOneToOne: false;
            referencedRelation: 'receivers';
            referencedColumns: ['id'];
          },
        ];
      };
      impact_records: {
        Row: {
          id: string;
          user_id: string;
          total_diverted: number;
          reused_count: number;
          donated_count: number;
          resold_count: number;
          recycled_count: number;
          estimated_weight_kg: number;
          estimated_co2_kg: number;
          is_estimated: boolean;
          data_label: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total_diverted?: number;
          reused_count?: number;
          donated_count?: number;
          resold_count?: number;
          recycled_count?: number;
          estimated_weight_kg?: number;
          estimated_co2_kg?: number;
          is_estimated?: boolean;
          data_label?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          total_diverted?: number;
          reused_count?: number;
          donated_count?: number;
          resold_count?: number;
          recycled_count?: number;
          estimated_weight_kg?: number;
          estimated_co2_kg?: number;
          is_estimated?: boolean;
          data_label?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
