import { ArrowRight, Zap, Trophy, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products-section');
    productsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background min-h-[80vh] flex items-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/8 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary/8 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-primary/5 blur-2xl animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-1/4 right-1/3 w-24 h-24 rounded-full bg-secondary/5 blur-2xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
      </div>
      
      <div className="container relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge with animation */}
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm animate-fade-in">
            <Zap className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary tracking-wide">FITCOINS STORE</span>
            <Trophy className="h-4 w-4 text-primary" />
          </div>
          
          {/* Main heading with improved typography */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight">
              <span className="text-secondary">Entrena con lo</span>{' '}
              <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                mejor
              </span>
            </h1>
            <div className="flex items-center justify-center gap-4 text-2xl sm:text-3xl font-bold text-muted-foreground">
              <Target className="h-8 w-8 text-primary" />
              <span>Tu esfuerzo, tu premio</span>
              <Trophy className="h-8 w-8 text-secondary" />
            </div>
          </div>
          
          {/* Description with better spacing */}
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Descubre nuestra selección premium de equipamiento deportivo. 
            <span className="text-primary font-semibold"> Usa tus Fitcoins</span> para obtener el premio que necesitas para alcanzar tus metas.
          </p>
          
          {/* CTA Buttons with enhanced styling */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button
              size="lg"
              onClick={scrollToProducts}
              className="bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-white px-10 py-8 text-xl font-semibold rounded-2xl shadow-strong hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Target className="h-6 w-6 mr-3" />
              Explorar productos
              <ArrowRight className="h-6 w-6 ml-3" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-10 py-8 text-xl font-semibold rounded-2xl border-2 border-secondary text-secondary hover:bg-secondary hover:text-white transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
            >
              <Zap className="h-6 w-6 mr-3" />
              Ver mi saldo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}