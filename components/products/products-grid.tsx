"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductsHeader } from "@/components/products/products-header";
import { ProductCard } from "@/components/products/product-card";
import { AddProductModal } from "@/components/products/add-product-modal";
import { Product, transformProductFromDb, transformProductForDb } from "@/lib/types/products";
import { createClient } from "@/lib/supabase/client";
import { ProductFormData } from "./add-product-form";

export function ProductsGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [materialFilter, setMaterialFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          materials(
            id,
            name,
            description,
            unit,
            category,
            supplier
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedProducts = data?.map((productData: any) => {
        return transformProductFromDb({
          ...productData,
          material_name: productData.materials?.name
        });
      }) || [];
      
      setProducts(transformedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handler functions
  const handleClearFilters = () => {
    setCategoryFilter("all");
    setMaterialFilter("all");
  };

  const handleAddNew = () => {
    setShowAddModal(true);
  };

  const handleAddProduct = async (productData: ProductFormData) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Transform the form data for database insertion
      const dbProduct = transformProductForDb({
        ...productData,
        userId: user.id
      });

      const { data, error } = await (supabase as any)
        .from('products')
        .insert([dbProduct])
        .select(`
          *,
          materials(
            id,
            name,
            description,
            unit,
            category,
            supplier
          )
        `)
        .single();

      if (error) throw error;

      // Transform back and add to local state
      const newProduct = transformProductFromDb({
        ...data,
        material_name: data.materials?.name
      });
      
      setProducts(prev => [newProduct, ...prev]);
    } catch (err) {
      console.error('Error creating product:', err);
      throw err; // Re-throw to let the modal handle the error
    }
  };

  const handleEdit = (id: string) => {
    console.log("Edit product:", id);
    // TODO: Implement edit product functionality
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remove from local state immediately for optimistic UI update
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      // Re-fetch products to ensure UI is in sync if deletion failed
      fetchProducts();
    }
  };

  // Get unique categories for filter dropdown
  const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[];

  // Get unique materials for filter dropdown
  const uniqueMaterials = Array.from(new Set(products.map(p => p.materialName).filter(Boolean))) as string[];

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.materialName && product.materialName.toLowerCase().includes(searchTerm.toLowerCase()))

    // Category filter
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesMaterial = materialFilter === "all" || product.materialName === materialFilter;

    return matchesSearch && matchesCategory && matchesMaterial;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <ProductsHeader
          searchTerm=""
          onSearchChange={() => {}}
          showFilters={false}
          onToggleFilters={() => {}}
          categoryFilter="all"
          onCategoryChange={() => {}}
          materialFilter="all"
          onMaterialChange={() => {}}
          categories={[]}
          materials={[]}
          onClearFilters={() => {}}
          onAddNew={() => {}}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="aspect-square bg-gray-200 animate-pulse"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading products: {error}</p>
        <Button onClick={fetchProducts} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProductsHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        materialFilter={materialFilter}
        onMaterialChange={setMaterialFilter}
        categories={uniqueCategories}
        materials={uniqueMaterials}
        onClearFilters={handleClearFilters}
        onAddNew={handleAddNew}
      />

      {/* Products Grid */}
      <div className="py-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            {products.length === 0 ? (
              <>
                <p className="text-gray-500 mb-4">No products found</p>
                <Button 
                  className="bg-brand-500 hover:bg-brand-600 text-white"
                  onClick={handleAddNew}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Product
                </Button>
              </>
            ) : (
              <>
                <p className="text-gray-500 mb-4">No products match your search</p>
                <Button 
                  onClick={() => setSearchTerm("")}
                  variant="outline"
                >
                  Clear Search
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddProduct}
      />
    </div>
  );
}