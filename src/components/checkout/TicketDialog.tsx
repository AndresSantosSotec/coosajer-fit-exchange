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
  if (!date) return new Date().toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
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
    const now = new Date();
    const stamp = now
      .toISOString()
      .replace(/[-:]/g, '')
      .slice(0, 15)
      .replace('T', '-');

    // Usar datos de canjes si están disponibles
    const firstCanje = data.canjes?.[0];
    const userId = firstCanje?.user_id ?? 'user';
    return `Ticket-${stamp}-${userId}.pdf`
  } catch {
    return `Ticket-${Date.now()}.pdf`
  }
}

export default function TicketDialog({ open, onOpenChange, data }: TicketDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [didAutoDownload, setDidAutoDownload] = useState(false);

  // 🐛 DEBUG: Log inicial del componente
  console.log('🎭 TicketDialog render - Props recibidas:', {
    open,
    dataExists: !!data,
    data: data ? {
      keys: Object.keys(data),
      hasItems: !!data.items,
      itemsLength: data.items?.length,
      hasCanjes: !!data.canjes,
      canjesLength: data.canjes?.length
    } : 'null'
  });

  // ✅ NUEVA LÓGICA: Solo verificar que existan data e items
  const shouldReturnNull = !data || !data.items || data.items.length === 0;
  console.log('🚨 TicketDialog - shouldReturnNull:', shouldReturnNull, {
    noData: !data,
    noItems: data ? !data.items : 'data is null',
    emptyItems: data?.items ? data.items.length === 0 : 'no items'
  });

  useEffect(() => {
    console.log('🔄 TicketDialog useEffect ejecutado:', {
      open,
      dataExists: !!data,
      hasItems: data ? !!data.items : false,
      hasContentRef: !!contentRef.current,
      didAutoDownload
    });

    if (open && data && data.items && contentRef.current && !didAutoDownload) {
      console.log('📄 Intentando generar PDF automáticamente...');
      generatePdfFromNode(contentRef.current, makeFilename(data))
        .then(() => {
          console.log('✅ PDF generado exitosamente');
          toast({
            title: 'Ticket descargado',
            description: 'El PDF del ticket se ha descargado automáticamente',
          });
        })
        .catch((error) => {
          console.error('❌ Error al generar PDF:', error);
          toast({
            title: 'No se pudo descargar el PDF automáticamente',
            description: 'Puedes intentar descargarlo manualmente',
            variant: 'destructive',
          })
        })
        .finally(() => {
          console.log('🏁 setDidAutoDownload(true)');
          setDidAutoDownload(true);
        });
    }
  }, [open, data, didAutoDownload]);

  // 🐛 DEBUG: Log antes del return null
  if (shouldReturnNull) {
    console.log('🚫 TicketDialog retornando null debido a:', {
      noData: !data,
      noItems: data ? !data.items : 'data is null',
      emptyItems: data?.items ? data.items.length === 0 : 'no items'
    });
    return null;
  }

  const handleDownload = async () => {
    console.log('📥 handleDownload ejecutado');
    if (!contentRef.current) {
      console.log('❌ No hay contentRef.current');
      return;
    }
    try {
      await generatePdfFromNode(contentRef.current, makeFilename(data));
      console.log('✅ Descarga manual exitosa');
      toast({
        title: 'Ticket descargado',
        description: 'El PDF se ha descargado correctamente',
      });
    } catch (error) {
      console.error('❌ Error en descarga manual:', error);
      toast({ title: 'No se pudo descargar el PDF', variant: 'destructive' });
    }
  };

  console.log('🎭 TicketDialog renderizando contenido del modal');

  // Obtener información del primer canje para mostrar detalles del usuario
  const firstCanje = data.canjes?.[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ticket de compra</DialogTitle>
        </DialogHeader>
        <div ref={contentRef} className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Fecha: {formatDate()}</p>
            {firstCanje && (
              <>
                <p>Usuario ID: {firstCanje.user_id}</p>
                <p>Colaborador ID: {firstCanje.colaborator_id}</p>
              </>
            )}
            <p>Estado: {data.message}</p>
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
              {data.items.map((item, index) => (
                <TableRow key={item.id || index}>
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