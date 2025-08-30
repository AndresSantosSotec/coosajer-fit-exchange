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
      } catch (e: any) {
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
    <section id="products-section" className="py-8">
      <div className="container px-4">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary">Productos disponibles</h2>
          <div className="text-sm text-muted-foreground">
            {loading
              ? 'Cargando...'
              : `${filteredProducts.length} producto${filteredProducts.length !== 1 ? 's' : ''} encontrado${filteredProducts.length !== 1 ? 's' : ''}`}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Grid */}
        {!loading && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : !loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <Search className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-secondary">No se encontraron productos</h3>
            <p className="text-muted-foreground max-w-md">
              Intenta ajustar los filtros o buscar con términos diferentes para encontrar lo que necesitas.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  )
}
