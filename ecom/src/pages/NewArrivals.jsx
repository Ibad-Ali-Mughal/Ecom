import { useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

export const NewArrivals = () => {
  const { products, loading, error } = useProducts();

  const newArrivals = useMemo(() => {
    if (!products) return [];
    
    return [...products]
      .filter(p => p.is_new_arrival === true)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 8);
  }, [products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.8em] animate-pulse text-zinc-400">
            Syncing Collection...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 font-black uppercase tracking-widest px-6 text-center">
          Protocol Error // Connection Failed
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 font-sans selection:bg-black selection:text-white">
      <header className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-8 bg-black"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">
                Phase 02 // Sequential Drop
              </span>
            </div>
            <h1 className="text-6xl lg:text-8xl font-black uppercase italic tracking-tighter leading-[0.85]">
              NEW <br /> ARRIVALS.
            </h1>
          </div>
          
          <div className="flex flex-col items-start lg:items-end gap-4 max-w-sm lg:text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 leading-relaxed">
              Displaying {newArrivals.length} verified additions to the 2026 digital system. 
              Priority distribution enabled for registered identities.
            </p>
            <div className="h-[1px] w-full bg-zinc-100 hidden lg:block"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-8">
            {newArrivals.map((p, index) => (
              <div 
                key={p.id} 
                className="animate-fade-in-up" 
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'forwards' 
                }}
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 border-t border-zinc-100">
            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em]">
              No New Arrivals Found in System
            </p>
          </div>
        )}
      </main>

      <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default NewArrivals;