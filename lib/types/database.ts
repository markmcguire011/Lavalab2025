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
      orders: {
        Row: {
          id: string;
          user_id: string;
          material_id: string;
          order_number: string;
          quantity: number;
          unit_price: number | null;
          total_amount: number | null;
          supplier: string | null;
          supplier_order_id: string | null;
          expected_delivery_date: string | null;
          actual_delivery_date: string | null;
          status: 'ordered' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          material_id: string;
          order_number?: string;
          quantity: number;
          unit_price?: number | null;
          total_amount?: number | null;
          supplier?: string | null;
          supplier_order_id?: string | null;
          expected_delivery_date?: string | null;
          actual_delivery_date?: string | null;
          status?: 'ordered' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          material_id?: string;
          order_number?: string;
          quantity?: number;
          unit_price?: number | null;
          total_amount?: number | null;
          supplier?: string | null;
          supplier_order_id?: string | null;
          expected_delivery_date?: string | null;
          actual_delivery_date?: string | null;
          status?: 'ordered' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          category: string | null;
          price: number | null;
          image_url: string | null;
          material_id: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          category?: string | null;
          price?: number | null;
          image_url?: string | null;
          material_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          category?: string | null;
          price?: number | null;
          image_url?: string | null;
          material_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
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

export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
export type OrderUpdate = Database['public']['Tables']['orders']['Update'];

export type Product = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];