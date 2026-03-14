import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../hooks/useAuth';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault(); 
    setIsRedirecting(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setIsRedirecting(false);
      return alert(error.message);
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profile?.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  useEffect(() => {
    if (!authLoading && user && !isRedirecting) {
      if (isAdmin) navigate('/admin/dashboard', { replace: true });
      else navigate('/', { replace: true });
    }
  }, [user, isAdmin, authLoading, navigate, isRedirecting]);

  if (authLoading || isRedirecting) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="text-white font-black uppercase tracking-[0.8em] animate-pulse text-[10px]">
          Decrypting Access...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen w-full bg-white flex flex-col lg:flex-row lg:overflow-hidden font-sans selection:bg-black selection:text-white">
      
      <div className="w-full lg:w-[50%] bg-black p-8 lg:p-16 flex flex-col justify-between lg:h-full relative overflow-hidden">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 text-white/[0.02] font-black text-[180px] italic pointer-events-none">S.CO</div>
        
        <div className="relative z-10 flex justify-between items-start">
          <h2 className="text-white text-xl font-black tracking-tighter uppercase">Shop.co</h2>
          <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.8em] lg:[writing-mode:vertical-lr]">
            v2.0 / 2026
          </span>
        </div>

        <div className="relative z-10 mt-12 lg:mt-0 space-y-6">
          <div className="h-[2px] w-12 bg-white"></div>
          <h3 className="text-white text-6xl lg:text-[100px] font-black uppercase italic tracking-tighter leading-[0.8]">
            SECURE <br /> ACCESS.
          </h3>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em] leading-relaxed max-w-[280px] border-l border-zinc-800 pl-4">
            Terminal connection established. Enter your security key to access the archive.
          </p>
        </div>

        <div className="hidden lg:flex justify-between items-end relative z-10">
          <div className="text-zinc-500 text-[8px] font-black uppercase tracking-[0.3em]">
            User Authentication // Protocol_04
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[50%] flex flex-col items-center justify-center p-8 lg:p-12 lg:h-full bg-white flex-grow">
        <div className="w-full max-w-[380px] animate-fade-in">
          
          <header className="mb-14 text-center">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-black mb-3 italic">
              Login
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-6 bg-zinc-100"></div>
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-300">
                Identity Verification
              </p>
              <div className="h-[1px] w-6 bg-zinc-100"></div>
            </div>
          </header>

          <form onSubmit={login} className="space-y-12">
            <div className="grid gap-y-10">
              <div className="group relative">
                <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-2 transition-all group-focus-within:text-black">
                  01. Digital Mail
                </label>
                <input
                  type="email"
                  placeholder="USER@SHOP.CO"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-zinc-100 py-3 outline-none focus:border-black transition-all duration-700 text-[12px] font-bold uppercase tracking-widest placeholder:text-zinc-200 rounded-none appearance-none"
                  required
                />
              </div>

              <div className="group relative">
                <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-2 transition-all group-focus-within:text-black">
                  02. Access Key
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-zinc-100 py-3 outline-none focus:border-black transition-all duration-700 text-[12px] font-bold uppercase tracking-widest placeholder:text-zinc-200 rounded-none appearance-none"
                  required
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-black text-white py-6 flex items-center justify-between px-10 group relative overflow-hidden transition-all duration-500 active:scale-[0.98]"
              >
                <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.6em]">
                  Verify & Access
                </span>
                <span className="relative z-10 text-xl transform group-hover:translate-x-3 transition-transform duration-500">→</span>
                <div className="absolute inset-0 bg-zinc-800 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              </button>

              <div className="mt-12 text-center border-t border-zinc-50 pt-8">
                <button 
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="group inline-flex flex-col items-center"
                >
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 group-hover:text-black transition-colors mb-2">
                    Need new credentials?
                  </span>
                  <h2>Reset Password</h2>

<p>Follow this link to reset the password for your user:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
                  <span className="text-[11px] font-black uppercase italic text-black border-b-2 border-black pb-1 hover:text-zinc-400 hover:border-zinc-200 transition-all">
                    Register Account
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: black;
          -webkit-box-shadow: 0 0 0px 1000px white inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
}

