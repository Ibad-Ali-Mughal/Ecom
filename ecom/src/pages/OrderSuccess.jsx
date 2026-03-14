import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export const OrderSuccess = () => {
  
  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative mx-auto w-24 h-24 bg-black rounded-full flex items-center justify-center">
          <svg 
            className="w-12 h-12 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
            Order Placed
          </h1>
          <p className="text-zinc-500 text-sm font-medium leading-relaxed">
            Thank you for your purchase. Your order has been received and is being processed. 
          </p>
        </div>

        <div className="pt-8 flex flex-col gap-4">
          <Link 
            to="/shop" 
            className="w-full bg-black text-white py-5 rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-zinc-800 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
};

export default OrderSuccess;