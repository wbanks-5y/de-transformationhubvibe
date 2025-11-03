export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analysis_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          parent_comment_id: string | null
          shared_analysis_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          shared_analysis_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          shared_analysis_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "analysis_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_comments_shared_analysis_id_fkey"
            columns: ["shared_analysis_id"]
            isOneToOne: false
            referencedRelation: "shared_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_permissions: {
        Row: {
          granted_at: string
          granted_by: string
          id: string
          permission: string
          revoked_at: string | null
          shared_analysis_id: string
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by: string
          id?: string
          permission: string
          revoked_at?: string | null
          shared_analysis_id: string
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string
          id?: string
          permission?: string
          revoked_at?: string | null
          shared_analysis_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_permissions_shared_analysis_id_fkey"
            columns: ["shared_analysis_id"]
            isOneToOne: false
            referencedRelation: "shared_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_templates: {
        Row: {
          category: string
          created_at: string
          created_by: string
          description: string
          id: string
          is_public: boolean
          name: string
          tags: string[]
          template_data: Json
          updated_at: string
          usage_count: number
        }
        Insert: {
          category: string
          created_at?: string
          created_by: string
          description: string
          id?: string
          is_public?: boolean
          name: string
          tags?: string[]
          template_data?: Json
          updated_at?: string
          usage_count?: number
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string
          description?: string
          id?: string
          is_public?: boolean
          name?: string
          tags?: string[]
          template_data?: Json
          updated_at?: string
          usage_count?: number
        }
        Relationships: []
      }
      analyst_insight_categories: {
        Row: {
          color_class: string | null
          created_at: string | null
          description: string | null
          display_name: string
          icon_name: string | null
          id: string
          is_active: boolean | null
          name: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          color_class?: string | null
          created_at?: string | null
          description?: string | null
          display_name: string
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          color_class?: string | null
          created_at?: string | null
          description?: string | null
          display_name?: string
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      analyst_insights: {
        Row: {
          approval_status: string
          approved_at: string | null
          approved_by: string | null
          category: string
          created_at: string
          description: string
          external_url: string | null
          icon_name: string | null
          id: string
          impact: string
          is_active: boolean
          source: string | null
          tags: Json | null
          timestamp_text: string
          title: string
          updated_at: string
        }
        Insert: {
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          category: string
          created_at?: string
          description: string
          external_url?: string | null
          icon_name?: string | null
          id?: string
          impact: string
          is_active?: boolean
          source?: string | null
          tags?: Json | null
          timestamp_text: string
          title: string
          updated_at?: string
        }
        Update: {
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          category?: string
          created_at?: string
          description?: string
          external_url?: string | null
          icon_name?: string | null
          id?: string
          impact?: string
          is_active?: boolean
          source?: string | null
          tags?: Json | null
          timestamp_text?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      azure_sql_connections: {
        Row: {
          connection_timeout: number | null
          created_at: string | null
          database_name: string
          id: string
          is_active: boolean | null
          name: string
          password_encrypted: string
          port: number | null
          server: string
          updated_at: string | null
          username: string
        }
        Insert: {
          connection_timeout?: number | null
          created_at?: string | null
          database_name: string
          id?: string
          is_active?: boolean | null
          name: string
          password_encrypted: string
          port?: number | null
          server: string
          updated_at?: string | null
          username: string
        }
        Update: {
          connection_timeout?: number | null
          created_at?: string | null
          database_name?: string
          id?: string
          is_active?: boolean | null
          name?: string
          password_encrypted?: string
          port?: number | null
          server?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      business_processes: {
        Row: {
          created_at: string
          description: string | null
          display_name: string
          id: string
          is_active: boolean
          name: string
          route_path: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name: string
          id?: string
          is_active?: boolean
          name: string
          route_path: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string
          id?: string
          is_active?: boolean
          name?: string
          route_path?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      cockpit_filters: {
        Row: {
          azure_sql_config: Json | null
          cockpit_type_id: string | null
          created_at: string | null
          filter_config: Json
          filter_type: string
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          azure_sql_config?: Json | null
          cockpit_type_id?: string | null
          created_at?: string | null
          filter_config: Json
          filter_type: string
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          azure_sql_config?: Json | null
          cockpit_type_id?: string | null
          created_at?: string | null
          filter_config?: Json
          filter_type?: string
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cockpit_filters_cockpit_type_id_fkey"
            columns: ["cockpit_type_id"]
            isOneToOne: false
            referencedRelation: "cockpit_types"
            referencedColumns: ["id"]
          },
        ]
      }
      cockpit_insights: {
        Row: {
          cockpit_type_id: string | null
          confidence_score: number | null
          created_at: string | null
          description: string
          expires_at: string | null
          generated_at: string | null
          id: string
          insight_category: string | null
          insight_data: Json | null
          insight_type: string
          is_active: boolean | null
          priority: string | null
          source_data_ids: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          cockpit_type_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          description: string
          expires_at?: string | null
          generated_at?: string | null
          id?: string
          insight_category?: string | null
          insight_data?: Json | null
          insight_type: string
          is_active?: boolean | null
          priority?: string | null
          source_data_ids?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          cockpit_type_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          description?: string
          expires_at?: string | null
          generated_at?: string | null
          id?: string
          insight_category?: string | null
          insight_data?: Json | null
          insight_type?: string
          is_active?: boolean | null
          priority?: string | null
          source_data_ids?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cockpit_insights_cockpit_type_id_fkey"
            columns: ["cockpit_type_id"]
            isOneToOne: false
            referencedRelation: "cockpit_types"
            referencedColumns: ["id"]
          },
        ]
      }
      cockpit_kpi_formulas: {
        Row: {
          category: string
          created_at: string
          description: string | null
          display_name: string
          example_usage: string | null
          formula_template: string
          id: string
          is_active: boolean
          name: string
          parameter_schema: Json
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          display_name: string
          example_usage?: string | null
          formula_template: string
          id?: string
          is_active?: boolean
          name: string
          parameter_schema?: Json
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          display_name?: string
          example_usage?: string | null
          formula_template?: string
          id?: string
          is_active?: boolean
          name?: string
          parameter_schema?: Json
          updated_at?: string
        }
        Relationships: []
      }
      cockpit_kpi_targets: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          kpi_id: string | null
          notes: string | null
          period_end: string | null
          period_start: string | null
          period_type: string | null
          target_type: string | null
          target_value: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          kpi_id?: string | null
          notes?: string | null
          period_end?: string | null
          period_start?: string | null
          period_type?: string | null
          target_type?: string | null
          target_value: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          kpi_id?: string | null
          notes?: string | null
          period_end?: string | null
          period_start?: string | null
          period_type?: string | null
          target_type?: string | null
          target_value?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cockpit_kpi_targets_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "cockpit_kpis"
            referencedColumns: ["id"]
          },
        ]
      }
      cockpit_kpi_time_based: {
        Row: {
          actual_value: number
          created_at: string | null
          id: string
          kpi_id: string | null
          notes: string | null
          period_end: string
          period_start: string
          period_type: string | null
          updated_at: string | null
        }
        Insert: {
          actual_value: number
          created_at?: string | null
          id?: string
          kpi_id?: string | null
          notes?: string | null
          period_end: string
          period_start: string
          period_type?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_value?: number
          created_at?: string | null
          id?: string
          kpi_id?: string | null
          notes?: string | null
          period_end?: string
          period_start?: string
          period_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cockpit_kpi_time_based_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "cockpit_kpis"
            referencedColumns: ["id"]
          },
        ]
      }
      cockpit_kpi_values: {
        Row: {
          created_at: string | null
          current_value: number
          id: string
          kpi_id: string | null
          notes: string | null
          recorded_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_value: number
          id?: string
          kpi_id?: string | null
          notes?: string | null
          recorded_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_value?: number
          id?: string
          kpi_id?: string | null
          notes?: string | null
          recorded_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cockpit_kpi_values_kpi_id_fkey1"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "cockpit_kpis"
            referencedColumns: ["id"]
          },
        ]
      }
      cockpit_kpis: {
        Row: {
          cockpit_type_id: string | null
          color_class: string | null
          created_at: string | null
          description: string | null
          display_name: string
          format_options: Json | null
          format_type: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          kpi_data_type: string | null
          name: string
          size_config: string | null
          sort_order: number | null
          trend_direction: string | null
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          cockpit_type_id?: string | null
          color_class?: string | null
          created_at?: string | null
          description?: string | null
          display_name: string
          format_options?: Json | null
          format_type?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          kpi_data_type?: string | null
          name: string
          size_config?: string | null
          sort_order?: number | null
          trend_direction?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          cockpit_type_id?: string | null
          color_class?: string | null
          created_at?: string | null
          description?: string | null
          display_name?: string
          format_options?: Json | null
          format_type?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          kpi_data_type?: string | null
          name?: string
          size_config?: string | null
          sort_order?: number | null
          trend_direction?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cockpit_kpis_cockpit_type_id_fkey1"
            columns: ["cockpit_type_id"]
            isOneToOne: false
            referencedRelation: "cockpit_types"
            referencedColumns: ["id"]
          },
        ]
      }
      cockpit_sections: {
        Row: {
          cockpit_type_id: string | null
          created_at: string | null
          description: string | null
          display_name: string
          id: string
          is_active: boolean | null
          name: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          cockpit_type_id?: string | null
          created_at?: string | null
          description?: string | null
          display_name: string
          id?: string
          is_active?: boolean | null
          name: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          cockpit_type_id?: string | null
          created_at?: string | null
          description?: string | null
          display_name?: string
          id?: string
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cockpit_sections_cockpit_type_id_fkey"
            columns: ["cockpit_type_id"]
            isOneToOne: false
            referencedRelation: "cockpit_types"
            referencedColumns: ["id"]
          },
        ]
      }
      cockpit_types: {
        Row: {
          cockpit_description: string | null
          color_class: string | null
          created_at: string | null
          description: string | null
          display_name: string
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          route_path: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          cockpit_description?: string | null
          color_class?: string | null
          created_at?: string | null
          description?: string | null
          display_name: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          route_path: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          cockpit_description?: string | null
          color_class?: string | null
          created_at?: string | null
          description?: string | null
          display_name?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          route_path?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      comment_reactions: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          reaction_type: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_reactions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "analysis_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      company_profile: {
        Row: {
          business_model: string | null
          company_name: string
          company_size: string | null
          competitive_advantages: string | null
          core_values: string | null
          created_at: string
          current_challenges: string | null
          description: string | null
          financial_year_end: string | null
          headquarters_location: string | null
          id: string
          industry: string | null
          key_markets: string | null
          key_products_services: string | null
          mission_statement: string | null
          organizational_structure: string | null
          strategic_priorities: string | null
          target_market: string | null
          updated_at: string
          vision_statement: string | null
        }
        Insert: {
          business_model?: string | null
          company_name: string
          company_size?: string | null
          competitive_advantages?: string | null
          core_values?: string | null
          created_at?: string
          current_challenges?: string | null
          description?: string | null
          financial_year_end?: string | null
          headquarters_location?: string | null
          id?: string
          industry?: string | null
          key_markets?: string | null
          key_products_services?: string | null
          mission_statement?: string | null
          organizational_structure?: string | null
          strategic_priorities?: string | null
          target_market?: string | null
          updated_at?: string
          vision_statement?: string | null
        }
        Update: {
          business_model?: string | null
          company_name?: string
          company_size?: string | null
          competitive_advantages?: string | null
          core_values?: string | null
          created_at?: string
          current_challenges?: string | null
          description?: string | null
          financial_year_end?: string | null
          headquarters_location?: string | null
          id?: string
          industry?: string | null
          key_markets?: string | null
          key_products_services?: string | null
          mission_statement?: string | null
          organizational_structure?: string | null
          strategic_priorities?: string | null
          target_market?: string | null
          updated_at?: string
          vision_statement?: string | null
        }
        Relationships: []
      }
      data_access_log: {
        Row: {
          access_type: string
          accessed_at: string
          field_names: string[] | null
          id: string
          ip_address: unknown
          metadata: Json | null
          record_id: string | null
          success: boolean
          table_name: string
          user_id: string
        }
        Insert: {
          access_type: string
          accessed_at?: string
          field_names?: string[] | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          record_id?: string | null
          success?: boolean
          table_name: string
          user_id: string
        }
        Update: {
          access_type?: string
          accessed_at?: string
          field_names?: string[] | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          record_id?: string | null
          success?: boolean
          table_name?: string
          user_id?: string
        }
        Relationships: []
      }
      encrypted_api_keys: {
        Row: {
          created_at: string | null
          created_by: string | null
          encrypted_value: string
          id: string
          key_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          encrypted_value: string
          id?: string
          key_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          encrypted_value?: string
          id?: string
          key_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      initiative_kpi_links: {
        Row: {
          created_at: string | null
          id: string
          initiative_id: string
          is_active: boolean | null
          kpi_id: string
          notes: string | null
          target_impact_percentage: number | null
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          initiative_id: string
          is_active?: boolean | null
          kpi_id: string
          notes?: string | null
          target_impact_percentage?: number | null
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          initiative_id?: string
          is_active?: boolean | null
          kpi_id?: string
          notes?: string | null
          target_impact_percentage?: number | null
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "initiative_kpi_links_initiative_id_fkey"
            columns: ["initiative_id"]
            isOneToOne: false
            referencedRelation: "initiative_health_scores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "initiative_kpi_links_initiative_id_fkey"
            columns: ["initiative_id"]
            isOneToOne: false
            referencedRelation: "strategic_initiatives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "initiative_kpi_links_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "cockpit_kpis"
            referencedColumns: ["id"]
          },
        ]
      }
      invitation_tokens: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          organization_id: string | null
          organization_slug: string
          organization_supabase_anon_key: string
          organization_supabase_url: string
          token: string
          updated_at: string | null
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          organization_id?: string | null
          organization_slug: string
          organization_supabase_anon_key: string
          organization_supabase_url: string
          token?: string
          updated_at?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          organization_id?: string | null
          organization_slug?: string
          organization_supabase_anon_key?: string
          organization_supabase_url?: string
          token?: string
          updated_at?: string | null
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitation_tokens_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      metric_base: {
        Row: {
          created_at: string | null
          data_source_mode: string | null
          description: string | null
          display_name: string
          id: string
          is_active: boolean | null
          name: string
          section_id: string | null
          size_config: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_source_mode?: string | null
          description?: string | null
          display_name: string
          id?: string
          is_active?: boolean | null
          name: string
          section_id?: string | null
          size_config?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_source_mode?: string | null
          description?: string | null
          display_name?: string
          id?: string
          is_active?: boolean | null
          name?: string
          section_id?: string | null
          size_config?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "metric_base_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "cockpit_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      metric_multi_value: {
        Row: {
          allow_multiple_series: boolean | null
          base_metric_id: string | null
          chart_type: string
          created_at: string | null
          id: string
          updated_at: string | null
          x_axis_label: string | null
          y_axis_label: string | null
        }
        Insert: {
          allow_multiple_series?: boolean | null
          base_metric_id?: string | null
          chart_type?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          x_axis_label?: string | null
          y_axis_label?: string | null
        }
        Update: {
          allow_multiple_series?: boolean | null
          base_metric_id?: string | null
          chart_type?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          x_axis_label?: string | null
          y_axis_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "metric_multi_value_base_metric_id_fkey"
            columns: ["base_metric_id"]
            isOneToOne: false
            referencedRelation: "metric_base"
            referencedColumns: ["id"]
          },
        ]
      }
      metric_multi_value_data: {
        Row: {
          created_at: string | null
          id: string
          multi_value_metric_id: string | null
          series_color: string | null
          series_name: string | null
          sort_order: number | null
          updated_at: string | null
          x_axis_value: string
          y_axis_value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          multi_value_metric_id?: string | null
          series_color?: string | null
          series_name?: string | null
          sort_order?: number | null
          updated_at?: string | null
          x_axis_value: string
          y_axis_value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          multi_value_metric_id?: string | null
          series_color?: string | null
          series_name?: string | null
          sort_order?: number | null
          updated_at?: string | null
          x_axis_value?: string
          y_axis_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "metric_multi_value_data_multi_value_metric_id_fkey"
            columns: ["multi_value_metric_id"]
            isOneToOne: false
            referencedRelation: "metric_multi_value"
            referencedColumns: ["id"]
          },
        ]
      }
      metric_single_value: {
        Row: {
          actual_value: number | null
          base_metric_id: string | null
          created_at: string | null
          id: string
          metric_type: string
          target_value: number | null
          trend: string | null
          updated_at: string | null
        }
        Insert: {
          actual_value?: number | null
          base_metric_id?: string | null
          created_at?: string | null
          id?: string
          metric_type: string
          target_value?: number | null
          trend?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_value?: number | null
          base_metric_id?: string | null
          created_at?: string | null
          id?: string
          metric_type?: string
          target_value?: number | null
          trend?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "metric_single_value_base_metric_id_fkey"
            columns: ["base_metric_id"]
            isOneToOne: false
            referencedRelation: "metric_base"
            referencedColumns: ["id"]
          },
        ]
      }
      metric_time_based: {
        Row: {
          allow_multiple_series: boolean | null
          base_metric_id: string | null
          chart_type: string
          created_at: string | null
          id: string
          time_granularity: string
          updated_at: string | null
          y_axis_label: string | null
        }
        Insert: {
          allow_multiple_series?: boolean | null
          base_metric_id?: string | null
          chart_type?: string
          created_at?: string | null
          id?: string
          time_granularity?: string
          updated_at?: string | null
          y_axis_label?: string | null
        }
        Update: {
          allow_multiple_series?: boolean | null
          base_metric_id?: string | null
          chart_type?: string
          created_at?: string | null
          id?: string
          time_granularity?: string
          updated_at?: string | null
          y_axis_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "metric_time_based_base_metric_id_fkey"
            columns: ["base_metric_id"]
            isOneToOne: false
            referencedRelation: "metric_base"
            referencedColumns: ["id"]
          },
        ]
      }
      metric_time_based_data: {
        Row: {
          created_at: string | null
          date_value: string | null
          day: number | null
          id: string
          month: number | null
          quarter: number | null
          series_color: string | null
          series_name: string | null
          time_metric_id: string | null
          updated_at: string | null
          value: number
          week: number | null
          year: number
        }
        Insert: {
          created_at?: string | null
          date_value?: string | null
          day?: number | null
          id?: string
          month?: number | null
          quarter?: number | null
          series_color?: string | null
          series_name?: string | null
          time_metric_id?: string | null
          updated_at?: string | null
          value: number
          week?: number | null
          year: number
        }
        Update: {
          created_at?: string | null
          date_value?: string | null
          day?: number | null
          id?: string
          month?: number | null
          quarter?: number | null
          series_color?: string | null
          series_name?: string | null
          time_metric_id?: string | null
          updated_at?: string | null
          value?: number
          week?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "metric_time_based_data_time_metric_id_fkey"
            columns: ["time_metric_id"]
            isOneToOne: false
            referencedRelation: "metric_time_based"
            referencedColumns: ["id"]
          },
        ]
      }
      milestone_templates: {
        Row: {
          created_at: string | null
          default_deliverables: Json | null
          description: string | null
          estimated_duration_days: number | null
          id: string
          is_active: boolean | null
          milestone_weight: number | null
          name: string
          sort_order: number | null
          template_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_deliverables?: Json | null
          description?: string | null
          estimated_duration_days?: number | null
          id?: string
          is_active?: boolean | null
          milestone_weight?: number | null
          name: string
          sort_order?: number | null
          template_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_deliverables?: Json | null
          description?: string | null
          estimated_duration_days?: number | null
          id?: string
          is_active?: boolean | null
          milestone_weight?: number | null
          name?: string
          sort_order?: number | null
          template_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      myles_analysis_sessions: {
        Row: {
          analysis_type: string
          created_at: string
          error_message: string | null
          execution_time_ms: number | null
          generated_query: string | null
          id: string
          insights: string | null
          prompt: string
          query_result: Json | null
          sql_config_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_type?: string
          created_at?: string
          error_message?: string | null
          execution_time_ms?: number | null
          generated_query?: string | null
          id?: string
          insights?: string | null
          prompt: string
          query_result?: Json | null
          sql_config_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_type?: string
          created_at?: string
          error_message?: string | null
          execution_time_ms?: number | null
          generated_query?: string | null
          id?: string
          insights?: string | null
          prompt?: string
          query_result?: Json | null
          sql_config_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "myles_analysis_sessions_sql_config_id_fkey"
            columns: ["sql_config_id"]
            isOneToOne: false
            referencedRelation: "myles_sql_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      myles_custom_personas: {
        Row: {
          analysis_guidance: string | null
          created_at: string
          description: string | null
          focus_areas: string[] | null
          id: string
          is_active: boolean
          prompt: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_guidance?: string | null
          created_at?: string
          description?: string | null
          focus_areas?: string[] | null
          id?: string
          is_active?: boolean
          prompt: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_guidance?: string | null
          created_at?: string
          description?: string | null
          focus_areas?: string[] | null
          id?: string
          is_active?: boolean
          prompt?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      myles_schema_cache: {
        Row: {
          created_at: string
          id: string
          last_introspection_at: string | null
          schema_data: Json
          sql_config_id: string
          table_count: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_introspection_at?: string | null
          schema_data?: Json
          sql_config_id: string
          table_count?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_introspection_at?: string | null
          schema_data?: Json
          sql_config_id?: string
          table_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      myles_sql_configs: {
        Row: {
          connection_timeout: number | null
          connection_type: string
          created_at: string
          database_name: string
          description: string | null
          encrypted_password: string | null
          host: string
          id: string
          is_active: boolean
          last_tested_at: string | null
          name: string
          port: number
          ssl_enabled: boolean
          ssl_mode: string | null
          test_error_message: string | null
          test_status: string | null
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          connection_timeout?: number | null
          connection_type?: string
          created_at?: string
          database_name: string
          description?: string | null
          encrypted_password?: string | null
          host: string
          id?: string
          is_active?: boolean
          last_tested_at?: string | null
          name: string
          port?: number
          ssl_enabled?: boolean
          ssl_mode?: string | null
          test_error_message?: string | null
          test_status?: string | null
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          connection_timeout?: number | null
          connection_type?: string
          created_at?: string
          database_name?: string
          description?: string | null
          encrypted_password?: string | null
          host?: string
          id?: string
          is_active?: boolean
          last_tested_at?: string | null
          name?: string
          port?: number
          ssl_enabled?: boolean
          ssl_mode?: string | null
          test_error_message?: string | null
          test_status?: string | null
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      organization_roles: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          organization_id: string
          permissions: string[]
          role_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          organization_id: string
          permissions?: string[]
          role_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          organization_id?: string
          permissions?: string[]
          role_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          organization_id: string
          role_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          organization_id: string
          role_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          organization_id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_user_roles_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_user_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address: Json | null
          brand_colors: Json
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          custom_domain: string | null
          description: string | null
          features: string[]
          id: string
          logo_url: string | null
          max_users: number
          name: string
          settings: Json
          slug: string
          status: string
          subscription_ends_at: string | null
          subscription_starts_at: string | null
          supabase_service_role_key: string | null
          tier: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: Json | null
          brand_colors?: Json
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          custom_domain?: string | null
          description?: string | null
          features?: string[]
          id?: string
          logo_url?: string | null
          max_users?: number
          name: string
          settings?: Json
          slug: string
          status?: string
          subscription_ends_at?: string | null
          subscription_starts_at?: string | null
          supabase_service_role_key?: string | null
          tier?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: Json | null
          brand_colors?: Json
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          custom_domain?: string | null
          description?: string | null
          features?: string[]
          id?: string
          logo_url?: string | null
          max_users?: number
          name?: string
          settings?: Json
          slug?: string
          status?: string
          subscription_ends_at?: string | null
          subscription_starts_at?: string | null
          supabase_service_role_key?: string | null
          tier?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      process_bottlenecks: {
        Row: {
          created_at: string
          id: string
          impact_level: string
          is_active: boolean
          process_id: string
          sort_order: number
          step_name: string
          updated_at: string
          wait_time_hours: number
        }
        Insert: {
          created_at?: string
          id?: string
          impact_level: string
          is_active?: boolean
          process_id: string
          sort_order?: number
          step_name: string
          updated_at?: string
          wait_time_hours?: number
        }
        Update: {
          created_at?: string
          id?: string
          impact_level?: string
          is_active?: boolean
          process_id?: string
          sort_order?: number
          step_name?: string
          updated_at?: string
          wait_time_hours?: number
        }
        Relationships: [
          {
            foreignKeyName: "process_bottlenecks_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "business_processes"
            referencedColumns: ["id"]
          },
        ]
      }
      process_inefficiencies: {
        Row: {
          affected_steps: Json
          created_at: string
          description: string
          id: string
          is_active: boolean
          process_id: string
          severity_level: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          affected_steps?: Json
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          process_id: string
          severity_level: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          affected_steps?: Json
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          process_id?: string
          severity_level?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "process_inefficiencies_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "business_processes"
            referencedColumns: ["id"]
          },
        ]
      }
      process_optimization_metrics: {
        Row: {
          created_at: string
          id: string
          potential_savings: string
          process_id: string
          quality_improvement: string
          time_reduction: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          potential_savings: string
          process_id: string
          quality_improvement: string
          time_reduction: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          potential_savings?: string
          process_id?: string
          quality_improvement?: string
          time_reduction?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "process_optimization_metrics_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: true
            referencedRelation: "business_processes"
            referencedColumns: ["id"]
          },
        ]
      }
      process_recommendations: {
        Row: {
          benefits: Json
          complexity_level: string
          created_at: string
          description: string
          id: string
          impact_level: string
          is_active: boolean
          process_id: string
          risks: Json
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          benefits?: Json
          complexity_level: string
          created_at?: string
          description: string
          id?: string
          impact_level: string
          is_active?: boolean
          process_id: string
          risks?: Json
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          benefits?: Json
          complexity_level?: string
          created_at?: string
          description?: string
          id?: string
          impact_level?: string
          is_active?: boolean
          process_id?: string
          risks?: Json
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "process_recommendations_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "business_processes"
            referencedColumns: ["id"]
          },
        ]
      }
      process_statistics: {
        Row: {
          automation_rate: number
          avg_duration: string
          created_at: string
          error_rate: number
          frequency: string
          id: string
          process_id: string
          updated_at: string
        }
        Insert: {
          automation_rate?: number
          avg_duration: string
          created_at?: string
          error_rate?: number
          frequency: string
          id?: string
          process_id: string
          updated_at?: string
        }
        Update: {
          automation_rate?: number
          avg_duration?: string
          created_at?: string
          error_rate?: number
          frequency?: string
          id?: string
          process_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "process_statistics_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: true
            referencedRelation: "business_processes"
            referencedColumns: ["id"]
          },
        ]
      }
      process_step_durations: {
        Row: {
          created_at: string
          duration_hours: number
          id: string
          is_active: boolean
          process_id: string
          sort_order: number
          step_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration_hours?: number
          id?: string
          is_active?: boolean
          process_id: string
          sort_order?: number
          step_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration_hours?: number
          id?: string
          is_active?: boolean
          process_id?: string
          sort_order?: number
          step_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "process_step_durations_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "business_processes"
            referencedColumns: ["id"]
          },
        ]
      }
      process_steps: {
        Row: {
          color_class: string | null
          created_at: string
          department: string | null
          description: string | null
          icon_name: string | null
          id: string
          is_active: boolean
          name: string
          process_id: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          color_class?: string | null
          created_at?: string
          department?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean
          name: string
          process_id: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          color_class?: string | null
          created_at?: string
          department?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean
          name?: string
          process_id?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "process_steps_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "business_processes"
            referencedColumns: ["id"]
          },
        ]
      }
      process_variants: {
        Row: {
          created_at: string
          description: string | null
          frequency_percentage: number
          id: string
          is_active: boolean
          name: string
          process_id: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          frequency_percentage?: number
          id?: string
          is_active?: boolean
          name: string
          process_id: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          frequency_percentage?: number
          id?: string
          is_active?: boolean
          name?: string
          process_id?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "process_variants_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "business_processes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          app_role: Database["public"]["Enums"]["app_role"]
          company: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          job_title: string | null
          organization_id: string | null
          phone: string | null
          status: string
          tier: string
          updated_at: string | null
        }
        Insert: {
          app_role?: Database["public"]["Enums"]["app_role"]
          company?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          job_title?: string | null
          organization_id?: string | null
          phone?: string | null
          status?: string
          tier?: string
          updated_at?: string | null
        }
        Update: {
          app_role?: Database["public"]["Enums"]["app_role"]
          company?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          job_title?: string | null
          organization_id?: string | null
          phone?: string | null
          status?: string
          tier?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limit_attempts: {
        Row: {
          action: string
          created_at: string | null
          id: string
          identifier: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          identifier: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          identifier?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      roles: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      security_alerts: {
        Row: {
          alert_type: string
          created_at: string
          description: string
          evidence: Json
          id: string
          recommended_actions: string[]
          resolved: boolean
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string
          description: string
          evidence?: Json
          id?: string
          recommended_actions?: string[]
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string
          description?: string
          evidence?: Json
          id?: string
          recommended_actions?: string[]
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          action: string
          audit_level: string | null
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown
          masked_data: Json | null
          pii_detected: boolean | null
          pii_types: string[] | null
          resource_id: string | null
          resource_type: string
          risk_score: number | null
          session_id: string | null
          success: boolean
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          audit_level?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown
          masked_data?: Json | null
          pii_detected?: boolean | null
          pii_types?: string[] | null
          resource_id?: string | null
          resource_type: string
          risk_score?: number | null
          session_id?: string | null
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          audit_level?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown
          masked_data?: Json | null
          pii_detected?: boolean | null
          pii_types?: string[] | null
          resource_id?: string | null
          resource_type?: string
          risk_score?: number | null
          session_id?: string | null
          success?: boolean
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_event_log: {
        Row: {
          action: string
          actor_user_id: string | null
          details: Json
          id: number
          ip_address: string | null
          occurred_at: string
          success: boolean
          target_user_id: string | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          details?: Json
          id?: never
          ip_address?: string | null
          occurred_at?: string
          success?: boolean
          target_user_id?: string | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          details?: Json
          id?: never
          ip_address?: string | null
          occurred_at?: string
          success?: boolean
          target_user_id?: string | null
        }
        Relationships: []
      }
      shared_analyses: {
        Row: {
          analysis_data: Json
          analysis_type: string
          created_at: string
          created_by: string
          description: string | null
          id: string
          insights: string | null
          is_public: boolean
          last_viewed_at: string | null
          original_analysis_id: string | null
          shared_permissions: Json
          sql_config_id: string
          status: string
          tags: string[]
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          analysis_data?: Json
          analysis_type?: string
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          insights?: string | null
          is_public?: boolean
          last_viewed_at?: string | null
          original_analysis_id?: string | null
          shared_permissions?: Json
          sql_config_id: string
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          analysis_data?: Json
          analysis_type?: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          insights?: string | null
          is_public?: boolean
          last_viewed_at?: string | null
          original_analysis_id?: string | null
          shared_permissions?: Json
          sql_config_id?: string
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      sql_execution_logs: {
        Row: {
          error_message: string | null
          executed_at: string | null
          execution_status: string
          execution_time_ms: number | null
          id: string
          mapping_id: string | null
          rows_affected: number | null
        }
        Insert: {
          error_message?: string | null
          executed_at?: string | null
          execution_status: string
          execution_time_ms?: number | null
          id?: string
          mapping_id?: string | null
          rows_affected?: number | null
        }
        Update: {
          error_message?: string | null
          executed_at?: string | null
          execution_status?: string
          execution_time_ms?: number | null
          id?: string
          mapping_id?: string | null
          rows_affected?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sql_execution_logs_mapping_id_fkey"
            columns: ["mapping_id"]
            isOneToOne: false
            referencedRelation: "sql_query_mappings"
            referencedColumns: ["id"]
          },
        ]
      }
      sql_query_mappings: {
        Row: {
          connection_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          last_executed_at: string | null
          metric_id: string | null
          refresh_frequency_minutes: number | null
          sql_query: string
          updated_at: string | null
          value_column: string
        }
        Insert: {
          connection_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_executed_at?: string | null
          metric_id?: string | null
          refresh_frequency_minutes?: number | null
          sql_query: string
          updated_at?: string | null
          value_column: string
        }
        Update: {
          connection_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_executed_at?: string | null
          metric_id?: string | null
          refresh_frequency_minutes?: number | null
          sql_query?: string
          updated_at?: string | null
          value_column?: string
        }
        Relationships: [
          {
            foreignKeyName: "sql_query_mappings_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "azure_sql_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sql_query_mappings_metric_id_fkey"
            columns: ["metric_id"]
            isOneToOne: false
            referencedRelation: "metric_base"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_initiative_dependencies: {
        Row: {
          created_at: string
          dependency_type: string
          depends_on_initiative_id: string
          id: string
          initiative_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dependency_type?: string
          depends_on_initiative_id: string
          id?: string
          initiative_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dependency_type?: string
          depends_on_initiative_id?: string
          id?: string
          initiative_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategic_initiative_dependencies_depends_on_initiative_id_fkey"
            columns: ["depends_on_initiative_id"]
            isOneToOne: false
            referencedRelation: "initiative_health_scores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategic_initiative_dependencies_depends_on_initiative_id_fkey"
            columns: ["depends_on_initiative_id"]
            isOneToOne: false
            referencedRelation: "strategic_initiatives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategic_initiative_dependencies_initiative_id_fkey"
            columns: ["initiative_id"]
            isOneToOne: false
            referencedRelation: "initiative_health_scores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategic_initiative_dependencies_initiative_id_fkey"
            columns: ["initiative_id"]
            isOneToOne: false
            referencedRelation: "strategic_initiatives"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_initiative_milestones: {
        Row: {
          actual_duration_days: number | null
          completion_date: string | null
          completion_percentage: number | null
          created_at: string
          deliverables: Json | null
          estimated_duration_days: number | null
          id: string
          initiative_id: string
          is_critical_path: boolean | null
          milestone_name: string
          milestone_weight: number | null
          status: string
          target_date: string | null
          updated_at: string
        }
        Insert: {
          actual_duration_days?: number | null
          completion_date?: string | null
          completion_percentage?: number | null
          created_at?: string
          deliverables?: Json | null
          estimated_duration_days?: number | null
          id?: string
          initiative_id: string
          is_critical_path?: boolean | null
          milestone_name: string
          milestone_weight?: number | null
          status?: string
          target_date?: string | null
          updated_at?: string
        }
        Update: {
          actual_duration_days?: number | null
          completion_date?: string | null
          completion_percentage?: number | null
          created_at?: string
          deliverables?: Json | null
          estimated_duration_days?: number | null
          id?: string
          initiative_id?: string
          is_critical_path?: boolean | null
          milestone_name?: string
          milestone_weight?: number | null
          status?: string
          target_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_milestones_initiative"
            columns: ["initiative_id"]
            isOneToOne: false
            referencedRelation: "initiative_health_scores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_milestones_initiative"
            columns: ["initiative_id"]
            isOneToOne: false
            referencedRelation: "strategic_initiatives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategic_initiative_milestones_initiative_id_fkey"
            columns: ["initiative_id"]
            isOneToOne: false
            referencedRelation: "initiative_health_scores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategic_initiative_milestones_initiative_id_fkey"
            columns: ["initiative_id"]
            isOneToOne: false
            referencedRelation: "strategic_initiatives"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_initiatives: {
        Row: {
          actual_effort_hours: number | null
          budget_allocated: number | null
          budget_utilized: number | null
          completion_date: string | null
          created_at: string
          description: string | null
          estimated_effort_hours: number | null
          id: string
          is_active: boolean
          name: string
          notes: string | null
          objective_id: string
          owner: string | null
          priority: string
          progress_percentage: number
          risk_level: string | null
          sort_order: number | null
          start_date: string | null
          status: string
          success_criteria: string | null
          target_date: string | null
          updated_at: string
        }
        Insert: {
          actual_effort_hours?: number | null
          budget_allocated?: number | null
          budget_utilized?: number | null
          completion_date?: string | null
          created_at?: string
          description?: string | null
          estimated_effort_hours?: number | null
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          objective_id: string
          owner?: string | null
          priority?: string
          progress_percentage?: number
          risk_level?: string | null
          sort_order?: number | null
          start_date?: string | null
          status?: string
          success_criteria?: string | null
          target_date?: string | null
          updated_at?: string
        }
        Update: {
          actual_effort_hours?: number | null
          budget_allocated?: number | null
          budget_utilized?: number | null
          completion_date?: string | null
          created_at?: string
          description?: string | null
          estimated_effort_hours?: number | null
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          objective_id?: string
          owner?: string | null
          priority?: string
          progress_percentage?: number
          risk_level?: string | null
          sort_order?: number | null
          start_date?: string | null
          status?: string
          success_criteria?: string | null
          target_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategic_initiatives_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "strategic_objectives"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_milestone_dependencies: {
        Row: {
          created_at: string
          dependency_type: string
          depends_on_milestone_id: string
          id: string
          lag_days: number | null
          milestone_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dependency_type?: string
          depends_on_milestone_id: string
          id?: string
          lag_days?: number | null
          milestone_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dependency_type?: string
          depends_on_milestone_id?: string
          id?: string
          lag_days?: number | null
          milestone_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategic_milestone_dependencies_depends_on_milestone_id_fkey"
            columns: ["depends_on_milestone_id"]
            isOneToOne: false
            referencedRelation: "strategic_initiative_milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategic_milestone_dependencies_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "strategic_initiative_milestones"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_objective_health: {
        Row: {
          created_at: string
          health_score: number
          id: string
          notes: string | null
          objective_id: string
          period_end: string
          period_start: string
          rag_status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          health_score: number
          id?: string
          notes?: string | null
          objective_id: string
          period_end: string
          period_start: string
          rag_status: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          health_score?: number
          id?: string
          notes?: string | null
          objective_id?: string
          period_end?: string
          period_start?: string
          rag_status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategic_objective_health_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "strategic_objectives"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_objective_health_periods: {
        Row: {
          created_at: string | null
          health_score: number
          id: string
          notes: string | null
          objective_id: string
          period_type: string
          rag_status: string
          updated_at: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          health_score?: number
          id?: string
          notes?: string | null
          objective_id: string
          period_type: string
          rag_status?: string
          updated_at?: string | null
          year?: number
        }
        Update: {
          created_at?: string | null
          health_score?: number
          id?: string
          notes?: string | null
          objective_id?: string
          period_type?: string
          rag_status?: string
          updated_at?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "strategic_objective_health_periods_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "strategic_objectives"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_objective_kpis: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean
          kpi_id: string
          objective_id: string
          weight: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean
          kpi_id: string
          objective_id: string
          weight?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean
          kpi_id?: string
          objective_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "strategic_objective_kpis_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "cockpit_kpis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategic_objective_kpis_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "strategic_objectives"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_objective_processes: {
        Row: {
          created_at: string
          id: string
          objective_id: string
          process_id: string
          relevance_score: number
        }
        Insert: {
          created_at?: string
          id?: string
          objective_id: string
          process_id: string
          relevance_score?: number
        }
        Update: {
          created_at?: string
          id?: string
          objective_id?: string
          process_id?: string
          relevance_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "strategic_objective_processes_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "strategic_objectives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategic_objective_processes_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "business_processes"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_objectives: {
        Row: {
          created_at: string
          description: string | null
          display_name: string
          id: string
          is_active: boolean
          name: string
          owner: string | null
          perspective: string
          sort_order: number
          target_description: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name: string
          id?: string
          is_active?: boolean
          name: string
          owner?: string | null
          perspective: string
          sort_order?: number
          target_description?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string
          id?: string
          is_active?: boolean
          name?: string
          owner?: string | null
          perspective?: string
          sort_order?: number
          target_description?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      strategic_resource_allocations: {
        Row: {
          allocated_amount: number
          created_at: string
          efficiency_percentage: number | null
          hourly_rate: number | null
          id: string
          initiative_id: string
          notes: string | null
          period_end: string
          period_start: string
          period_type: string | null
          resource_category: string | null
          resource_type: string
          unit: string
          updated_at: string
          utilized_amount: number
        }
        Insert: {
          allocated_amount?: number
          created_at?: string
          efficiency_percentage?: number | null
          hourly_rate?: number | null
          id?: string
          initiative_id: string
          notes?: string | null
          period_end: string
          period_start: string
          period_type?: string | null
          resource_category?: string | null
          resource_type: string
          unit: string
          updated_at?: string
          utilized_amount?: number
        }
        Update: {
          allocated_amount?: number
          created_at?: string
          efficiency_percentage?: number | null
          hourly_rate?: number | null
          id?: string
          initiative_id?: string
          notes?: string | null
          period_end?: string
          period_start?: string
          period_type?: string | null
          resource_category?: string | null
          resource_type?: string
          unit?: string
          updated_at?: string
          utilized_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_resources_initiative"
            columns: ["initiative_id"]
            isOneToOne: false
            referencedRelation: "initiative_health_scores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_resources_initiative"
            columns: ["initiative_id"]
            isOneToOne: false
            referencedRelation: "strategic_initiatives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategic_resource_allocations_initiative_id_fkey"
            columns: ["initiative_id"]
            isOneToOne: false
            referencedRelation: "initiative_health_scores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategic_resource_allocations_initiative_id_fkey"
            columns: ["initiative_id"]
            isOneToOne: false
            referencedRelation: "strategic_initiatives"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_risks_opportunities: {
        Row: {
          created_at: string
          description: string
          id: string
          identified_date: string
          impact_level: string
          is_active: boolean
          mitigation_actions: string | null
          objective_id: string | null
          owner: string | null
          probability: string
          review_date: string | null
          status: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          identified_date?: string
          impact_level: string
          is_active?: boolean
          mitigation_actions?: string | null
          objective_id?: string | null
          owner?: string | null
          probability: string
          review_date?: string | null
          status?: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          identified_date?: string
          impact_level?: string
          is_active?: boolean
          mitigation_actions?: string | null
          objective_id?: string | null
          owner?: string | null
          probability?: string
          review_date?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategic_risks_opportunities_objective_id_fkey"
            columns: ["objective_id"]
            isOneToOne: false
            referencedRelation: "strategic_objectives"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_scenario_comparisons: {
        Row: {
          analysis_results: Json | null
          comparison_metrics: Json
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          scenario_ids: Json
          updated_at: string | null
        }
        Insert: {
          analysis_results?: Json | null
          comparison_metrics?: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          scenario_ids?: Json
          updated_at?: string | null
        }
        Update: {
          analysis_results?: Json | null
          comparison_metrics?: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          scenario_ids?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      strategic_scenario_impact_categories: {
        Row: {
          color_class: string | null
          created_at: string | null
          description: string | null
          display_name: string
          icon_name: string | null
          id: string
          is_active: boolean | null
          name: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          color_class?: string | null
          created_at?: string | null
          description?: string | null
          display_name: string
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          color_class?: string | null
          created_at?: string | null
          description?: string | null
          display_name?: string
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      strategic_scenario_outcomes: {
        Row: {
          baseline_value: string | null
          calculation_method: string | null
          confidence_score: number | null
          created_at: string
          id: string
          impact_category_id: string | null
          metric_name: string
          notes: string | null
          scenario_id: string
          time_frame_months: number | null
          updated_at: string
          value_change: string
        }
        Insert: {
          baseline_value?: string | null
          calculation_method?: string | null
          confidence_score?: number | null
          created_at?: string
          id?: string
          impact_category_id?: string | null
          metric_name: string
          notes?: string | null
          scenario_id: string
          time_frame_months?: number | null
          updated_at?: string
          value_change: string
        }
        Update: {
          baseline_value?: string | null
          calculation_method?: string | null
          confidence_score?: number | null
          created_at?: string
          id?: string
          impact_category_id?: string | null
          metric_name?: string
          notes?: string | null
          scenario_id?: string
          time_frame_months?: number | null
          updated_at?: string
          value_change?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategic_scenario_outcomes_impact_category_id_fkey"
            columns: ["impact_category_id"]
            isOneToOne: false
            referencedRelation: "strategic_scenario_impact_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategic_scenario_outcomes_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "strategic_scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_scenario_parameters: {
        Row: {
          base_value: string
          created_at: string | null
          description: string | null
          id: string
          max_value: string | null
          min_value: string | null
          parameter_name: string
          parameter_type: string
          scenario_id: string
          sensitivity_weight: number | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          base_value: string
          created_at?: string | null
          description?: string | null
          id?: string
          max_value?: string | null
          min_value?: string | null
          parameter_name: string
          parameter_type?: string
          scenario_id: string
          sensitivity_weight?: number | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          base_value?: string
          created_at?: string | null
          description?: string | null
          id?: string
          max_value?: string | null
          min_value?: string | null
          parameter_name?: string
          parameter_type?: string
          scenario_id?: string
          sensitivity_weight?: number | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "strategic_scenario_parameters_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "strategic_scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_scenarios: {
        Row: {
          assumptions: string | null
          confidence_level: number | null
          created_at: string
          created_by: string | null
          description: string | null
          external_factors: Json | null
          id: string
          impact_assessment: Json | null
          is_active: boolean
          last_reviewed_at: string | null
          name: string
          probability: number
          review_frequency_months: number | null
          scenario_type: string
          time_horizon_months: number | null
          updated_at: string
        }
        Insert: {
          assumptions?: string | null
          confidence_level?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          external_factors?: Json | null
          id?: string
          impact_assessment?: Json | null
          is_active?: boolean
          last_reviewed_at?: string | null
          name: string
          probability?: number
          review_frequency_months?: number | null
          scenario_type?: string
          time_horizon_months?: number | null
          updated_at?: string
        }
        Update: {
          assumptions?: string | null
          confidence_level?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          external_factors?: Json | null
          id?: string
          impact_assessment?: Json | null
          is_active?: boolean
          last_reviewed_at?: string | null
          name?: string
          probability?: number
          review_frequency_months?: number | null
          scenario_type?: string
          time_horizon_months?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      tenant_instances: {
        Row: {
          brand_config: Json | null
          contact_email: string
          contact_name: string | null
          created_at: string | null
          custom_domain: string | null
          feature_flags: string[] | null
          id: string
          last_accessed: string | null
          max_users: number
          organization_name: string
          provisioned_at: string | null
          slug: string
          status: string
          supabase_anon_key: string
          supabase_project_id: string
          supabase_url: string
          tier: string
          updated_at: string | null
        }
        Insert: {
          brand_config?: Json | null
          contact_email: string
          contact_name?: string | null
          created_at?: string | null
          custom_domain?: string | null
          feature_flags?: string[] | null
          id?: string
          last_accessed?: string | null
          max_users?: number
          organization_name: string
          provisioned_at?: string | null
          slug: string
          status?: string
          supabase_anon_key: string
          supabase_project_id: string
          supabase_url: string
          tier: string
          updated_at?: string | null
        }
        Update: {
          brand_config?: Json | null
          contact_email?: string
          contact_name?: string | null
          created_at?: string | null
          custom_domain?: string | null
          feature_flags?: string[] | null
          id?: string
          last_accessed?: string | null
          max_users?: number
          organization_name?: string
          provisioned_at?: string | null
          slug?: string
          status?: string
          supabase_anon_key?: string
          supabase_project_id?: string
          supabase_url?: string
          tier?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          id: string
          preferences: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          preferences?: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          preferences?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          created_at: string
          device_fingerprint: string | null
          expires_at: string
          id: string
          ip_address: unknown
          is_active: boolean
          last_activity: string
          location_data: Json | null
          session_token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_fingerprint?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown
          is_active?: boolean
          last_activity?: string
          location_data?: Json | null
          session_token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_fingerprint?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown
          is_active?: boolean
          last_activity?: string
          location_data?: Json | null
          session_token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      initiative_health_scores: {
        Row: {
          health_score: number | null
          id: string | null
          milestone_progress_percentage: number | null
          name: string | null
          overdue_milestones: number | null
          progress_percentage: number | null
          resource_utilization_percentage: number | null
          status: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      automated_security_response: { Args: never; Returns: undefined }
      bootstrap_first_admin: {
        Args: { target_email: string }
        Returns: boolean
      }
      calculate_trend_percentage: {
        Args: { current_val: number; previous_val: number }
        Returns: number
      }
      cleanup_rate_limit_attempts: { Args: never; Returns: undefined }
      decrypt_api_key: { Args: { encrypted_key: string }; Returns: string }
      detect_security_threats: {
        Args: never
        Returns: {
          details: Json
          last_activity: string
          threat_score: number
          threat_type: string
          user_id: string
        }[]
      }
      encrypt_api_key: { Args: { api_key: string }; Returns: string }
      encrypt_sensitive_data: {
        Args: { data_text: string; encryption_key?: string }
        Returns: string
      }
      generate_security_report: {
        Args: { end_date?: string; start_date?: string }
        Returns: Json
      }
      get_encrypted_api_key_secure: {
        Args: { p_key_name: string }
        Returns: string
      }
      get_home_cockpit_aggregates: {
        Args: never
        Returns: {
          active_kpis: number
          avg_health_score: number
          cockpit_name: string
          cockpit_type_id: string
          color: string
          display_name: string
          health_status: string
          icon: string
          last_updated: string
          performance_percentage: number
          total_kpis: number
        }[]
      }
      get_initiative_health_scores: {
        Args: never
        Returns: {
          health_score: number
          id: string
          milestone_progress_percentage: number
          name: string
          overdue_milestones: number
          progress_percentage: number
          resource_utilization_percentage: number
          status: string
        }[]
      }
      get_security_dashboard_metrics: {
        Args: never
        Returns: {
          action: string
          event_count: number
          hour: string
          resource_type: string
          success: boolean
          success_rate: number
          unique_users: number
        }[]
      }
      get_user_approval_status_secure: {
        Args: { p_user_id?: string }
        Returns: Json
      }
      get_user_organization: { Args: never; Returns: string }
      get_user_tier: { Args: { user_id: string }; Returns: string }
      handle_bootstrap_admin_assignment: {
        Args: { user_email: string }
        Returns: boolean
      }
      has_tier_access: {
        Args: { required_tier: string; user_id: string }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_admin_secure: { Args: never; Returns: boolean }
      is_app_admin: { Args: never; Returns: boolean }
      is_approved_user: { Args: never; Returns: boolean }
      is_approved_user_secure: { Args: never; Returns: boolean }
      is_first_admin: { Args: never; Returns: boolean }
      is_manager_or_admin: { Args: never; Returns: boolean }
      is_manager_or_admin_secure: { Args: never; Returns: boolean }
      is_organization_admin: { Args: { org_id?: string }; Returns: boolean }
      is_user_admin: { Args: never; Returns: boolean }
      log_security_event: {
        Args: {
          p_action: string
          p_details?: Json
          p_resource_id?: string
          p_resource_type: string
          p_success?: boolean
        }
        Returns: undefined
      }
      log_security_event_enhanced: {
        Args: {
          p_action: string
          p_details?: Json
          p_resource_id?: string
          p_resource_type: string
          p_severity?: string
          p_success?: boolean
        }
        Returns: undefined
      }
      log_security_event_organization: {
        Args: {
          p_action: string
          p_details?: Json
          p_resource_id?: string
          p_resource_type: string
          p_severity?: string
          p_success?: boolean
        }
        Returns: undefined
      }
      needs_bootstrap_admin: { Args: never; Returns: boolean }
      replace_time_based_metric_data: {
        Args: { p_data_points: Json; p_time_metric_id: string }
        Returns: Json
      }
      secure_assign_admin_role: {
        Args: { target_email: string }
        Returns: boolean
      }
      test_function: { Args: never; Returns: string }
      update_encrypted_api_key_secure: {
        Args: {
          p_created_by: string
          p_encrypted_value: string
          p_key_name: string
        }
        Returns: boolean
      }
      validate_password_complexity: {
        Args: { password: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["user", "admin"],
    },
  },
} as const
