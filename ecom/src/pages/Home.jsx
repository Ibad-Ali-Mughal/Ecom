// // src/pages/Home.jsx

// import React, { useEffect, useState } from "react";
// import { supabase } from "../supabaseClient";
// import ProductCard from "../components/ProductCard";
// import Loader from "../components/Loader";
// import Layout from "../components/Layout";
// import { Link } from "react-router-dom"; // <-- Import Link

// // Your original slider image links, mapped to the new structure:
// const HERO_BANNER_IMAGE = "https://static.independent.co.uk/2025/08/22/13/59/How-I-tested-the-best-laptops-indybest.jpg?quality=75&width=640&auto=webp";
// const CATEGORY_TILE_IMAGE = "https://static.independent.co.uk/2025/08/22/13/59/How-I-tested-the-best-laptops-indybest.jpg?quality=75&width=640&auto=webp";
// const PROMO_BANNER_IMAGE = "https://via.placeholder.com/1200x400?text=New+Arrivals";

// // Category data using your provided image link for consistency
// const categoriesData = [
//     { name: 'NEW ARRIVALS', slug: 'new-arrivals', imageUrl: CATEGORY_TILE_IMAGE },
//     { name: 'WOMAN', slug: 'clothing-woman', imageUrl: CATEGORY_TILE_IMAGE },
//     { name: 'MAN', slug: 'clothing-man', imageUrl: CATEGORY_TILE_IMAGE },
//     { name: 'SHOES & BAGS', slug: 'accessories-shoes', imageUrl: CATEGORY_TILE_IMAGE },
// ];

// const Home = () => {
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);

//     // Fetch featured products
//     useEffect(() => {
//         const fetchProducts = async () => {
//             const { data, error } = await supabase
//                 .from("products")
//                 .select("*")
//                 .eq("is_active", true)
//                 .limit(4) 
//                 .order("created_at", { ascending: false });

//             if (!error) setProducts(data);
//             setLoading(false);
//         };

//         fetchProducts();
//     }, []);

//     const HeroBanner = () => (
//         <div className="relative w-full h-[60vh] md:h-[85vh] overflow-hidden">
//             <img
//                 // Uses the first link from your original sliderImages
//                 src={HERO_BANNER_IMAGE}
//                 alt="New Collection"
//                 className="w-full h-full object-cover transition-opacity duration-1000"
//             />
//             <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
//                 <div className="text-center p-8 bg-white/5 backdrop-blur-sm">
//                     <h1 className="text-white text-5xl md:text-8xl font-serif tracking-widest uppercase mb-4">
//                         The New Edit
//                     </h1>
//                     <p className="text-white text-lg md:text-2xl font-light tracking-widest mb-6">
//                         Minimal. Elegant. Essential.
//                     </p>
//                     <Link
//                         to="/shop/new-arrivals"
//                         className="inline-block px-8 py-3 text-sm font-semibold tracking-widest text-white uppercase border border-white hover:bg-white hover:text-black transition duration-300"
//                     >
//                         Shop Collection
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );

//     const FeaturedProducts = () => (
//         <section className="container mx-auto px-4 md:px-8 pt-16 pb-8">
//             <h2 className="text-3xl font-normal text-center mb-12 tracking-wider uppercase">
//                 Featured Items
//             </h2>
//             {loading ? (
//                 <Loader />
//             ) : (
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//                     {products.map((product) => (
//                         <ProductCard key={product.id} product={product} />
//                     ))}
//                 </div>
//             )}
//             <div className="text-center mt-12">
//                 <Link
//                     to="/shop"
//                     className="inline-block px-8 py-3 text-sm font-semibold tracking-widest text-black uppercase border border-black hover:bg-black hover:text-white transition duration-300"
//                 >
//                     View All Products
//                 </Link>
//             </div>
//         </section>
//     );

//     const CategoryTiles = () => (
//         <section className="container mx-auto px-4 md:px-8 py-12">
//             <h2 className="text-3xl font-normal text-center mb-12 tracking-wider uppercase">
//                 Shop By Collection
//             </h2>
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
//                 {categoriesData.map((category) => (
//                     <Link 
//                         key={category.slug} 
//                         to={`/shop/${category.slug}`}
//                         className="relative h-64 overflow-hidden group"
//                     >
//                         <img
//                             src={category.imageUrl}
//                             alt={category.name}
//                             className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//                         />
//                         <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition duration-300 flex items-end justify-start p-6">
//                             <h3 className="text-white text-xl md:text-3xl font-semibold tracking-widest uppercase border-b-2 border-white">
//                                 {category.name}
//                             </h3>
//                         </div>
//                     </Link>
//                 ))}
//             </div>
//         </section>
//     );


//     return (
//         <Layout>
//             <main className="bg-white">
//                 <HeroBanner />
//                 <FeaturedProducts />
//                 <CategoryTiles />
                
//                 {/* Promo Banner: Uses the second link from your original sliderImages */}
//                 <section className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden my-12">
//                     <img
//                         src={PROMO_BANNER_IMAGE}
//                         alt="Special Offer"
//                         className="w-full h-full object-cover"
//                     />
//                     <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center p-4">
//                         <h3 className="text-white text-3xl md:text-5xl font-bold tracking-widest uppercase">
//                             Exclusive Online
//                         </h3>
//                         <p className="text-white text-lg mt-2">
//                             Limited stock available.
//                         </p>
//                         <Link
//                             to="/shop/sale"
//                             className="mt-6 inline-block px-8 py-3 text-sm font-semibold tracking-widest text-white uppercase border border-white hover:bg-white hover:text-black transition duration-300"
//                         >
//                             Shop Sale
//                         </Link>
//                     </div>
//                 </section>
//             </main>
//         </Layout>
//     );
// };

// export default Home;
// src/pages/Home.jsx (Revised for Traditional E-commerce/MegaMart Style)



// last final 
// import { useProducts } from '../hooks/useProducts';
// import ProductCard from '../components/ProductCard';
// import { Link } from 'react-router-dom';

// export const Home = () => {
//   const { products, loading } = useProducts();

//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center uppercase tracking-widest text-xs font-bold">
//         <div className="animate-pulse">Loading Collection...</div>
//       </div>
//     );
//   }

//   return (
//     <main className="w-full">
//       {/* 1. HERO SECTION */}
//       <section className="bg-[#F2F0F1] pt-24 lg:pt-32 pb-12 lg:pb-0">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
//           {/* Text Side */}
//           <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8 mb-10 lg:mb-20">
//             <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight italic uppercase tracking-tighter">
//               Find clothes that matches your style
//             </h1>
//             <p className="text-gray-600 text-sm sm:text-base max-w-lg">
//               Browse through our diverse range of meticulously crafted garments, designed 
//               to bring out your individuality and cater to your sense of style.
//             </p>
//             <Link 
//               to="/shop" 
//               className="inline-block w-full sm:w-auto text-center bg-black text-white px-12 py-4 rounded-full font-bold hover:bg-gray-800 transition-all"
//             >
//               Shop Now
//             </Link>

//             {/* Mobile Stats */}
//             <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-6">
//               <div className="text-center lg:text-left">
//                 <h4 className="text-2xl lg:text-4xl font-bold">200+</h4>
//                 <p className="text-xs lg:text-sm text-gray-500">International Brands</p>
//               </div>
//               <div className="border-x border-gray-300 px-8 text-center lg:text-left">
//                 <h4 className="text-2xl lg:text-4xl font-bold">2,000+</h4>
//                 <p className="text-xs lg:text-sm text-gray-500">High-Quality Products</p>
//               </div>
//               <div className="text-center lg:text-left">
//                 <h4 className="text-2xl lg:text-4xl font-bold">30,000+</h4>
//                 <p className="text-xs lg:text-sm text-gray-500">Happy Customers</p>
//               </div>
//             </div>
//           </div>

//           {/* Image Side */}
//           <div className="w-full lg:w-1/2 relative">
//             <img 
//               src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80" 
//               alt="Streetwear Fashion" 
//               className="w-full h-auto object-cover lg:scale-110"
//             />
//           </div>
//         </div>
//       </section>

//       {/* 2. BRAND TICKER BAR */}
//       <div className="bg-black py-6 lg:py-10">
//         <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-around items-center gap-6 lg:gap-12 text-white font-bold text-xl lg:text-4xl opacity-90 tracking-widest italic">
//           <span>VERSACE</span>
//           <span>ZARA</span>
//           <span>GUCCI</span>
//           <span>PRADA</span>
//           <span>CALVIN KLEIN</span>
//         </div>
//       </div>

//       {/* 3. PRODUCT SECTION (NEW ARRIVALS) */}
//       <section className="max-w-7xl mx-auto px-4 py-16 lg:py-24">
//         <h2 className="text-3xl lg:text-5xl font-black text-center mb-12 lg:mb-16 italic uppercase">
//           New Arrivals
//         </h2>
        
//         {/* Responsive Grid */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
//           {products.slice(0, 4).map(p => (
//             <ProductCard key={p.id} product={p} />
//           ))}
//         </div>

//         <div className="mt-12 text-center">
//           <Link 
//             to="/shop" 
//             className="inline-block border border-gray-200 px-16 py-3 rounded-full font-medium hover:bg-black hover:text-white transition-all w-full sm:w-auto"
//           >
//             View All
//           </Link>
//         </div>
//       </section>

//       {/* 4. TOP SELLING (Optional Second Row) */}
//       <section className="max-w-7xl mx-auto px-4 py-16 border-t border-gray-100">
//         <h2 className="text-3xl lg:text-5xl font-black text-center mb-12 lg:mb-16 italic uppercase">
//           Top Selling
//         </h2>
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
//           {/* Logic to show different products if you have them */}
//           {products.slice(4, 8).map(p => (
//             <ProductCard key={p.id} product={p} />
//           ))}
//         </div>
//       </section>
//     </main>
//   );
// };





import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { Link, useLocation } from 'react-router-dom'; 

export const Home = () => {
  const { products, loading } = useProducts();
  const location = useLocation(); 
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true';

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center uppercase tracking-widest text-xs font-bold">
        <div className="animate-pulse">Loading Collection...</div>
      </div>
    );
  }

  return (
    <main className="w-full">
      <section className="bg-[#F2F0F1] pt-24 lg:pt-32 pb-12 lg:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8 mb-10 lg:mb-20">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight italic uppercase tracking-tighter">
              Find clothes that matches your style
            </h1>
            <p className="text-gray-600 text-sm sm:text-base max-w-lg">
              Browse through our diverse range of meticulously crafted garments, designed 
              to bring out your individuality and cater to your sense of style.
            </p>
            
            <Link 
              to={isPreview ? "/shop?preview=true" : "/shop"} 
              className="inline-block w-full sm:w-auto text-center bg-black text-white px-12 py-4 rounded-full font-bold hover:bg-gray-800 transition-all"
            >
              Shop Now
            </Link>

            <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-6">
              <div className="text-center lg:text-left">
                <h4 className="text-2xl lg:text-4xl font-bold">200+</h4>
                <p className="text-xs lg:text-sm text-gray-500">International Brands</p>
              </div>
              <div className="border-x border-gray-300 px-8 text-center lg:text-left">
                <h4 className="text-2xl lg:text-4xl font-bold">2,000+</h4>
                <p className="text-xs lg:text-sm text-gray-500">High-Quality Products</p>
              </div>
              <div className="text-center lg:text-left">
                <h4 className="text-2xl lg:text-4xl font-bold">30,000+</h4>
                <p className="text-xs lg:text-sm text-gray-500">Happy Customers</p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative">
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80" 
              alt="Streetwear Fashion" 
              className="w-full h-auto object-cover lg:scale-110"
            />
          </div>
        </div>
      </section>

      <div className="bg-black py-6 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-around items-center gap-6 lg:gap-12 text-white font-bold text-xl lg:text-4xl opacity-90 tracking-widest italic">
          <span>VERSACE</span>
          <span>ZARA</span>
          <span>GUCCI</span>
          <span>PRADA</span>
          <span>CALVIN KLEIN</span>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-16 lg:py-24">
        <h2 className="text-3xl lg:text-5xl font-black text-center mb-12 lg:mb-16 italic uppercase">
          New Arrivals
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {products.slice(0, 4).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            to={isPreview ? "/shop?preview=true" : "/shop"} 
            className="inline-block border border-gray-200 px-16 py-3 rounded-full font-medium hover:bg-black hover:text-white transition-all w-full sm:w-auto"
          >
            View All
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 border-t border-gray-100">
        <h2 className="text-3xl lg:text-5xl font-black text-center mb-12 lg:mb-16 italic uppercase">
          Top Selling
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {products.slice(4, 8).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
};















// import { useEffect } from 'react';
// import { useNavigate, useSearchParams, Link } from 'react-router-dom';
// import { useProducts } from '../hooks/useProducts';
// import { useAuth } from '../hooks/useAuth'; // Import your auth hook
// import ProductCard from '../components/ProductCard';

// export const Home = () => {
//   const { products, loading: productsLoading } = useProducts();
//   const { profile, loading: authLoading } = useAuth();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   // Check for admin status and preview flag
//   const isPreviewMode = searchParams.get('preview') === 'true';
//   const isAdmin = profile?.role === 'admin';

//   useEffect(() => {
//     // If Admin is logged in but NOT using the preview link, force them to Dashboard
//     if (!authLoading && isAdmin && !isPreviewMode) {
//       navigate('/admin/dashboard', { replace: true });
//     }
//   }, [isAdmin, authLoading, isPreviewMode, navigate]);

//   if (productsLoading || authLoading) {
//     return (
//       <div className="h-screen flex items-center justify-center uppercase tracking-widest text-xs font-bold">
//         <div className="animate-pulse">Loading Collection...</div>
//       </div>
//     );
//   }

//   return (
//     <main className="w-full relative">
//       {/* 1. ADMIN PREVIEW BANNER */}
//       {isAdmin && isPreviewMode && (
//         <div className="fixed top-0 left-0 w-full bg-yellow-400 text-black text-center py-2 z-[60] font-bold text-[10px] uppercase tracking-widest shadow-md flex justify-center items-center">
//           <span>Admin Preview Mode — Shopping & Checkout Disabled</span>
//           <button 
//             onClick={() => navigate('/admin/dashboard')}
//             className="ml-4 underline hover:text-gray-700 transition-colors"
//           >
//             Back to Dashboard
//           </button>
//         </div>
//       )}

//       {/* 2. HERO SECTION */}
//       {/* Dynamic padding-top ensures the banner doesn't cover the hero text */}
//       <section className={`bg-[#F2F0F1] pb-12 lg:pb-0 ${isAdmin && isPreviewMode ? 'pt-32' : 'pt-24 lg:pt-32'}`}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
//           {/* Text Side */}
//           <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8 mb-10 lg:mb-20">
//             <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight italic uppercase tracking-tighter">
//               Find clothes that matches your style
//             </h1>
//             <p className="text-gray-600 text-sm sm:text-base max-w-lg">
//               Browse through our diverse range of meticulously crafted garments, designed 
//               to bring out your individuality and cater to your sense of style.
//             </p>
//             <Link 
//               to="/shop" 
//               className="inline-block w-full sm:w-auto text-center bg-black text-white px-12 py-4 rounded-full font-bold hover:bg-gray-800 transition-all"
//             >
//               Shop Now
//             </Link>

//             {/* Mobile Stats */}
//             <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-6">
//               <div className="text-center lg:text-left">
//                 <h4 className="text-2xl lg:text-4xl font-bold">200+</h4>
//                 <p className="text-xs lg:text-sm text-gray-500">International Brands</p>
//               </div>
//               <div className="border-x border-gray-300 px-8 text-center lg:text-left">
//                 <h4 className="text-2xl lg:text-4xl font-bold">2,000+</h4>
//                 <p className="text-xs lg:text-sm text-gray-500">High-Quality Products</p>
//               </div>
//               <div className="text-center lg:text-left">
//                 <h4 className="text-2xl lg:text-4xl font-bold">30,000+</h4>
//                 <p className="text-xs lg:text-sm text-gray-500">Happy Customers</p>
//               </div>
//             </div>
//           </div>

//           {/* Image Side */}
//           <div className="w-full lg:w-1/2 relative">
//             <img 
//               src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80" 
//               alt="Streetwear Fashion" 
//               className="w-full h-auto object-cover lg:scale-110"
//             />
//           </div>
//         </div>
//       </section>

//       {/* 3. BRAND TICKER BAR */}
//       <div className="bg-black py-6 lg:py-10">
//         <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-around items-center gap-6 lg:gap-12 text-white font-bold text-xl lg:text-4xl opacity-90 tracking-widest italic">
//           <span>VERSACE</span>
//           <span>ZARA</span>
//           <span>GUCCI</span>
//           <span>PRADA</span>
//           <span>CALVIN KLEIN</span>
//         </div>
//       </div>

//       {/* 4. PRODUCT SECTION (NEW ARRIVALS) */}
//       <section className="max-w-7xl mx-auto px-4 py-16 lg:py-24">
//         <h2 className="text-3xl lg:text-5xl font-black text-center mb-12 lg:mb-16 italic uppercase">
//           New Arrivals
//         </h2>
        
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
//           {products.slice(0, 4).map(p => (
//             <ProductCard key={p.id} product={p} />
//           ))}
//         </div>

//         <div className="mt-12 text-center">
//           <Link 
//             to="/shop" 
//             className="inline-block border border-gray-200 px-16 py-3 rounded-full font-medium hover:bg-black hover:text-white transition-all w-full sm:w-auto"
//           >
//             View All
//           </Link>
//         </div>
//       </section>

//       {/* 5. TOP SELLING */}
//       <section className="max-w-7xl mx-auto px-4 py-16 border-t border-gray-100">
//         <h2 className="text-3xl lg:text-5xl font-black text-center mb-12 lg:mb-16 italic uppercase">
//           Top Selling
//         </h2>
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
//           {products.slice(4, 8).map(p => (
//             <ProductCard key={p.id} product={p} />
//           ))}
//         </div>
//       </section>
//     </main>
//   );
// };