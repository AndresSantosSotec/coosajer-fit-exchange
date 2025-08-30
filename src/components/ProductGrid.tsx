import { useStore, Product } from '@/contexts/StoreContext';
import { ProductCard } from './ProductCard';
import { Search } from 'lucide-react';

export function ProductGrid() {
  const { state } = useStore();
  const { products, filters } = state;

  // Filter products based on current filters
  const filteredProducts = products.filter((product: Product) => {
    // Search filter
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !product.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    // Price range filter
    if (product.fitcoins < filters.minPrice || product.fitcoins > filters.maxPrice) {
      return false;
    }

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false;
    }

    // Size filter
    if (filters.sizes.length > 0 && product.size && !filters.sizes.includes(product.size)) {
      return false;
    }

    // Brand filter
    if (filters.brand && product.brand !== filters.brand) {
      return false;
    }

    return true;
  });

  return (
    <section id="products-section" className="py-8">
      <div className="container px-4">
        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary">
            Productos disponibles
          </h2>
          <div className="text-sm text-muted-foreground">
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Product grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <Search className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-secondary">
              No se encontraron productos
            </h3>
            <p className="text-muted-foreground max-w-md">
              Intenta ajustar los filtros o buscar con términos diferentes para encontrar 
              lo que necesitas.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}