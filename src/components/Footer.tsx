export function Footer() {
  return (
    <footer className="border-t border-brand-border bg-muted/30 py-8">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
              <span className="text-white font-bold text-xs">CF</span>
            </div>
            <span className="font-semibold text-secondary">Coosajer Fit Store</span>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Coosajer Fit Store. Todos los derechos reservados.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Powered by Fitcoins • Equipamiento deportivo premium
            </p>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <span>Soporte: </span>
            <span className="text-secondary font-medium">info@coosajerfit.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}