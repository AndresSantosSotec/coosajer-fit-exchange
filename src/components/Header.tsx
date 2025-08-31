"use client";

import { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, User, Coins, LogOut } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import LoginDialog from '@/components/auth/LoginDialog';
import { useWebAuth } from '@/contexts/WebAuthContext';

export function Header() {
  const { state, dispatch } = useStore();
  const { user, collaborator, isAuthenticated, logout } = useWebAuth();

  const [loginOpen, setLoginOpen] = useState(false);

  const cartItemsCount = useMemo(
    () => state.cart.reduce((total, item) => total + item.quantity, 0),
    [state.cart]
  );
  const cartTotal = useMemo(
    () => state.cart.reduce((total, item) => total + (item.fitcoins * item.quantity), 0),
    [state.cart]
  );

  // Balance: si hay sesion, toma del collaborator.fitcoin_account.balance
  const sessionBalance = collaborator?.fitcoin_account?.balance ?? state.balance;
  const remainingBalance = sessionBalance - cartTotal;

  // (Opcional recomendado) sincroniza el balance del Store con el del colaborador
  useEffect(() => {
    if (typeof collaborator?.fitcoin_account?.balance === "number") {
      dispatch({ type: 'SET_BALANCE', payload: collaborator.fitcoin_account.balance });
    }
  }, [collaborator?.fitcoin_account?.balance, dispatch]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
            <span className="text-white font-bold text-sm">CF</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-secondary">Coosajer Fit</h1>
            <p className="text-xs text-muted-foreground">Store</p>
          </div>
        </div>

        {/* Balance and Cart */}
        <div className="flex items-center space-x-4">
          {/* Balance Display */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-2 rounded-lg bg-muted">
            <Coins className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-secondary">
              {remainingBalance} Fitcoins
            </span>
            {remainingBalance < 0 && (
              <span className="text-xs text-destructive">(Insuficientes)</span>
            )}
          </div>

          {/* Cart Button */}
          <Button
            variant="outline"
            size="sm"
            className="relative"
            onClick={() => dispatch({ type: 'TOGGLE_CART' })}
          >
            <ShoppingCart className="h-4 w-4" />
            {cartItemsCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {cartItemsCount}
              </Badge>
            )}
          </Button>

          {/* User Profile / Login */}
          {!isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => setLoginOpen(true)}>
                <User className="h-4 w-4" />
              </Button>
              <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={collaborator?.photo_url ?? ""} alt={user?.name ?? "U"} />
                    <AvatarFallback>{(user?.name?.[0] ?? "U").toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm">{user?.name ?? "Usuario"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Mi perfil</DropdownMenuLabel>
                <div className="px-3 py-2 flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={collaborator?.photo_url ?? ""} />
                    <AvatarFallback>{(user?.name?.[0] ?? "U").toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="px-3 py-2 text-sm flex items-center justify-between">
                  <span>Fitcoins</span>
                  <span className="font-semibold">{collaborator?.fitcoin_account?.balance ?? 0}</span>
                </div>
                <DropdownMenuSeparator />
                {/* Aquí podrías agregar "Mi historial", "Mis canjes", etc. */}
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
