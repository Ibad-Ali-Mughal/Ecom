import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import { supabase } from '../../supabaseClient';
import { FiTrash, FiImage, FiPlus, FiX, FiPercent, FiArrowLeft, FiSave,FiCheckCircle } from 'react-icons/fi';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateProduct, loading } = useAdmin();
  
  const [categories, setCategories] = useState([]);
  const [fetching, setFetching] = useState(true);

  const [isMultiColor, setIsMultiColor] = useState(false);
  const [productColors, setProductColors] = useState(['BLACK', 'WHITE', 'RED', 'BLUE']); 
  const [selectedColor, setSelectedColor] = useState('BLACK');
  const [newColorInput, setNewColorInput] = useState('');
  const [imgUrl, setImgUrl] = useState("");

  const [tempSize, setTempSize] = useState('');
  const [tempStock, setTempStock] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category_id: '',
    discount: 0,
    colors: {}, 
  });

  const [variants, setVariants] = useState([]);

  useEffect(() => {
    async function loadProduct() {
      setFetching(true);
      try {
        const { data: catData } = await supabase.from('categories').select('id, name').order('name');
        setCategories(catData || []);

        const { data: prod, error } = await supabase
          .from('products')
          .select(`*, product_variants(*)`)
          .eq('id', id)
          .single();

        if (error) throw error;

        const existingColors = prod.colors || { Default: prod.images || [] };
        
        setFormData({
          ...prod, // Keep original data for stripping later
          title: prod.title,
          price: prod.price,
          description: prod.description || '',
          category_id: prod.category_id,
          discount: prod.discount_percent || 0,
          colors: existingColors
        });

        setVariants(prod.product_variants || []);

        const uniqueColors = [...new Set(prod.product_variants.map(v => v.color))].filter(Boolean);
        if (uniqueColors.length > 0 && !uniqueColors.includes('Default')) {
          setIsMultiColor(true);
          setProductColors(prev => [...new Set([...prev, ...uniqueColors])]);
          setSelectedColor(uniqueColors[0]);
        } else {
          setIsMultiColor(false);
          setSelectedColor('Default');
        }

      } catch (err) {
        console.error("Fetch error:", err.message);
      } finally {
        setFetching(false);
      }
    }
    loadProduct();
  }, [id]);

  const activeKey = isMultiColor ? selectedColor : 'Default';

  const addImageByURL = (e) => {
    e.preventDefault(); 
    if (!imgUrl.trim()) return;
    setFormData(prev => ({
      ...prev,
      colors: { 
        ...prev.colors, 
        [activeKey]: [...(prev.colors[activeKey] || []), imgUrl.trim()] 
      }
    }));
    setImgUrl("");
  };

  const removeImage = (colorKey, index) => {
    const updated = [...formData.colors[colorKey]];
    updated.splice(index, 1);
    setFormData({ ...formData, colors: { ...formData.colors, [colorKey]: updated } });
  };

  const handleAddColor = () => {
    const color = newColorInput.toUpperCase().trim();
    if (color && !productColors.includes(color)) {
      setProductColors([...productColors, color]);
      setSelectedColor(color);
      setNewColorInput("");
    }
  };

  const addVariant = () => {
    if (!tempSize || !tempStock) return;
    setVariants([...variants, { 
      color: activeKey, 
      name: tempSize.toUpperCase(), 
      size: tempSize.toUpperCase(),
      stock: Number(tempStock), 
      variant_type: 'size' 
    }]);
    setTempSize(''); setTempStock('');
  };

  const handleUpdate = async () => {
    if (!formData.title || !formData.price) return alert("Title and Price are required");

    const allImages = Object.values(formData.colors).flat();
    
    const processedVariants = variants.map(v => ({
        product_id: id,
        variant_type: v.variant_type || 'size',
        name: v.name,
        size: v.size || v.name,
        stock: Number(v.stock),
        color: v.color
    }));

    const { 
      colors, 
      discount, 
      updated_at, 
      created_at, 
      product_variants, 
      id: prodId, 
      ...restOfData 
    } = formData;

    const finalProductPayload = {
      ...restOfData,
      images: allImages,
      discount_percent: Number(discount)
    };

    const res = await updateProduct(id, finalProductPayload, processedVariants);

    if (res.success) {
      alert("Database Synced Successfully!");
      navigate('/admin/dashboard/inventory'); 
    } else {
      alert("Error: " + res.error);
    }
  };

  if (fetching) return <div className="h-screen flex items-center justify-center font-black uppercase italic animate-pulse">Retrieving Product Data...</div>;


  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-4 bg-gray-50 rounded-full hover:bg-black hover:text-white transition-all">
            <FiArrowLeft />
          </button>
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">Edit Product</h1>
            <p className="text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase">Product ID: {id}</p>
          </div>
        </div>
        
        <button 
          onClick={handleUpdate}
          disabled={loading}
          className="flex items-center gap-3 bg-black text-white px-10 py-4 rounded-full font-black uppercase italic tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl disabled:bg-gray-300"
        >
          <FiSave size={20}/> {loading ? "Syncing..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-10">
          
          <section className="space-y-4">
             <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">1. Color Configuration</h2>
             <div className="p-6 bg-gray-50 rounded-[32px] flex justify-between items-center border border-gray-100">
                <div>
                    <p className="text-xs font-black uppercase">Enable Color Variants</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase italic">Switch on for color-specific image galleries</p>
                </div>
                <input 
                    type="checkbox" 
                    className="w-6 h-6 accent-black cursor-pointer" 
                    checked={isMultiColor} 
                    onChange={(e) => {
                        setIsMultiColor(e.target.checked);
                        setSelectedColor(e.target.checked ? 'BLACK' : 'Default');
                    }} 
                />
             </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">2. Media Gallery — {activeKey}</h2>
            
            <div className="flex flex-wrap gap-2 items-center mb-4">
                {isMultiColor && productColors.map(color => (
                    <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${
                            selectedColor === color ? 'bg-black text-white shadow-lg' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                    >
                        {color}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-gray-200 rounded-[32px] p-8 flex flex-col items-center justify-center bg-gray-50">
                <FiImage className="text-gray-300 mb-4" size={30} />
                <div className="w-full space-y-1 mb-3">
                    <label className="text-[9px] font-black uppercase text-gray-400 ml-2">Image URL</label>
                    <input 
                        value={imgUrl} 
                        onChange={e => setImgUrl(e.target.value)}
                        placeholder="https://..." 
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 ring-black"
                    />
                </div>
                <button onClick={addImageByURL} className="w-full bg-black text-white py-3 rounded-xl text-[10px] font-black uppercase hover:opacity-90">
                  Add to {activeKey} Gallery
                </button>
              </div>

              <div className="flex md:grid md:grid-cols-2 gap-3 overflow-x-auto p-1">
                {(formData.colors[activeKey] || []).map((url, i) => (
                  <div key={i} className="relative group aspect-square">
                    <img src={url} className="w-full h-full object-cover rounded-[24px] border border-gray-100 shadow-sm" alt="prod" />
                    <button 
                      onClick={() => removeImage(activeKey, i)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">3. Product Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-8 rounded-[32px]">
              
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Product Title</label>
                <input 
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none font-bold text-gray-700 focus:ring-2 ring-black transition-all"
                    value={formData.title} 
                    onChange={e => setFormData({ ...formData, title: e.target.value })} 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Category</label>
                <select 
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none font-bold text-gray-500 cursor-pointer"
                    value={formData.category_id} 
                    onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                >
                    <option value="">Uncategorized</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Base Price (PKR)</label>
                <input 
                    type="number"
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none font-bold focus:ring-2 ring-black"
                    value={formData.price} 
                    onChange={e => setFormData({ ...formData, price: e.target.value })} 
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Description</label>
                <textarea 
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none font-medium text-gray-600 h-32 resize-none focus:ring-2 ring-black"
                    value={formData.description} 
                    onChange={e => setFormData({ ...formData, description: e.target.value })} 
                />
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <section className="space-y-4">
             <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">4. Stock & Variants</h2>
             <div className="bg-zinc-900 rounded-[40px] p-8 text-white shadow-2xl sticky top-10">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                    <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em]">
                        Editing: {activeKey}
                    </h3>
                    <FiCheckCircle className="text-green-500" />
                </div>
                
                <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-zinc-500 uppercase ml-1">Size Name</label>
                        <input 
                            placeholder="e.g. XL" 
                            className="w-full bg-zinc-800 p-4 rounded-2xl text-sm font-bold border-none outline-none focus:ring-1 ring-zinc-500"
                            value={tempSize}
                            onChange={e => setTempSize(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-zinc-500 uppercase ml-1">Stock Count</label>
                        <input 
                            placeholder="0" 
                            type="number"
                            className="w-full bg-zinc-800 p-4 rounded-2xl text-sm font-bold border-none outline-none focus:ring-1 ring-zinc-500"
                            value={tempStock}
                            onChange={e => setTempStock(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={addVariant}
                        className="col-span-2 bg-white text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95"
                    >
                        Add Size to {activeKey}
                    </button>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {variants.filter(v => v.color === activeKey).map((v, i) => (
                    <div key={i} className="flex justify-between items-center bg-zinc-800/50 p-4 rounded-2xl border border-white/5 group">
                        <div>
                        <p className="text-xs font-black uppercase">{v.name}</p>
                        <p className="text-[9px] text-zinc-500 font-bold">{v.stock} UNITS</p>
                        </div>
                        <button 
                        onClick={() => setVariants(variants.filter(item => item !== v))}
                        className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
                        >
                        <FiTrash size={14} />
                        </button>
                    </div>
                    ))}
                </div>
                </div>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}