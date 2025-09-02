import { Search, X } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const categories = ['Calzado', 'Ropa', 'Accesorios'];
const sizes = ['XS', 'S', 'M', 'L', 'XL'];
const brands = ['Nike', 'Adidas', 'Puma', 'Under Armour', 'Reebok'];

export function Filters() {
  const { state, dispatch } = useStore();
  const { filters } = state;

  const updateFilters = (updates: Partial<typeof filters>) => {
    dispatch({ type: 'SET_FILTERS', payload: updates });
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    updateFilters({ categories: newCategories });
  };

  const toggleSize = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size];
    updateFilters({ sizes: newSizes });
  };

  const clearAllFilters = () => {
    updateFilters({
      search: '',
      minPrice: 0,
      maxPrice: 10000,
      categories: [],
      sizes: [],
      brand: ''
    });
  };

  const hasActiveFilters = filters.search || filters.categories.length > 0 || 
    filters.sizes.length > 0 || filters.brand || filters.minPrice > 0 || filters.maxPrice < 10000;

  return (
    <div className="border-b border-brand-border bg-background p-4">
      <div className="container space-y-4">
        {/* Search and Price Range */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => updateFilters({ minPrice: Number(e.target.value) || 0 })}
              className="w-20"
            />
            <span className="flex items-center text-sm text-muted-foreground">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => updateFilters({ maxPrice: Number(e.target.value) || 10000 })}
              className="w-20"
            />
            <span className="flex items-center text-sm text-muted-foreground">FC</span>
          </div>
        </div>

        {/* Brand Select and Clear */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="space-y-2">

          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}