import { Check, Download, X } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

export function TicketModal() {
  const { state, dispatch } = useStore();
  const { isTicketModalOpen } = state;

  const closeModal = () => {
    dispatch({ type: 'TOGGLE_TICKET_MODAL' });
  };

  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const ticketNumber = `CF-${Date.now().toString().slice(-6)}`;

  return (
    <Dialog open={isTicketModalOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <Check className="h-5 w-5 text-white" />
            </div>
            ¡Compra Exitosa!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Success Message */}
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              Tu ticket ha sido generado correctamente
            </p>
            <p className="text-sm text-muted-foreground">
              Presenta este ticket en administración para recoger tus productos
            </p>
          </div>

          <Separator />

          {/* Ticket Details */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="text-center">
              <h3 className="font-bold text-secondary">COOSAJER FIT STORE</h3>
              <p className="text-sm text-muted-foreground">Ticket de Compra</p>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>N° Ticket:</span>
                <span className="font-mono font-medium">{ticketNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Fecha:</span>
                <span>{currentDate}</span>
              </div>
            </div>

            <Separator />

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Válido para canje en administración
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Conserva este ticket para recoger tus productos
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={closeModal}>
              <X className="h-4 w-4 mr-2" />
              Cerrar
            </Button>
            <Button className="flex-1" onClick={() => window.print()}>
              <Download className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}