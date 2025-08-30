import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { Filters } from '@/components/Filters';
import { ProductGrid } from '@/components/ProductGrid';
import { CartDrawer } from '@/components/CartDrawer';
import { TicketModal } from '@/components/TicketModal';
import { Footer } from '@/components/Footer';
import { StoreProvider } from '@/contexts/StoreContext';

const Index = () => {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection />
          <Filters />
          <ProductGrid />
        </main>
        <Footer />
        <CartDrawer />
        <TicketModal />
      </div>
    </StoreProvider>
  );
};

export default Index;
