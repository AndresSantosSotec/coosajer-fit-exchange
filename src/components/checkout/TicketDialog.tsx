"use client";

import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { generatePdfFromNode } from '@/lib/generate-pdf';
import type { CheckoutResponse } from '@/services/checkout';

interface TicketData extends CheckoutResponse {
  items: {
    id: string;
    name: string;
    quantity: number;
    fitcoins: number;
  }[];
}

interface TicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: TicketData | null;
}

function formatDate(date?: string) {
  if (!date) return '-'
  try {
    return new Date(date).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return date
  }
}

function makeFilename(data: TicketData) {
  try {
    const datetime = data?.receipt?.datetime ?? new Date().toISOString()
    const d = new Date(datetime)
    const stamp = d
      .toISOString()
      .replace(/[-:]/g, '')
      .slice(0, 15)
      .replace('T', '-')

    const userId = data.receipt?.user?.id ?? 'anon'
    const tx = data.receipt?.transaction_id ?? 'tx'
    return `Ticket-${stamp}-${userId}-${tx}.pdf`
  } catch {
    return `Ticket-${Date.now()}.pdf`
  }
}

export default function TicketDialog({ open, onOpenChange, data }: TicketDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [didAutoDownload, setDidAutoDownload] = useState(false);

  useEffect(() => {
    if (open && data && data.receipt && contentRef.current && !didAutoDownload) {
      generatePdfFromNode(contentRef.current, makeFilename(data))
        .catch(() =>
          toast({
            title: 'No se pudo descargar el PDF automáticamente',
            variant: 'destructive',
          })
        )
        .finally(() => setDidAutoDownload(true));
    }
  }, [open, data, didAutoDownload]);

  // Defensive: if there's no data or missing receipt, don't render the dialog content
  if (!data || !data.receipt) return null;

  const handleDownload = async () => {
    if (!contentRef.current) return;
    try {
      await generatePdfFromNode(contentRef.current, makeFilename(data));
    } catch {
      toast({ title: 'No se pudo descargar el PDF', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ticket de compra</DialogTitle>
        </DialogHeader>
        <div ref={contentRef} className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Fecha: {formatDate(data.receipt.datetime)}</p>
            {data.receipt.user && (
              <p>
                Usuario: {data.receipt.user.name} ({data.receipt.user.email})
              </p>
            )}
            {data.receipt.agency && <p>Agencia: {data.receipt.agency}</p>}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="text-right">Cant.</TableHead>
                <TableHead className="text-right">FC Unidad</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{item.fitcoins}</TableCell>
                  <TableCell className="text-right">{item.fitcoins * item.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{data.total} FC</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Saldo restante</span>
            <span>{data.balance} FC</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Presenta este comprobante en la agencia para retiro.
          </p>
        </div>
        <DialogFooter className="flex gap-2 pt-4">
          <Button onClick={handleDownload}>Descargar PDF</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
