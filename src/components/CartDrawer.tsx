"use client";

import { useState, useMemo } from 'react';
import { X, Plus, Minus, ShoppingBag, Coins, Receipt } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

// ⬇️ NUEVOS imports para auth y login
import { useWebAuth } from '@/contexts/WebAuthContext';
import LoginDialog from '@/components/auth/LoginDialog';

export function CartDrawer() {
  const { state, dispatch } = useStore();
  const { cart, balance, isCartOpen } = state;

  // ⬇️ Tomamos estado de autenticación y datos del colaborador
  const { isAuthenticated, collaborator } = useWebAuth();

  // ⬇️ Control local del modal de login
  const [loginOpen, setLoginOpen] = useState(false);

  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + (item.fitcoins * item.quantity), 0),
    [cart]
  );

  // ⬇️ Si hay sesión, usamos el balance real del colaborador; si no, el del Store
  const sessionBalance = useMemo(
    () => (isAuthenticated ? (collaborator?.fitcoin_account?.balance ?? balance) : balance),
    [isAuthenticated, collaborator?.fitcoin_account?.balance, balance]
  );

  const remainingBalance = sessionBalance - cartTotal;
  const canProcessPurchase = remainingBalance >= 0 && cart.length > 0;

  const updateQuantity = (id: string, newQuantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: newQuantity } });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  // ⬇️ Antes despachabas directo; ahora gateamos por login
  const processPurchase = () => {
    dispatch({ type: 'PROCESS_PURCHASE' });
  };

  const handleGenerateTicket = () => {
    if (!isAuthenticated) {
      setLoginOpen(true); // abrir login si no hay sesión
      return;
    }
    processPurchase(); // si hay sesión, procesar normal
  };

  // ⚠️ Nota: Sheet de shadcn pasa (open:boolean) en onOpenChange; si lo quieres estricto:
  const handleSheetOpenChange = (open: boolean) => {
    // cuando el Drawer se cierra (open=false), toggleas el store
    if (!open) dispatch({ type: 'TOGGLE_CART' });
  };

  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={handleSheetOpenChange}>
        <SheetContent className="w-full max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Mi Carrito
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-full">
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">Tu carrito está vacío</p>
                <p className="text-sm text-muted-foreground">
                  Agrega productos para comenzar tu compra
                </p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <ScrollArea className="flex-1 -mx-6 px-6">
                  <div className="space-y-4 py-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-3 p-3 rounded-lg border border-card-border">
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2 text-secondary">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-1 mt-1">
                            <Coins className="h-3 w-3 text-primary" />
                            <span className="text-sm font-semibold text-primary">
                              {item.fitcoins}
                            </span>
                            <span className="text-xs text-muted-foreground">FC</span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="font-medium text-sm w-8 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-destructive hover:text-destructive"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <Separator className="my-4" />

                {/* Summary */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Subtotal:</span>
                    <div className="flex items-center gap-1">
                      <Coins className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{cartTotal}</span>
                      <span className="text-xs text-muted-foreground">FC</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Saldo restante:</span>
                    <div className="flex items-center gap-1">
                      <Coins className="h-4 w-4 text-primary" />
                      <span className={`font-semibold ${remainingBalance < 0 ? 'text-destructive' : 'text-foreground'}`}>
                        {remainingBalance}
                      </span>
                      <span className="text-xs text-muted-foreground">FC</span>
                    </div>
                  </div>

                  {remainingBalance < 0 && (
                    <p className="text-xs text-destructive text-center">
                      Saldo insuficiente para completar la compra
                    </p>
                  )}

                  <Button 
                    className="w-full" 
                    disabled={!canProcessPurchase}
                    onClick={handleGenerateTicket}  // ⬅️ aquí se hace el gateo por login
                  >
                    <Receipt className="h-4 w-4 mr-2" />
                    Generar Ticket
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* ⬇️ Modal de login */}
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
