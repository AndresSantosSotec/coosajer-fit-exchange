import { Coins, Plus } from 'lucide-react';
import { Product, useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useStore();

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    toast({
      title: "Agregado al carrito",
      description: `${product.name} ha sido añadido a tu carrito.`,
    });
  };

  return (
    <Card className="group cursor-pointer overflow-hidden border-card-border bg-card transition-all duration-200 hover:shadow-medium hover:border-primary/20">
      <CardContent className="p-0">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-secondary leading-tight line-clamp-2">
              {product.name}
            </h3>
            {product.size && (
              <Badge variant="secondary" className="text-xs">
                {product.size}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Coins className="h-4 w-4 text-primary" />
              <span className="font-bold text-primary text-lg">
                {product.fitcoins}
              </span>
              <span className="text-xs text-muted-foreground">Fitcoins</span>
            </div>
            {product.brand && (
              <span className="text-xs text-muted-foreground">
                {product.brand}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart}
          className="w-full group-hover:bg-primary-hover transition-colors"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar al carrito
        </Button>
      </CardFooter>
    </Card>
  );
}