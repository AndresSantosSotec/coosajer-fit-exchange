import { Coins, Plus, Trophy, Star } from 'lucide-react';
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
      title: "¡Agregado al carrito!",
      description: `${product.name} ha sido añadido a tu carrito.`,
    });
  };

  const hasImage = product.image && product.image.trim() !== '';

  return (
    <Card className="group cursor-pointer overflow-hidden border-card-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-strong hover:border-primary/30 hover:-translate-y-2 hover:bg-card">
      <CardContent className="p-0 relative">
        {/* Image container with better placeholder */}
        <div className="aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/60 relative">
          {hasImage ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          {/* Fallback placeholder */}
          <div className={`${hasImage ? 'hidden' : 'flex'} absolute inset-0 flex-col items-center justify-center text-muted-foreground bg-gradient-to-br from-muted via-muted/80 to-muted/60`}>
            <Trophy className="h-12 w-12 mb-2 text-primary/40" />
            <span className="text-sm font-medium text-center px-4">Premio disponible</span>
          </div>
          
          {/* Floating badge */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Star className="h-3 w-3" />
              Premio
            </div>
          </div>
        </div>

        {/* Content with improved spacing */}
        <div className="p-5 space-y-3">
          {/* Header with title and size */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-secondary leading-tight line-clamp-2 text-lg group-hover:text-primary transition-colors duration-300">
              {product.name}
            </h3>
            {product.size && (
              <Badge variant="secondary" className="text-xs font-semibold shrink-0 bg-secondary/10 text-secondary border border-secondary/20">
                {product.size}
              </Badge>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description || "Producto premium disponible para canje con Fitcoins"}
          </p>

          {/* Price and brand section */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 bg-primary/5 px-3 py-2 rounded-xl border border-primary/10">
              <Coins className="h-5 w-5 text-primary" />
              <span className="font-black text-primary text-xl">
                {product.fitcoins}
              </span>
              <span className="text-xs font-semibold text-primary/70">FC</span>
            </div>
            {product.brand && (
              <div className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">
                {product.brand}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Enhanced footer */}
      <CardFooter className="p-5 pt-0">
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-white font-semibold py-6 rounded-xl shadow-medium hover:shadow-strong transform group-hover:scale-[1.02] transition-all duration-300"
          size="sm"
        >
          <Plus className="h-5 w-5 mr-2" />
          Agregar al carrito
        </Button>
      </CardFooter>
    </Card>
  );
}