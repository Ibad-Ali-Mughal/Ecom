

import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiArrowLeft,
  FiChevronRight,
  FiPackage,
  FiSettings
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useAdmin } from '../hooks/useAdmin';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isPreview = new URLSearchParams(location.search).get('preview') === 'true';
  const hasAdminStorage = localStorage.getItem('isAdmin') === 'true';
  const showAdminControls = isAdmin && (isPreview || hasAdminStorage);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('isAdmin');
      await signOut();
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getSafeLink = (path) => {
    if (showAdminControls) {
      const separator = path.includes('?') ? '&' : '?';
      return `${path}${separator}preview=true`;
    }
    return path;
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white border-b border-gray-100 h-16">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-1" onClick={() => setIsMenuOpen(true)}>
              <FiMenu size={24} />
            </button>
            <Link to={getSafeLink("/")} className="font-black text-2xl tracking-tighter uppercase">
              SHOP.CO
            </Link>
          </div>

          <nav className="hidden lg:flex gap-6 text-sm font-bold uppercase tracking-wider">
            <Link to={getSafeLink("/shop")} className="hover:text-gray-500 transition">Shop</Link>
            <Link to={getSafeLink("/on-sale")} className="hover:text-gray-500 transition">On Sale</Link>
            <Link to={getSafeLink("/new-arrivals")} className="hover:text-gray-500 transition">New Arrivals</Link>
          </nav>

          <div className="flex-1 max-w-md hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
            <FiSearch className="text-gray-400 mr-2" />
            <input type="text" placeholder="Search for products..." className="bg-transparent outline-none text-sm w-full" />
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            {!showAdminControls && (
              <Link to={getSafeLink("/cart")} className="relative p-1">
                <FiShoppingCart size={22} />
              </Link>
            )}
            
            {showAdminControls ? (
              <Link to="/admin/dashboard" className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase hover:bg-zinc-800 transition-all">
                <FiArrowLeft size={14} /> Dashboard
              </Link>
            ) : (
              !user ? (
                <Link 
                  to="/login" 
                  className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-sm active:scale-95"
                >
                  <FiUser size={14} />
                  <span className="hidden sm:inline">Login / Signup</span>
                </Link>
              ) : (
                <div className="relative" ref={userMenuRef}>
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-1.5 bg-gray-50 rounded-full hover:bg-gray-100 transition border border-gray-100"
                  >
                    <FiUser size={22} />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[70]">
                      <div className="p-4 bg-gray-50/50 border-b border-gray-100">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Logged in as</p>
                        <p className="text-sm font-bold truncate text-zinc-800">{user.email}</p>
                      </div>

                      <div className="p-2">
                        <DropdownItem 
                          to={getSafeLink("/account")} 
                          icon={<FiSettings />} 
                          label="Personal Details" 
                          onClick={() => setIsUserMenuOpen(false)} 
                        />
                        <DropdownItem 
                          to={getSafeLink("/account")} 
                          icon={<FiPackage />} 
                          label="Order History" 
                          onClick={() => setIsUserMenuOpen(false)} 
                        />
                        <hr className="my-2 border-gray-50" />
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-bold uppercase tracking-wider"
                        >
                          <FiLogOut />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </header>

      <div className={`fixed inset-0 z-[100] lg:hidden transition-all duration-300 ${isMenuOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={closeMenu} />
        <div className={`absolute top-0 left-0 w-[280px] h-full bg-white transition-transform duration-300 shadow-2xl ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <span className="font-black text-xl tracking-tighter uppercase">Menu</span>
              <button onClick={closeMenu} className="p-2 hover:bg-gray-100 rounded-full">
                <FiX size={20} />
              </button>
            </div>
            
            <nav className="flex-1 p-4 flex flex-col gap-2">
              <MobileLink to={getSafeLink("/shop")} label="Shop" onClick={closeMenu} />
              <MobileLink to={getSafeLink("/on-sale")} label="On Sale" onClick={closeMenu} />
              <MobileLink to={getSafeLink("/new-arrivals")} label="New Arrivals" onClick={closeMenu} />
              <hr className="my-2 border-gray-50" />
              {user && (
                <>
                   <MobileLink to={getSafeLink("/account")} label="My Account" onClick={closeMenu} />
                   <MobileLink to={getSafeLink("/cart")} label="Cart" onClick={closeMenu} />
                </>
              )}
            </nav>

            <div className="p-6 bg-gray-50">
               {!user ? (
                 <Link to="/login" onClick={closeMenu} className="w-full block bg-black text-white text-center py-4 rounded-xl font-bold uppercase text-xs tracking-widest">
                   Sign In
                 </Link>
               ) : (
                 <button onClick={handleLogout} className="w-full text-red-500 font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2">
                   <FiLogOut /> Logout
                 </button>
               )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function MobileLink({ to, label, onClick }) {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-xl text-sm font-black uppercase tracking-widest transition-colors"
    >
      {label}
      <FiChevronRight className="text-gray-300" />
    </Link>
  );
}

function DropdownItem({ to, icon, label, onClick }) {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-xl transition-colors text-sm font-bold uppercase tracking-wider text-zinc-600 hover:text-black"
    >
      <span className="text-gray-400">{icon}</span>
      {label}
    </Link>
  );
}




























// import { useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import {
//   FiSearch,
//   FiShoppingCart,
//   FiUser,
//   FiMenu,
//   FiX,
//   FiLogOut,
//   FiArrowLeft
// } from 'react-icons/fi';
// import { useAuth } from '../hooks/useAuth';
// import { useAdmin } from '../hooks/useAdmin'; // Import this to get the real isAdmin status

// export default function Header() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const { user, signOut } = useAuth();
//   const { isAdmin } = useAdmin(); // Get the truth about admin status
//   const location = useLocation();
//   const navigate = useNavigate();

//   const isPreview = new URLSearchParams(location.search).get('preview') === 'true';
//   const hasAdminStorage = localStorage.getItem('isAdmin') === 'true';
  
//   // Show admin controls ONLY if they are actually an admin
//   const showAdminControls = isAdmin && (isPreview || hasAdminStorage);

//   // 🚀 FIXED LOGOUT: Clears everything and redirects
//   const handleLogout = async () => {
//     try {
//       localStorage.removeItem('isAdmin'); // Clear admin hint
//       await signOut(); // Call supabase signout
//       navigate('/'); // Redirect to home
//       window.location.reload(); // Force a refresh to clear all states
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   const getSafeLink = (path) => {
//     if (showAdminControls) {
//       const separator = path.includes('?') ? '&' : '?';
//       return `${path}${separator}preview=true`;
//     }
//     return path;
//   };

//   return (
//     <header className="fixed top-0 w-full z-50 bg-white border-b border-gray-100 h-16">
//       <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
        
//         {/* Logo */}
//         <div className="flex items-center gap-4">
//           <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
//             {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
//           </button>
//           <Link to={getSafeLink("/")} className="font-black text-2xl tracking-tighter uppercase">
//             SHOP.CO
//           </Link>
//         </div>

//         {/* Navigation */}
//         <nav className="hidden lg:flex gap-6 text-sm font-medium">
//           <Link to={getSafeLink("/shop")}>Shop</Link>
//           <Link to={getSafeLink("/on-sale")}>On Sale</Link>
//           <Link to={getSafeLink("/new-arrivals")}>New Arrivals</Link>
//         </nav>

//         {/* Search Bar */}
//         <div className="flex-1 max-w-md hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
//           <FiSearch className="text-gray-400 mr-2" />
//           <input type="text" placeholder="Search..." className="bg-transparent outline-none text-sm w-full" />
//         </div>

//         {/* Right Side Icons */}
//         <div className="flex items-center gap-4">
//           {!showAdminControls && (
//             <Link to={getSafeLink("/cart")}>
//               <FiShoppingCart size={22} />
//             </Link>
//           )}

//           {showAdminControls ? (
//             <Link 
//               to="/admin/dashboard" 
//               className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase hover:bg-zinc-800 transition"
//             >
//               <FiArrowLeft size={14} /> 
//               <span>Back to Dashboard</span>
//             </Link>
//           ) : (
//             !user ? (
//               <Link to="/login"><FiUser size={22} /></Link>
//             ) : (
//               <div className="flex items-center gap-4">
//                  <Link to="/account"><FiUser size={22} /></Link>
//                  <button onClick={handleLogout} className="text-red-500 cursor-pointer">
//                     <FiLogOut size={20}/>
//                  </button>
//               </div>
//             )
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }