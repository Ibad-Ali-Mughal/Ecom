





import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FiPlusSquare, FiShoppingBag, FiTrendingUp, FiLogOut, FiBox, FiExternalLink, FiMenu, FiX } from 'react-icons/fi';
import { supabase } from '../supabaseClient';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    localStorage.removeItem('isAdmin');
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black text-white flex items-center justify-between px-6 z-50">
        <h1 className="text-xl font-black italic tracking-tighter uppercase">Shop.CO</h1>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-zinc-800 rounded-lg"
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <aside className={`
        w-64 bg-black text-white p-8 flex flex-col fixed h-full z-[60] transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0
      `}>
        <h1 className="text-2xl font-black italic uppercase mb-12 tracking-tighter hidden lg:block">Shop.CO</h1>
        
        <div className="lg:hidden flex justify-end mb-8">
            <button onClick={closeMenu} className="text-gray-400"><FiX size={24}/></button>
        </div>

        <nav className="flex-1 space-y-2">
          <NavLink to="/admin/dashboard/earnings" icon={<FiTrendingUp />} label="Earnings" onClick={closeMenu} active={location.pathname.includes('earnings')} />
          <NavLink to="/admin/dashboard/add-product" icon={<FiPlusSquare />} label="Add Product" onClick={closeMenu} active={location.pathname.includes('add-product')} />
          <NavLink to="/admin/dashboard/orders" icon={<FiShoppingBag />} label="Manage Orders" onClick={closeMenu} active={location.pathname.includes('orders')} />
          <NavLink to="/admin/dashboard/inventory" icon={<FiBox />} label="Inventory" onClick={closeMenu} active={location.pathname.includes('inventory')} />
        </nav>

        <div className="mt-auto border-t border-zinc-800 pt-6 space-y-4">
          <button 
            onClick={() => { navigate('/?preview=true', { replace: true }); closeMenu(); }} 
            className="flex items-center gap-3 text-blue-400 hover:text-blue-300 transition w-full text-left"
          >
            <FiExternalLink /> 
            <span className="text-[10px] font-bold uppercase tracking-widest">See Live Site</span>
          </button>

          <button onClick={handleLogout} className="flex items-center gap-3 text-gray-500 hover:text-white transition w-full group">
            <FiLogOut className="group-hover:text-red-400 transition-colors" /> 
            <span className="text-xs font-bold uppercase">Logout</span>
          </button>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] lg:hidden"
          onClick={closeMenu}
        />
      )}

      <main className={`flex-1 transition-all duration-300 ${isMobileMenuOpen ? 'blur-sm lg:blur-none' : ''} lg:ml-64`}>
        <div className="p-4 lg:p-8 mt-16 lg:mt-0 min-h-screen">
          <div className="bg-white min-h-[calc(100vh-64px)] rounded-[30px] lg:rounded-[40px] shadow-sm overflow-hidden border border-gray-100">
            <Outlet /> 
          </div>
        </div>
      </main>
    </div>
  );
}

function NavLink({ to, icon, label, onClick, active }) {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ${
        active 
        ? 'bg-zinc-900 text-white shadow-lg' 
        : 'text-gray-500 hover:text-white hover:bg-zinc-950'
      }`}
    >
      <span className={active ? 'text-white' : 'text-zinc-600'}>{icon}</span>
      <span className="text-[11px] font-black uppercase tracking-[0.1em]">{label}</span>
    </Link>
  );
}