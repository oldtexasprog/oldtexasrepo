export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      {/* Hero Section con gradiente del logo */}
      <div className="bg-texas-gradient text-white rounded-2xl p-12 max-w-4xl w-full mb-8 shadow-texas">
        <h1 className="text-6xl font-bold text-center mb-4">
          🍖 Old Texas BBQ
        </h1>
        <p className="text-xl text-center opacity-90 mb-8">
          Sistema de Gestión Integral - CRM
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-white text-brand-navy px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition">
            Entrar al Sistema
          </button>
          <button className="bg-brand-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-red/90 transition">
            Ver Documentación
          </button>
        </div>
      </div>

      {/* Paleta de Colores */}
      <div className="max-w-4xl w-full">
        <h2 className="text-3xl font-bold mb-6 text-brand-navy">
          🎨 Paleta de Colores
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Navy */}
          <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <div className="bg-brand-navy h-24 rounded-lg mb-3"></div>
            <h3 className="font-semibold text-sm">Navy</h3>
            <p className="text-xs text-muted-foreground">#002D72</p>
          </div>

          {/* Red */}
          <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <div className="bg-brand-red h-24 rounded-lg mb-3"></div>
            <h3 className="font-semibold text-sm">Red BBQ</h3>
            <p className="text-xs text-muted-foreground">#ED1C24</p>
          </div>

          {/* Gold */}
          <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <div className="bg-brand-gold h-24 rounded-lg mb-3"></div>
            <h3 className="font-semibold text-sm">Gold</h3>
            <p className="text-xs text-muted-foreground">#F59E0B</p>
          </div>

          {/* Cream */}
          <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <div className="bg-brand-cream h-24 rounded-lg mb-3 border border-border"></div>
            <h3 className="font-semibold text-sm">Cream</h3>
            <p className="text-xs text-muted-foreground">#FFF4E6</p>
          </div>
        </div>

        {/* Efectos y Gradientes */}
        <h2 className="text-2xl font-bold mb-4 text-brand-navy">
          ✨ Efectos y Gradientes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Gradiente Fire */}
          <div className="bg-fire-gradient text-white p-6 rounded-lg text-center">
            <h3 className="font-bold mb-2">Fire Gradient</h3>
            <p className="text-sm opacity-90">Red → Gold</p>
          </div>

          {/* Gradiente Navy */}
          <div className="bg-navy-gradient text-white p-6 rounded-lg text-center">
            <h3 className="font-bold mb-2">Navy Gradient</h3>
            <p className="text-sm opacity-90">Navy → Blue</p>
          </div>

          {/* Shadow Texas */}
          <div className="bg-card shadow-texas p-6 rounded-lg text-center border border-border">
            <h3 className="font-bold mb-2">Shadow Texas</h3>
            <p className="text-sm text-muted-foreground">Sombra Navy</p>
          </div>
        </div>

        {/* Estados */}
        <h2 className="text-2xl font-bold mb-4 text-brand-navy">
          🎯 Estados de Pedidos
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-warning/20 text-warning border border-warning px-4 py-2 rounded-lg text-center font-semibold">
            Pendiente
          </div>
          <div className="bg-info/20 text-info border border-info px-4 py-2 rounded-lg text-center font-semibold">
            En Preparación
          </div>
          <div className="bg-success/20 text-success border border-success px-4 py-2 rounded-lg text-center font-semibold">
            Listo
          </div>
          <div className="bg-primary/20 text-primary border border-primary px-4 py-2 rounded-lg text-center font-semibold">
            En Reparto
          </div>
          <div className="bg-success border border-success text-white px-4 py-2 rounded-lg text-center font-semibold">
            Entregado
          </div>
          <div className="bg-destructive/20 text-destructive border border-destructive px-4 py-2 rounded-lg text-center font-semibold">
            Cancelado
          </div>
        </div>
      </div>
    </main>
  );
}
