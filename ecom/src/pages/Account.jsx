import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../supabaseClient';
import { formatPKR } from '../utils/formatPrice';
import { FiUser, FiPackage, FiMapPin, FiMail, FiChevronDown, FiChevronUp, FiPhone, FiEdit2, FiX, FiCheck } from 'react-icons/fi';

export const Account = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editForm, setEditForm] = useState({ 
    name: '', 
    line1: '', 
    city: '', 
    zip: '', 
    state: '',
    phone: '' 
  });

  useEffect(() => {
    if (user) fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const [profileRes, ordersRes] = await Promise.all([
        supabase.from('profiles').select('name, addresses(id, line1, city, zip, state, phone)').eq('id', user.id).single(),
        supabase.from('orders').select(`
            id, total_amount, status, created_at, shipping_phone,
            order_items ( qty, unit_price, product_variants ( name, products ( title ) ) )
          `).eq('user_id', user.id).order('created_at', { ascending: false })
      ]);

      const prof = profileRes.data;
      const addr = prof?.addresses?.[0];

      setProfile(prof);
      setEditForm({
        name: prof?.name || '',
        line1: addr?.line1 || '',
        city: addr?.city || '',
        zip: addr?.zip || '',
        state: addr?.state || '',
        phone: addr?.phone || ''
      });
      setOrders(ordersRes.data || []);
    } catch (error) {
      console.error("Account Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await supabase.from('profiles').update({ name: editForm.name }).eq('id', user.id);

      if (profile?.addresses?.[0]?.id) {
        await supabase.from('addresses')
          .update({ 
            line1: editForm.line1, 
            city: editForm.city, 
            zip: editForm.zip, 
            state: editForm.state,
            phone: editForm.phone 
          })
          .eq('id', profile.addresses[0].id);
      } else {
        await supabase.from('addresses').insert([{
          user_id: user.id,
          line1: editForm.line1,
          city: editForm.city,
          zip: editForm.zip,
          state: editForm.state,
          phone: editForm.phone,
          is_default: true
        }]);
      }

      await fetchUserData(); 
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="pt-40 text-center font-black uppercase italic animate-pulse">Loading Account...</div>;

  return (
    <div className="pt-32 px-6 max-w-6xl mx-auto pb-20">
      
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[40px] p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button onClick={() => setIsEditing(false)} className="absolute top-8 right-8 text-zinc-400 hover:text-black transition-colors">
              <FiX size={24}/>
            </button>
            
            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8">Edit Shipping Profile</h3>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid gap-4">
                <InputGroup label="Full Name" value={editForm.name} onChange={v => setEditForm({...editForm, name: v})} />
                <InputGroup label="Phone Number" value={editForm.phone} onChange={v => setEditForm({...editForm, phone: v})} />
                <InputGroup label="Street Address" value={editForm.line1} onChange={v => setEditForm({...editForm, line1: v})} />
                
                <div className="grid grid-cols-2 gap-4">
                   <InputGroup label="City" value={editForm.city} onChange={v => setEditForm({...editForm, city: v})} />
                   <InputGroup label="Zip Code" value={editForm.zip} onChange={v => setEditForm({...editForm, zip: v})} />
                </div>
                <InputGroup label="State / Province" value={editForm.state} onChange={v => setEditForm({...editForm, state: v})} />
              </div>

              <button 
                type="submit" 
                disabled={updating}
                className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] mt-6 flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all"
              >
                {updating ? 'Processing...' : <><FiCheck /> Update Details</>}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Profile</h2>
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-[10px] font-black uppercase bg-zinc-100 px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all">
               <FiEdit2 /> Edit
            </button>
          </div>

          <div className="bg-zinc-50 p-8 rounded-[32px] border border-zinc-100 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-black italic text-xl">
                {profile?.name?.charAt(0)}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-400">Welcome back,</p>
                <p className="font-bold text-lg">{profile?.name}</p>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-zinc-200">
               <DetailItem icon={<FiMail />} label="Email" value={user?.email} />
               <DetailItem icon={<FiPhone />} label="Phone" value={profile?.addresses?.[0]?.phone} />
               <DetailItem 
                  icon={<FiMapPin />} 
                  label="Shipping to" 
                  value={`${profile?.addresses?.[0]?.line1}, ${profile?.addresses?.[0]?.city}`} 
               />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
           <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6">Order History</h2>
           {orders.map(order => (
             <OrderCard key={order.id} order={order} expandedOrder={expandedOrder} setExpandedOrder={setExpandedOrder} />
           ))}
        </div>
      </div>
    </div>
  );
};


const InputGroup = ({ label, value, onChange }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black uppercase text-zinc-400 ml-2">{label}</label>
    <input 
      required 
      className="p-4 bg-zinc-50 rounded-2xl w-full border-none focus:ring-2 focus:ring-black font-bold text-sm" 
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-zinc-400">{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase text-zinc-400 leading-tight">{label}</p>
        <p className="text-sm font-bold text-zinc-800">{value || 'Not set'}</p>
      </div>
    </div>
);

const OrderCard = ({ order, expandedOrder, setExpandedOrder }) => (
    <div className="bg-white rounded-[24px] border border-zinc-100 overflow-hidden mb-4 hover:border-zinc-300 transition-all">
      <div className="p-6 flex justify-between items-center">
        <div>
           <p className="text-[10px] font-mono text-zinc-400">ORDER #{order.id.slice(0,8)}</p>
           <p className="text-lg font-black italic">{formatPKR(order.total_amount)}</p>
        </div>
        <div className="flex items-center gap-3">
           <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase bg-zinc-100`}>{order.status}</span>
           <button onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)} className="p-2 bg-zinc-50 rounded-full hover:bg-black hover:text-white transition-colors">
              {expandedOrder === order.id ? <FiChevronUp /> : <FiChevronDown />}
           </button>
        </div>
      </div>
      {expandedOrder === order.id && (
         <div className="px-6 pb-6 pt-2 bg-zinc-50/50 border-t border-zinc-100">
            {order.order_items.map((item, i) => (
                <div key={i} className="flex justify-between py-2 text-sm border-b border-zinc-100 last:border-0">
                    <span className="font-bold">{item.product_variants.products.title} <span className="text-zinc-400 text-xs">x{item.qty}</span></span>
                    <span className="font-mono text-xs">{formatPKR(item.unit_price)}</span>
                </div>
            ))}
         </div>
      )}
    </div>
);