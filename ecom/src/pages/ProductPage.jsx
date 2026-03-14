

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { formatPKR } from '../utils/formatPrice';
import { ReviewList } from '../components/ReviewList';
import { FiMinus, FiPlus, FiCheck, FiEdit, FiSliders } from 'react-icons/fi';

export const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { products, loading: productsLoading } = useProducts();
  const { profile, loading: authLoading } = useAuth();
  
  const { addToCart, getItemQuantity } = useCart();
  
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('Reviews'); 
  const [selectedColor, setSelectedColor] = useState(""); 
  const [selectedSize, setSelectedSize] = useState("");   
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [message, setMessage] = useState("");
  const [errorShake, setErrorShake] = useState(false);

  const isPreview = new URLSearchParams(location.search).get('preview') === 'true';
  const isAdmin = !authLoading && profile?.role === 'admin';
  const showAdminControls = isAdmin && isPreview;

  const getImagesByColor = (prod, colorName) => {
    if (!prod || !prod.colors || !colorName) return [];
    const searchKey = colorName.trim().toUpperCase();
    const actualKey = Object.keys(prod.colors).find(
      key => key.trim().toUpperCase() === searchKey
    );
    return actualKey ? prod.colors[actualKey] : [];
  };

  useEffect(() => {
    if (products?.length) {
      const found = products.find(p => p.slug === slug);
      setProduct(found || null);
      if (found) {
        const variantColors = [...new Set(found.product_variants?.map(v => v.color).filter(Boolean))];
        const initialColor = variantColors[0] || "";
        setSelectedColor(initialColor);
        
        const colorImages = getImagesByColor(found, initialColor);
        const initialImg = (colorImages && colorImages.length > 0) 
          ? colorImages[0] 
          : (Array.isArray(found.images) ? found.images[0] : found.images);
        setMainImage(initialImg);
      }
    }
  }, [slug, products]);

  if (productsLoading || authLoading) return <div className="pt-40 text-center font-bold uppercase tracking-widest text-xs">Loading...</div>;
  if (!product) return <div className="pt-40 text-center font-bold">Product not found.</div>;

  const variants = product.product_variants || [];
  const uniqueColors = [...new Set(variants.map(v => v.color).filter(Boolean))];
  const availableSizes = variants.filter(v => v.color === selectedColor);
  
  const finalSelection = variants.find(v => v.color === selectedColor && v.name === selectedSize);
  
  const qtyInCart = finalSelection ? getItemQuantity(finalSelection.id) : 0;
  const totalStockAvailable = finalSelection ? finalSelection.stock : 0;
  
  const isOutOfStock = finalSelection ? (totalStockAvailable <= 0) : false;
  const isMaxInBag = finalSelection ? (qtyInCart >= totalStockAvailable) : false;
  const remainingPurchasable = finalSelection ? (totalStockAvailable - qtyInCart) : 0;

  const discountPrice = product.discount_percent > 0 ? product.price * (1 - product.discount_percent / 100) : product.price;
  const currentImages = getImagesByColor(product, selectedColor);
  const colorGallery = currentImages.length > 0 ? currentImages : (Array.isArray(product.images) ? product.images : []);

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setSelectedSize(""); 
    setQuantity(1);
    const newColorImages = getImagesByColor(product, color);
    if (newColorImages && newColorImages.length > 0) setMainImage(newColorImages[0]);
  };

  const handleAddToCart = () => {
    if (isAdmin) return;

    if (!selectedSize) {
      setMessage("Please choose a size first");
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 500);
      return;
    }

    if (isMaxInBag || isOutOfStock) {
      setMessage("Requested quantity exceeds available stock");
      return;
    }

    addToCart(product, finalSelection, quantity);
    setMessage("Successfully added to bag");
    setQuantity(1);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <main className="pt-24 lg:pt-32 max-w-7xl mx-auto px-4 pb-20">
      <nav className="flex gap-2 text-sm text-gray-400 mb-8 items-center uppercase font-bold tracking-tighter">
        <span className="hover:text-black cursor-pointer" onClick={() => navigate(showAdminControls ? '/?preview=true' : '/')}>Home</span> / 
        <span className="hover:text-black cursor-pointer" onClick={() => navigate(showAdminControls ? '/shop?preview=true' : '/shop')}>Shop</span> / 
        <span className="text-black">{product.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
        <div className="flex flex-col-reverse lg:flex-row gap-4 lg:w-1/2">
          <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible no-scrollbar pb-2 lg:pb-0">
            {colorGallery.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 sm:w-32 sm:h-32 bg-[#F0EEED] rounded-[20px] overflow-hidden border-2 transition-all shrink-0 
                  ${mainImage === img ? 'border-black' : 'border-transparent opacity-50'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
              </button>
            ))}
          </div>
          <div className="flex-1 bg-[#F0EEED] rounded-3xl overflow-hidden aspect-[4/5] relative">
              <img src={mainImage} key={mainImage} className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500" alt={product.title} />
          </div>
        </div>

        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-4xl lg:text-6xl font-black italic uppercase tracking-tighter leading-tight">{product.title}</h1>
          <div className="text-3xl font-black">{formatPKR(discountPrice)}</div>
          <p className="text-gray-500 text-sm leading-relaxed max-w-md">{product.description}</p>

          <div className="space-y-4 border-t border-gray-100 pt-6">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Select Color</p>
            <div className="flex flex-wrap gap-5">
              {uniqueColors.map((color) => (
                <div key={color} className="flex flex-col items-center gap-2">
                  <button 
                    onClick={() => handleColorChange(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center
                      ${selectedColor === color ? 'border-black scale-110' : 'border-transparent hover:border-gray-300'}`}
                    style={{ backgroundColor: color.toLowerCase().replace(" ", "") }}
                  >
                    {selectedColor === color && (
                      <FiCheck className={['WHITE', 'YELLOW'].includes(color.toUpperCase()) ? 'text-black' : 'text-white mix-blend-difference'} />
                    )}
                  </button>
                  <span className={`text-[9px] font-black uppercase ${selectedColor === color ? 'text-black' : 'text-gray-400'}`}>{color}</span>
                </div>
              ))}
            </div>
          </div>

         
<div className={`space-y-4 transition-all duration-300 ${errorShake ? 'animate-bounce' : ''}`}>
  <div className="flex justify-between items-center">
    <p className={`text-[10px] font-black uppercase tracking-widest ${errorShake ? 'text-red-600' : 'text-gray-400'}`}>
      Choose Size {errorShake && "— Required"}
    </p>
    
    {finalSelection && (
      <div className="text-[10px] font-black uppercase flex gap-2">
        <span className="text-zinc-400">Availability:</span>
        {isOutOfStock ? (
          <span className="text-red-500">Sold Out</span>
        ) : isMaxInBag ? (
          <span className="text-orange-500">All available stock is in your bag</span>
        ) : (
          <span className="text-black">{remainingPurchasable} Units Left</span>
        )}
      </div>
    )}
  </div>

  <div className="flex flex-wrap gap-3">
    {availableSizes.map(v => (
      <button 
        key={v.id} 
        onClick={() => { setSelectedSize(v.name); setMessage(""); setQuantity(1); }}
        className={`px-8 py-3 rounded-full text-xs font-black transition-all uppercase tracking-widest
          ${selectedSize === v.name ? 'bg-black text-white shadow-xl' : 'bg-[#F0F0F0] text-gray-400 hover:bg-gray-200'}
          ${v.stock <= 0 ? 'opacity-30 cursor-not-allowed strike-through' : ''}`}
        disabled={v.stock <= 0}
      >
        {v.name}
      </button>
    ))}
  </div>
</div>

          <div className="flex gap-4 pt-4">
            {showAdminControls ? (
             <button 
      onClick={() => navigate(`/admin/dashboard/edit-product/${product.id}`)} 
      className="flex-1 flex items-center justify-center gap-3 bg-blue-600 text-white rounded-full font-black uppercase italic tracking-widest py-4 shadow-2xl hover:bg-blue-700 transition-all"
    >
      <FiEdit size={20} /> Edit Product
    </button>
            ) : (
              <>
                <div className="bg-[#F0F0F0] rounded-full flex items-center px-6 py-4 gap-8">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}><FiMinus /></button>
                  <span className="font-black text-sm w-4 text-center">{quantity}</span>
                  <button 
                    disabled={quantity >= remainingPurchasable}
                    className="disabled:opacity-20"
                    onClick={() => setQuantity(q => q + 1)}
                  >
                    <FiPlus />
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  disabled={isMaxInBag || isOutOfStock}
                  className={`flex-1 rounded-full font-black uppercase italic tracking-widest py-4 shadow-2xl transition-all 
                    ${(isMaxInBag || isOutOfStock) 
                      ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' 
                      : !selectedSize ? 'bg-zinc-800 text-zinc-400' : 'bg-black text-white active:scale-95'}`}
                >
                  {isOutOfStock ? "Out of Stock" : isMaxInBag ? "Limit Reached" : "Add to Cart"}
                </button>
              </>
            )}
          </div>
          {message && <p className={`text-xs font-bold uppercase tracking-widest ${errorShake ? 'text-red-500' : 'text-green-600'}`}>{message}</p>}
        </div>
      </div>

      <section className="mt-24 border-t border-gray-100 pt-12">
        <div className="flex border-b border-gray-100 mb-10 overflow-x-auto no-scrollbar">
          {['Details', 'Reviews', 'FAQs'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-[10px] lg:text-xs transition-all font-black uppercase tracking-[0.2em] whitespace-nowrap ${activeTab === tab ? 'border-b-2 border-black text-black' : 'text-gray-300'}`}>
              {tab === 'Details' ? 'Product Details' : tab === 'Reviews' ? 'Rating & Reviews' : 'FAQs'}
            </button>
          ))}
        </div>
        
        <div className="min-h-[300px]">
          {activeTab === 'Details' && <div className="text-gray-500 text-sm leading-relaxed max-w-2xl">{product.product_details || product.description}</div>}
          
          {activeTab === 'Reviews' && (
            <div>
              <div className="flex justify-between items-center gap-4 mb-10">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">Verified Reviews</h3>
                <div className="flex gap-2">
                   <button className="p-3 bg-[#F0F0F0] rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center">
                    <FiSliders size={18} />
                   </button>
                   <button 
                    onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-black text-white px-4 lg:px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.1em]"
                   >
                    Write a Review
                   </button>
                </div>
              </div>
              <ReviewList productId={product.id} />
            </div>
          )}

          {activeTab === 'FAQs' && (
            <div className="space-y-6 max-w-2xl">
              <div className="border-b border-gray-50 pb-6 font-black text-xs uppercase italic">Shipping: 3-5 Business Days</div>
              <div className="border-b border-gray-50 pb-6 font-black text-xs uppercase italic">Returns: 7-Day Exchange Policy</div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};