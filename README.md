# Tally - Inventory Management System

A comprehensive inventory management application built for modern businesses to track materials, products, orders, and fulfillments with an intuitive interface and powerful automation features.

<p align="center">
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#core-features"><strong>Features</strong></a> ·
  <a href="#architecture"><strong>Architecture</strong></a> ·
  <a href="#setup"><strong>Setup</strong></a> ·
  <a href="#database-schema"><strong>Database</strong></a>
</p>

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router for server-side rendering and routing
- **TypeScript** - Type safety and enhanced developer experience
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **shadcn/ui** - Modern component library built on Radix UI primitives
- **Lucide React** - Beautiful, customizable SVG icons

### Backend & Database
- **Supabase** - PostgreSQL database with real-time capabilities
- **Row Level Security (RLS)** - Database-level security for multi-tenant architecture
- **Database Triggers** - Automatic timestamp updates and data consistency
- **PostgreSQL Functions** - Custom database logic for complex operations

### Authentication & Security
- **Supabase Auth** - Email/password authentication with session management
- **Cookie-based Sessions** - Secure session handling across server/client components
- **Protected Routes** - Route-level authentication guards
- **User Metadata** - Extended user profiles with first/last name

### Development & Deployment
- **React Server Components** - Optimized rendering with server/client component architecture
- **Optimistic UI Updates** - Immediate feedback for better user experience
- **Component Architecture** - Modular, reusable components with clear separation of concerns
- **Type-safe Database Queries** - TypeScript interfaces for all database operations

## Core Features

### Materials Management
- **Inventory Tracking** - Real-time current and needed inventory levels
- **Material Profiles** - Comprehensive material data including suppliers, costs, and images
- **Smart Suggestions** - Automated ordering suggestions based on inventory levels
- **Bulk Operations** - Efficient add/subtract inventory actions

### Products Catalog
- **Product Creation** - Link products to materials for automatic inventory calculations
- **Image Management** - Product images with fallback to material images
- **Category Organization** - Flexible categorization and filtering system
- **Price Management** - Dynamic pricing with currency formatting

### Order Management
- **Purchase Orders** - Track material orders from suppliers
- **Status Workflow** - Complete order lifecycle from ordered to delivered
- **Automatic Calculations** - Auto-populate pricing and delivery estimates
- **Supplier Integration** - Manage multiple supplier relationships

### Fulfillment System
- **Customer Orders** - Process external orders for products
- **Inventory Integration** - Automatic material need calculations
- **Status Tracking** - Real-time order status updates
- **Customer Management** - Track orders by customer email

### Advanced Filtering & Search
- **Multi-criteria Filtering** - Filter by status, supplier, customer, category
- **Real-time Search** - Instant search across all entity types
- **Saved Filter States** - Persistent filter preferences
- **Click-outside Handling** - Intuitive UX for filter panels

## Architecture

### Component Structure
```
components/
├── ui/                 # shadcn/ui base components
├── materials/          # Materials management components
├── products/           # Products catalog components
├── fulfillments/       # Order fulfillment components
├── sidebar/            # Navigation and layout
└── account/           # User profile management
```

### Database Design
- **Multi-tenant Architecture** - User-scoped data with RLS policies
- **Relational Integrity** - Foreign key constraints and cascade deletes
- **Optimized Queries** - Indexed columns for performance
- **Audit Trail** - Created/updated timestamps on all entities

### State Management
- **Server State** - Supabase real-time subscriptions
- **Client State** - React hooks for UI state
- **Optimistic Updates** - Immediate UI feedback with server sync
- **Error Boundaries** - Graceful error handling and recovery

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tally-inventory-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Rename `.env.example` to `.env.local`
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run database migrations**
   ```bash
   # Execute the SQL files in supabase/migrations/ in order
   # Or use Supabase CLI for automated migration
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## Database Schema

### Core Tables
- **materials** - Raw materials with inventory tracking
- **products** - Finished goods linked to materials  
- **orders** - Purchase orders for materials
- **fulfillments** - Customer orders for products

### Key Features
- **Row Level Security** - User isolation and data security
- **Foreign Key Relationships** - Data integrity and referential consistency
- **Automated Triggers** - Timestamp updates and inventory calculations
- **Indexed Queries** - Optimized performance for common operations

### Sample Queries
```sql
-- Get materials with low inventory
SELECT * FROM materials 
WHERE current_inventory < needed_inventory 
AND user_id = auth.uid();

-- Get fulfillments with product details
SELECT f.*, p.name as product_name 
FROM fulfillments f
JOIN products p ON f.product_id = p.id
WHERE f.user_id = auth.uid();
```

## Key Innovations

1. **Intelligent Inventory Management** - Automatic material need calculations based on product fulfillments
2. **Unified Search Experience** - Consistent filtering patterns across all entity types  
3. **Progressive Enhancement** - Works with JavaScript disabled, enhanced with interactivity
4. **Type-safe Database Layer** - End-to-end type safety from database to UI
5. **Real-time Updates** - Live data synchronization across browser tabs
6. **Optimistic UI Pattern** - Immediate feedback with graceful error handling
