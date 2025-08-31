import api from "@/services/api";

type CheckoutItem = { premio_id: number; cantidad: number };

export type CheckoutResponse = {
  message: string;
  total: number;
  balance: number;
  canjes: {
    id: number;
    premio_id: number;
    cantidad: number;
    costo_unitario_fitcoins: number;
    total_fitcoins: number;
    estado: string;
    agencia_retiro: string | null;
    observaciones: string | null;
    created_at: string;
  }[];
  receipt: {
    transaction_id: number;
    canje_ids: number[];
    datetime: string;
    user: { id: number; name: string; email: string };
    agency: string | null;
  };
};

export async function checkout(
  items: CheckoutItem[],
  agencia_retiro?: string,
  observaciones?: string
) {
  const { data } = await api.post('/app/checkout', {
    items,
    agencia_retiro,
    observaciones,
  });
  return data as CheckoutResponse;
}
