import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone } }
    });
    if (error) { alert(error.message); } 
    else { navigate('/login'); }
    setLoading(false);
  };

  return (

    
    <div className="min-h-screen lg:h-screen w-full bg-white flex flex-col lg:flex-row lg:overflow-hidden font-sans selection:bg-black selection:text-white">
      
      <div className="w-full lg:w-[50%] bg-black p-8 lg:p-16 flex flex-col justify-between lg:h-full relative overflow-hidden">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 text-white/[0.03] font-black text-[150px] italic lg:hidden">S.CO</div>
        
        <div className="relative z-10 flex justify-between items-start">
          <h2 className="text-white text-xl font-black tracking-tighter uppercase">Shop.co</h2>
          <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.8em] lg:[writing-mode:vertical-lr]">
            v2.0 / 2026
          </span>
        </div>

        <div className="relative z-10 mt-12 lg:mt-0 space-y-4">
          <div className="h-[1px] w-12 bg-white/30"></div>
          <h3 className="text-white text-5xl lg:text-[90px] font-black uppercase italic tracking-tighter leading-[0.8]">
            THE <br /> ARCHIVE.
          </h3>
          <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-[0.4em] leading-relaxed max-w-[240px]">
            System access granted. Enter identity credentials to continue.
          </p>
        </div>

        <div className="hidden lg:flex justify-between items-end relative z-10">
          <div className="text-zinc-300 text-[8px] font-black uppercase tracking-[0.3em]">
            Terminal 01 // Secure Connection
          </div>
          <div className="text-white/10 font-black text-8xl italic -mb-8 select-none">
            S.CO
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[50%] flex flex-col items-center justify-center p-6 md:p-12 lg:h-full bg-white flex-grow">
        <div className="w-full max-w-[380px] animate-fade-in py-10">
          
          <header className="mb-10 lg:mb-12 text-center">
            <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter text-black mb-2 italic">
              Register
            </h1>
            <div className="flex items-center justify-center gap-2">
              <div className="h-[1px] w-4 bg-zinc-200"></div>
              <p className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-300">
                Identity Acquisition
              </p>
              <div className="h-[1px] w-4 bg-zinc-200"></div>
            </div>
          </header>

          <form onSubmit={handleSignup} className="space-y-6 lg:space-y-8">
            <div className="grid gap-y-6 lg:gap-y-7">
              {[
                { label: '01. Full Name', state: name, set: setName, type: 'text', ph: 'JOHN DOE' },
                { label: '02. Mobile', state: phone, set: setPhone, type: 'tel', ph: '+00 000 000' },
                { label: '03. Email', state: email, set: setEmail, type: 'email', ph: 'USER@SHOP.CO' },
                { label: '04. Password', state: password, set: setPassword, type: 'password', ph: '••••••••' }
              ].map((field, i) => (
                <div key={i} className="group relative">
                  <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-1 transition-all group-focus-within:text-black">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.ph}
                    value={field.state}
                    onChange={e => field.set(e.target.value)}
                    className="w-full bg-transparent border-b border-zinc-100 py-2 outline-none focus:border-black transition-all duration-500 text-[11px] font-bold uppercase tracking-widest placeholder:text-zinc-200 appearance-none rounded-none"
                    required
                  />
                </div>
              ))}
            </div>

            <div className="pt-4 lg:pt-6">
              <button
                disabled={loading}
                type="submit"
                className="w-full bg-black text-white py-4 lg:py-5 group relative overflow-hidden transition-all duration-500 active:scale-[0.99]"
              >
                <span className="relative z-10 text-[9px] font-black uppercase tracking-[0.5em]">
                  {loading ? 'Processing...' : 'Confirm Identity'}
                </span>
                <div className="absolute inset-0 bg-zinc-800 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              </button>

              <div className="mt-8 lg:mt-10 text-center">
                <button 
                  type="button"
                  onClick={() => navigate('/login')}
                  className="group inline-flex flex-col items-center"
                >
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 group-hover:text-black transition-colors mb-1">
                    Registered?
                  </span>
                  <span className="text-[10px] font-black uppercase italic text-black border-b border-black pb-0.5 group-hover:text-zinc-400 transition-all">
                    Sign In
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        /* Removes iOS input styling */
        input {
          -webkit-appearance: none;
          border-radius: 0;
        }
      `}</style>
    </div>
  );
}