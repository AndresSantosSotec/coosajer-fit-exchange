// ProductGrid.tsx
import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import api from '@/services/api'               // <-- tu cliente axios
import { ProductCard } from './ProductCard'
import { useStore, Product as StoreProduct } from '@/contexts/StoreContext'

type PremioAPI = {
  id: number
  nombre: string
  descripcion: string | null
  costo_fitcoins: number
  stock: number
  is_active: boolean
  image_url: string | null
}

type Paginated<T> = {
  data: T[]
  // (Laravel paginate trae más campos, pero con data nos basta)
}

export function ProductGrid() {
  const { state } = useStore()
  const { filters } = state

  // Productos provenientes del endpoint público
  const [apiProducts, setApiProducts] = useState<StoreProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPremios = async () => {
      try {
        setLoading(true)
        setError(null)

        // Consulta pública SIN token
        const { data } = await api.get<Paginated<PremioAPI>>('/store/premios', {
          params: { limit: 100 }, // ajusta el límite a tu gusto
        })

        // Mapear PremioAPI -> Product (tu tipo del Store)
        const mapped: StoreProduct[] = (data?.data ?? []).map((p) => ({
          id: String(p.id),
          name: p.nombre,
          description: p.descripcion ?? '',
          fitcoins: p.costo_fitcoins,
          category: 'Premios', // o vacío si tu filtro lo requiere
          image: p.image_url ?? '',
          size: undefined,
          brand: undefined,
        }))

        setApiProducts(mapped)
      } catch (e: unknown) {
        console.error(e)
        setError('No se pudieron cargar los premios.')
      } finally {
        setLoading(false)
      }
    }

    fetchPremios()
  }, [])

  // Filtros existentes (reutilizamos tu lógica tal cual)
  const filteredProducts = useMemo(() => {
    return apiProducts.filter((product: StoreProduct) => {
      // Search filter
      if (
        filters.search &&
        !product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !product.description.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false
      }

      // Price (fitcoins) range filter
      if (product.fitcoins < filters.minPrice || product.fitcoins > filters.maxPrice) {
        return false
      }

      // Category filter (si usas category = 'Premios', considera esto)
      if (filters.categories.length > 0 && product.category && !filters.categories.includes(product.category)) {
        return false
      }

      // Size filter
      if (filters.sizes.length > 0 && product.size && !filters.sizes.includes(product.size)) {
        return false
      }

      // Brand filter
      if (filters.brand && product.brand && product.brand !== filters.brand) {
        return false
      }

      return true
    })
  }, [apiProducts, filters])

  return (
    <section id="products-section" className="py-12 bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4">
        {/* Enhanced header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary">Productos disponibles</h2>
            <p className="text-muted-foreground">Descubre todos los premios que puedes obtener</p>
          </div>
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                <span className="text-sm font-medium">Cargando productos...</span>
              </div>
            ) : (
              <div className="bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20">
                <span className="text-sm font-semibold">
                  {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} disponible{filteredProducts.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Error state with better styling */}
        {error && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-destructive/20 rounded-full flex items-center justify-center">
                <Search className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-destructive">Error al cargar productos</h3>
                <p className="text-sm text-destructive/80">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced grid with better spacing */}
        {!loading && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="animate-fade-in"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'both'
                }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : !loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-muted/30 rounded-3xl border border-muted">
            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="space-y-2 max-w-md">
              <h3 className="text-2xl font-bold text-secondary">No se encontraron productos</h3>
              <p className="text-muted-foreground leading-relaxed">
                Intenta ajustar los filtros o buscar con términos diferentes para encontrar lo que necesitas.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
