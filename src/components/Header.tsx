import { ShoppingCart, User, Coins } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const { state, dispatch } = useStore();
  
  const cartItemsCount = state.cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = state.cart.reduce((total, item) => total + (item.fitcoins * item.quantity), 0);
  const remainingBalance = state.balance - cartTotal;

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

          {/* User Profile */}
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}