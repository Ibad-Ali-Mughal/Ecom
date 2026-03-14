

import { Link, useLocation } from 'react-router-dom';
import { formatPKR } from '../utils/formatPrice';

export default function ProductCard({ product }) {
  const location = useLocation();
  
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true';

  const mainImage = Array.isArray(product?.images) 
    ? product.images[0] 
    : (typeof product?.images === 'string' ? product.images : 'https://via.placeholder.com/400x500?text=No+Image');

  return (
    <Link 
      to={isPreview ? `/product/${product?.slug}?preview=true` : `/product/${product?.slug}`} 
      className="group block"
    >
      <div className="aspect-[3/4] bg-zinc-100 overflow-hidden mb-4 relative rounded-md">
        <img
          src={mainImage}
          alt={product?.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {product?.is_new_arrival && (
          <span className="absolute top-4 left-4 bg-black text-white text-[10px] px-2 py-1 font-bold uppercase tracking-widest">
            New Arrival
          </span>
        )}
      </div>

      <div className="space-y-1 italic">
        <h3 className="text-sm font-bold uppercase tracking-tight text-zinc-900">
          {product?.title}
        </h3>
        
        <div className="flex items-center gap-3">
          <p className="font-black text-lg text-black">
            {formatPKR(product?.price)}
          </p>
          
          {product?.discount_percent > 0 && (
            <span className="text-xs text-red-500 font-bold">
              -{product.discount_percent}%
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}