// services/premios.ts
import api from '@/services/api'

export type PremioAPI = {
  id: number
  nombre: string
  descripcion: string | null
  costo_fitcoins: number
  stock: number
  image_url: string | null
}
export type Paginated<T> = { data: T[] }

export async function fetchPublicPremios(limit = 100) {
  const { data } = await api.get<Paginated<PremioAPI>>('/store/premios', { params: { limit } })
  return data.data
}
