export type Database = {
  public: {
    Tables: {
      materials: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          image_url: string | null;
          current_inventory: number;
          needed_inventory: number;
          unit: string;
          category: string | null;
          unit_cost: number | null;
          supplier: string | null;
          sku: string | null;
          low_stock_threshold: number | null;
          status: 'active' | 'inactive' | 'discontinued';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          image_url?: string | null;
          current_inventory?: number;
          needed_inventory?: number;
          unit?: string;
          category?: string | null;
          unit_cost?: number | null;
          supplier?: string | null;
          sku?: string | null;
          low_stock_threshold?: number | null;
          status?: 'active' | 'inactive' | 'discontinued';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          image_url?: string | null;
          current_inventory?: number;
          needed_inventory?: number;
          unit?: string;
          category?: string | null;
          unit_cost?: number | null;
          supplier?: string | null;
          sku?: string | null;
          low_stock_threshold?: number | null;
          status?: 'active' | 'inactive' | 'discontinued';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Type aliases for easier use
export type Material = Database['public']['Tables']['materials']['Row'];
export type MaterialInsert = Database['public']['Tables']['materials']['Insert'];
export type MaterialUpdate = Database['public']['Tables']['materials']['Update'];