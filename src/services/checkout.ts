import api from "@/services/api";

type CheckoutItem = { premio_id: number; cantidad: number };

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
  return data as {
    message: string;
    ticket_code: string;
    total: number;
    balance: number;
    canjes: unknown[];
  };
}
