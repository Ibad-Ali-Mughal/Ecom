

import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

export const Shop = () => {
  const { products = [], categories = [], loading, error } = useProducts();
  const location = useLocation();
  
  const [activeCategory, setActiveCategory] = useState(null);

  const isPreview = new URLSearchParams(location.search).get('preview') === 'true';

  const filteredProducts = useMemo(() => {
    return activeCategory
      ? products.filter((p) => p.categories?.name === activeCategory)
      : products;
  }, [products, activeCategory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-[3px] border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.8em] animate-pulse">Syncing Collection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-black uppercase tracking-widest">
        System Error // {error}
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 font-sans selection:bg-black selection:text-white">
      <header className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-[2px] w-8 bg-black"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">
            System // Full Collection
          </span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none mb-4">
          SHOP ALL.
        </h1>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-zinc-100 pt-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
            Displaying {filteredProducts.length} iterations 
            {activeCategory && ` filtered by [${activeCategory}]`}
          </p>
          
          {activeCategory && (
            <button 
              onClick={() => setActiveCategory(null)}
              className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-zinc-400 hover:border-zinc-200 transition-all w-fit"
            >
              Reset Filters [x]
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="hidden lg:block w-64 space-y-8">
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-black mb-6 border-b border-black pb-2">
              01. Categories
            </h3>
            <div className="space-y-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name === activeCategory ? null : cat.name)}
                  className={`w-full flex justify-between items-center group transition-all ${
                    activeCategory === cat.name 
                    ? 'text-black translate-x-2' 
                    : 'text-zinc-400 hover:text-black hover:translate-x-1'
                  }`}
                >
                  <span className="text-[11px] font-black uppercase tracking-widest leading-none">
                    {cat.name}
                  </span>
                  <span className={`text-xs transition-opacity ${
                    activeCategory === cat.name ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    →
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="pt-12">
            <div className="p-4 border border-zinc-100 space-y-2">
              <div className="h-1 w-4 bg-zinc-200"></div>
              <p className="text-[8px] text-zinc-300 font-bold leading-tight uppercase tracking-widest">
                Data Stream: Active <br />
                Protocol: Secure_v2
              </p>
            </div>
          </div>
        </aside>

        <section className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-12 sm:gap-x-8">
              {filteredProducts.map((p, index) => (
                <div 
                  key={p.id} 
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-zinc-100">
              <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em]">
                No Results Found in This Sector
              </p>
            </div>
          )}
        </section>
      </div>

      <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
};

export default Shop;