// import { useState } from 'react';
// import { useAdmin } from '../../hooks/useAdmin';
// import { FiPlus, FiTrash, FiImage } from 'react-icons/fi';

// export default function AddProduct() {
//   const { publishProduct, loading } = useAdmin();
//   const [formData, setFormData] = useState({ title: '', price: '', description: '', images: [], category_id: '' });
//   const [variants, setVariants] = useState([{ variant_type: 'size', name: 'Medium', stock: 10 }]);
//   const [imgUrl, setImgUrl] = useState("");

//   const addImage = () => {
//     if (imgUrl) {
//       setFormData({ ...formData, images: [...formData.images, imgUrl] });
//       setImgUrl("");
//     }
//   };

//   const handlePublish = async () => {
//     const res = await publishProduct(formData, variants);
//     if (res.success) alert("Published Successfully!");
//     else alert("Error: " + res.error);
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-6 space-y-8 pb-20">
//       <h1 className="text-3xl font-black italic uppercase">Add New Product</h1>

//       {/* Horizontal Image Preview */}
//       <div className="flex gap-4 overflow-x-auto p-6 bg-gray-50 rounded-[20px] border-2 border-dashed border-gray-200">
//         {formData.images.map((url, i) => (
//           <div key={i} className="relative min-w-[150px]">
//             <img src={url} className="w-full h-48 object-cover rounded-xl shadow-md" alt="Preview" />
//             <button onClick={() => setFormData({...formData, images: formData.images.filter((_, idx) => idx !== i)})} 
//               className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><FiTrash size={12}/></button>
//           </div>
//         ))}
//         <div className="min-w-[200px] h-48 flex flex-col items-center justify-center bg-white rounded-xl border p-4 gap-2">
//           <FiImage className="text-gray-300" size={32} />
//           <input value={imgUrl} onChange={e => setImgUrl(e.target.value)} placeholder="Paste URL" className="text-xs w-full p-2 border rounded" />
//           <button onClick={addImage} className="bg-black text-white px-4 py-1 rounded-full text-xs font-bold">Add Image</button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="space-y-4">
//           <label className="font-bold text-sm uppercase">Basic Details</label>
//           <input placeholder="Title" className="w-full p-4 bg-[#F0F0F0] rounded-xl" onChange={e => setFormData({...formData, title: e.target.value})} />
//           <input placeholder="Price (PKR)" type="number" className="w-full p-4 bg-[#F0F0F0] rounded-xl" onChange={e => setFormData({...formData, price: e.target.value})} />
//           <textarea placeholder="Description" className="w-full p-4 bg-[#F0F0F0] rounded-xl h-32" onChange={e => setFormData({...formData, description: e.target.value})} />
//         </div>

//         <div className="space-y-4">
//           <label className="font-bold text-sm uppercase">Inventory & Variants</label>
//           <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-3">
//             {variants.map((v, i) => (
//               <div key={i} className="flex gap-2">
//                 <input placeholder="Size" className="flex-1 p-3 bg-gray-50 rounded-lg" onChange={e => {
//                   let newV = [...variants]; newV[i].name = e.target.value; setVariants(newV);
//                 }} />
//                 <input placeholder="Stock" type="number" className="w-24 p-3 bg-gray-50 rounded-lg" onChange={e => {
//                   let newV = [...variants]; newV[i].stock = parseInt(e.target.value); setVariants(newV);
//                 }} />
//               </div>
//             ))}
//             <button onClick={() => setVariants([...variants, { variant_type: 'size', name: '', stock: 0 }])} className="text-xs font-bold text-gray-400">+ ADD SIZE</button>
//           </div>
//         </div>
//       </div>

//       <button onClick={handlePublish} disabled={loading} className="w-full bg-black text-white py-5 rounded-full font-black uppercase italic tracking-widest hover:bg-zinc-800 transition-all">
//         {loading ? "Processing..." : "Publish Product Live"}
//       </button>
//     </div>
//   );
// }





// import { useState } from 'react';
// import { useAdmin } from '../../hooks/useAdmin';
// import { FiPlus, FiTrash, FiImage } from 'react-icons/fi';

// export default function AddProduct() {
//   const { publishProduct, loading } = useAdmin();

//   const [formData, setFormData] = useState({
//     title: '',
//     price: '',
//     description: '',
//     category_id: '',
//     discount: 0,
//     colors: {}, // { black: [url1,url2], red: [url3] }
//   });

//   const [selectedColor, setSelectedColor] = useState('');
//   const [variants, setVariants] = useState([]); // { color, size, stock }

//   const [imgUrl, setImgUrl] = useState("");

//   // Add image to current selected color
//   const addImage = () => {
//     if (!selectedColor) return alert("Select a color first");
//     if (!imgUrl) return;

//     const updatedColors = { ...formData.colors };
//     updatedColors[selectedColor] = [...(updatedColors[selectedColor] || []), imgUrl];
//     setFormData({ ...formData, colors: updatedColors });
//     setImgUrl("");
//   };

//   // Add a size/stock variant for current color
//   const addVariant = (size, stock) => {
//     if (!selectedColor) return alert("Select a color first");
//     setVariants([...variants, { color: selectedColor, size, stock }]);
//   };

//   // Publish product to Supabase
//   const handlePublish = async () => {
//     // Convert colors object to array of images (Supabase JSONB)
//     const images = formData.colors;

//     const productPayload = {
//       ...formData,
//       images
//     };

//     const res = await publishProduct(productPayload, variants);
//     if (res.success) {
//       alert("Published Successfully!");
//       setFormData({ title: '', price: '', description: '', category_id: '', discount: 0, colors: {} });
//       setVariants([]);
//       setSelectedColor('');
//     } else {
//       alert("Error: " + res.error);
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-6 space-y-8 pb-20">
//       <h1 className="text-3xl font-black italic uppercase">Add New Product</h1>

//       {/* Color Selector */}
//       <div className="flex gap-2">
//         {['black','white','red','blue','green'].map(color => (
//           <button
//             key={color}
//             className={`px-4 py-2 rounded-full font-bold text-xs ${selectedColor === color ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}
//             onClick={() => setSelectedColor(color)}
//           >
//             {color}
//           </button>
//         ))}
//       </div>

//       {/* Horizontal Image Preview */}
//       <div className="flex gap-4 overflow-x-auto p-6 bg-gray-50 rounded-[20px] border-2 border-dashed border-gray-200">
//         {(formData.colors[selectedColor] || []).map((url, i) => (
//           <div key={i} className="relative min-w-[150px]">
//             <img src={url} className="w-full h-48 object-cover rounded-xl shadow-md" alt="Preview" />
//             <button onClick={() => {
//               const updated = formData.colors[selectedColor].filter((_, idx) => idx !== i);
//               setFormData({ ...formData, colors: { ...formData.colors, [selectedColor]: updated } });
//             }} 
//               className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><FiTrash size={12}/></button>
//           </div>
//         ))}
//         <div className="min-w-[200px] h-48 flex flex-col items-center justify-center bg-white rounded-xl border p-4 gap-2">
//           <FiImage className="text-gray-300" size={32} />
//           <input value={imgUrl} onChange={e => setImgUrl(e.target.value)} placeholder="Paste URL" className="text-xs w-full p-2 border rounded" />
//           <button onClick={addImage} className="bg-black text-white px-4 py-1 rounded-full text-xs font-bold">Add Image</button>
//         </div>
//       </div>

//       {/* Product Info */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="space-y-4">
//           <label className="font-bold text-sm uppercase">Basic Details</label>
//           <input placeholder="Title" className="w-full p-4 bg-[#F0F0F0] rounded-xl"
//             value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
//           <input placeholder="Price (PKR)" type="number" className="w-full p-4 bg-[#F0F0F0] rounded-xl"
//             value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
//           <textarea placeholder="Description" className="w-full p-4 bg-[#F0F0F0] rounded-xl h-32"
//             value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
//         </div>

//         {/* Variants */}
//         <div className="space-y-4">
//           <label className="font-bold text-sm uppercase">Inventory & Variants</label>
//           <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-3">
//             {variants.filter(v => v.color === selectedColor).map((v, i) => (
//               <div key={i} className="flex gap-2">
//                 <input placeholder="Size" className="flex-1 p-3 bg-gray-50 rounded-lg" value={v.size} readOnly />
//                 <input placeholder="Stock" type="number" className="w-24 p-3 bg-gray-50 rounded-lg" value={v.stock} readOnly />
//               </div>
//             ))}
//             <button onClick={() => {
//               const size = prompt("Enter Size");
//               const stock = parseInt(prompt("Enter Stock"));
//               if (size && stock >= 0) addVariant(size, stock);
//             }} className="text-xs font-bold text-gray-400">+ ADD SIZE</button>
//           </div>
//         </div>
//       </div>

//       <button onClick={handlePublish} disabled={loading} className="w-full bg-black text-white py-5 rounded-full font-black uppercase italic tracking-widest hover:bg-zinc-800 transition-all">
//         {loading ? "Processing..." : "Publish Product Live"}
//       </button>
//     </div>
//   );
// }




// import { useState } from 'react';
// import { useAdmin } from '../../hooks/useAdmin';
// import { FiTrash, FiImage } from 'react-icons/fi';

// export default function AddProduct() {
//   const { publishProduct, loading } = useAdmin();

//   const [formData, setFormData] = useState({
//     title: '',
//     price: '',
//     description: '',
//     category_id: '',   // optional
//     discount: 0,
//     colors: {},        // { black: [url1,url2], red: [url3] }
//   });

//   const [selectedColor, setSelectedColor] = useState('');
//   const [variants, setVariants] = useState([]);
//   const [imgUrl, setImgUrl] = useState("");

//   // Add image to selected color
//   const addImage = () => {
//     if (!selectedColor) return alert("Select a color first");
//     if (!imgUrl) return;

//     const updatedColors = { ...formData.colors };
//     updatedColors[selectedColor] = [...(updatedColors[selectedColor] || []), imgUrl];
//     setFormData({ ...formData, colors: updatedColors });
//     setImgUrl("");
//   };

//   // Add variant for selected color
//   const addVariant = (size, stock) => {
//     if (!selectedColor) return alert("Select a color first");
//     setVariants([...variants, { color: selectedColor, size, stock }]);
//   };

//   // Handle publish
//   const handlePublish = async () => {
//     const images = formData.colors || {};

//     const productPayload = {
//       ...formData,
//       images
//     };

//     const res = await publishProduct(productPayload, variants);
//     if (res.success) {
//       alert("Published Successfully!");
//       setFormData({ title: '', price: '', description: '', category_id: '', discount: 0, colors: {} });
//       setVariants([]);
//       setSelectedColor('');
//     } else {
//       alert("Error: " + res.error);
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-6 space-y-8 pb-20">
//       <h1 className="text-3xl font-black italic uppercase">Add New Product</h1>

//       {/* Color Selector */}
//       <div className="flex gap-2">
//         {['black','white','red','blue','green'].map(color => (
//           <button
//             key={color}
//             className={`px-4 py-2 rounded-full font-bold text-xs ${selectedColor === color ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}
//             onClick={() => setSelectedColor(color)}
//           >
//             {color}
//           </button>
//         ))}
//       </div>

//       {/* Images */}
//       <div className="flex gap-4 overflow-x-auto p-6 bg-gray-50 rounded-[20px] border-2 border-dashed border-gray-200">
//         {(formData.colors[selectedColor] || []).map((url, i) => (
//           <div key={i} className="relative min-w-[150px]">
//             <img src={url} className="w-full h-48 object-cover rounded-xl shadow-md" alt="Preview" />
//             <button onClick={() => {
//               const updated = formData.colors[selectedColor].filter((_, idx) => idx !== i);
//               setFormData({ ...formData, colors: { ...formData.colors, [selectedColor]: updated } });
//             }} 
//               className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><FiTrash size={12}/></button>
//           </div>
//         ))}
//         <div className="min-w-[200px] h-48 flex flex-col items-center justify-center bg-white rounded-xl border p-4 gap-2">
//           <FiImage className="text-gray-300" size={32} />
//           <input value={imgUrl} onChange={e => setImgUrl(e.target.value)} placeholder="Paste URL" className="text-xs w-full p-2 border rounded" />
//           <button onClick={addImage} className="bg-black text-white px-4 py-1 rounded-full text-xs font-bold">Add Image</button>
//         </div>
//       </div>

//       {/* Product Info */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="space-y-4">
//           <label className="font-bold text-sm uppercase">Basic Details</label>
//           <input placeholder="Title" className="w-full p-4 bg-[#F0F0F0] rounded-xl"
//             value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
//           <input placeholder="Price (PKR)" type="number" className="w-full p-4 bg-[#F0F0F0] rounded-xl"
//             value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
//           <textarea placeholder="Description" className="w-full p-4 bg-[#F0F0F0] rounded-xl h-32"
//             value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
//         </div>

//         {/* Variants */}
//         <div className="space-y-4">
//           <label className="font-bold text-sm uppercase">Inventory & Variants</label>
//           <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-3">
//             {variants.filter(v => v.color === selectedColor).map((v, i) => (
//               <div key={i} className="flex gap-2">
//                 <input placeholder="Size" className="flex-1 p-3 bg-gray-50 rounded-lg" value={v.size} readOnly />
//                 <input placeholder="Stock" type="number" className="w-24 p-3 bg-gray-50 rounded-lg" value={v.stock} readOnly />
//               </div>
//             ))}
//             <button onClick={() => {
//               const size = prompt("Enter Size");
//               const stock = parseInt(prompt("Enter Stock"));
//               if (size && stock >= 0) addVariant(size, stock);
//             }} className="text-xs font-bold text-gray-400">+ ADD SIZE</button>
//           </div>
//         </div>
//       </div>

//       <button onClick={handlePublish} disabled={loading} className="w-full bg-black text-white py-5 rounded-full font-black uppercase italic tracking-widest hover:bg-zinc-800 transition-all">
//         {loading ? "Processing..." : "Publish Product Live"}
//       </button>
//     </div>
//   );
// }










// gemini
// import { useState } from 'react';
// import { useAdmin } from '../../hooks/useAdmin';
// import { FiTrash, FiImage } from 'react-icons/fi';

// export default function AddProduct() {
//   const { publishProduct, loading } = useAdmin();

//   const [formData, setFormData] = useState({
//     title: '',
//     price: '',
//     description: '',
//     category_id: '',
//     discount: 0,
//     colors: {}, 
//   });

//   const [selectedColor, setSelectedColor] = useState('black');
//   const [variants, setVariants] = useState([]);
//   const [imgUrl, setImgUrl] = useState("");

//   // Add image by URL
//   const addImageByURL = () => {
//     if (!selectedColor) return alert("Select a color first");
//     if (!imgUrl) return;

//     const updatedColors = { ...formData.colors };
//     updatedColors[selectedColor] = [...(updatedColors[selectedColor] || []), imgUrl];
//     setFormData({ ...formData, colors: updatedColors });
//     setImgUrl("");
//   };

//   // Add image by file
//   const addImageByFile = async (e) => {
//     if (!selectedColor) return alert("Select a color first");
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const base64Data = reader.result;
//       const updatedColors = { ...formData.colors };
//       updatedColors[selectedColor] = [...(updatedColors[selectedColor] || []), base64Data];
//       setFormData({ ...formData, colors: updatedColors });
//     };
//     reader.readAsDataURL(file); // Converts file to base64
//   };

//   const addVariant = (size, stock) => {
//     if (!selectedColor) return alert("Select a color first");
    
//     const exists = variants.find(v => v.color === selectedColor && v.size === size);
//     if (exists) return alert("This size already exists for this color");

//     setVariants([...variants, { 
//       color: selectedColor, 
//       size: size,
//       name: size,
//       stock: Number(stock), 
//       variant_type: 'size'
//     }]);
//   };

//   const handlePublish = async () => {
//   if (!formData.title || !formData.price) return alert("Title and Price are required");
//   if (Object.keys(formData.colors).length === 0) return alert("Add at least one color and image");

//   // Flatten all color images into a single array
//   const allImages = Object.values(formData.colors).flat();

//   const res = await publishProduct(
//     { ...formData, images: allImages }, // pass the flattened array
//     variants
//   );

//   if (res.success) {
//     alert("Published Successfully!");
//     setFormData({ title: '', price: '', description: '', category_id: '', discount: 0, colors: {} });
//     setVariants([]);
//     setSelectedColor('black');
//   } else {
//     alert("Error: " + res.error);
//   }
// };

//   return (
//     <div className="max-w-5xl mx-auto p-6 space-y-8 pb-20">
//       <h1 className="text-3xl font-black italic uppercase">Add New Product</h1>

//       {/* Color Selector */}
//       <div className="flex gap-2">
//         {['black','white','red','blue','green'].map(color => (
//           <button
//             key={color}
//             type="button"
//             className={`px-4 py-2 rounded-full font-bold text-xs uppercase transition-all ${selectedColor === color ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
//             onClick={() => setSelectedColor(color)}
//           >
//             {color}
//           </button>
//         ))}
//       </div>

//       {/* Images Section */}
//       <div className="flex gap-4 overflow-x-auto p-6 bg-gray-50 rounded-[20px] border-2 border-dashed border-gray-200">
//         {(formData.colors[selectedColor] || []).map((url, i) => (
//           <div key={i} className="relative min-w-[150px]">
//             <img src={url} className="w-full h-48 object-cover rounded-xl shadow-md" alt="Preview" />
//             <button 
//               onClick={() => {
//                 const updated = formData.colors[selectedColor].filter((_, idx) => idx !== i);
//                 setFormData({ ...formData, colors: { ...formData.colors, [selectedColor]: updated } });
//               }} 
//               className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
//             >
//               <FiTrash size={12}/>
//             </button>
//           </div>
//         ))}

//         {/* Add Image */}
//         <div className="min-w-[200px] h-48 flex flex-col items-center justify-center bg-white rounded-xl border p-4 gap-2">
//           <FiImage className="text-gray-300" size={32} />
          
//           <input 
//             value={imgUrl} 
//             onChange={e => setImgUrl(e.target.value)} 
//             placeholder="Paste URL" 
//             className="text-xs w-full p-2 border rounded" 
//           />
//           <button onClick={addImageByURL} className="bg-black text-white px-4 py-1 rounded-full text-xs font-bold w-full">
//             Add URL
//           </button>

//           <input
//             type="file"
//             accept="image/*"
//             onChange={addImageByFile}
//             className="text-xs w-full mt-2"
//           />
//         </div>
//       </div>

//       {/* Form Fields */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="space-y-4">
//           <label className="font-bold text-sm uppercase text-gray-400">Basic Details</label>
//           <input placeholder="Product Title" className="w-full p-4 bg-[#F0F0F0] rounded-xl outline-none focus:ring-2 ring-black"
//             value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
//           <input placeholder="Price (PKR)" type="number" className="w-full p-4 bg-[#F0F0F0] rounded-xl outline-none"
//             value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
//           <textarea placeholder="Description" className="w-full p-4 bg-[#F0F0F0] rounded-xl h-32 outline-none"
//             value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
//         </div>

//         {/* Variants */}
//         <div className="space-y-4">
//           <label className="font-bold text-sm uppercase text-gray-400">Inventory: {selectedColor}</label>
//           <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-3 min-h-[200px]">
//             {variants.filter(v => v.color === selectedColor).map((v, i) => (
//               <div key={i} className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg">
//                 <span className="flex-1 font-bold text-sm">{v.size}</span>
//                 <span className="text-gray-500 text-sm">{v.stock} pcs</span>
//                 <button onClick={() => setVariants(variants.filter(item => item !== v))} className="text-red-400 p-1">
//                    <FiTrash size={14}/>
//                 </button>
//               </div>
//             ))}
//             <button 
//               type="button"
//               onClick={() => {
//                 const size = prompt("Enter Size (e.g. Medium, 44)");
//                 const stock = prompt("Enter Stock Quantity");
//                 if (size && stock) addVariant(size, stock);
//               }} 
//               className="w-full py-3 border-2 border-dashed rounded-xl text-xs font-bold text-gray-400 hover:border-black hover:text-black transition-all"
//             >
//               + ADD {selectedColor.toUpperCase()} SIZE
//             </button>
//           </div>
//         </div>
//       </div>

//       <button 
//         onClick={handlePublish} 
//         disabled={loading} 
//         className="w-full bg-black text-white py-5 rounded-full font-black uppercase italic tracking-widest hover:bg-zinc-800 transition-all disabled:bg-gray-400"
//       >
//         {loading ? "Syncing with Database..." : "Publish Product Live"}
//       </button>
//     </div>
//   );
// }









// for cat
// import { useState, useEffect } from 'react';
// import { useAdmin } from '../../hooks/useAdmin';
// import { supabase } from '../../supabaseClient';
// import { FiTrash, FiImage } from 'react-icons/fi';

// export default function AddProduct() {
//   const { publishProduct, loading } = useAdmin();
//   const [categories, setCategories] = useState([]);
  
//   // Toggle for color mode
//   const [isMultiColor, setIsMultiColor] = useState(false);

//   const [formData, setFormData] = useState({
//     title: '',
//     price: '',
//     description: '',
//     category_id: '',
//     discount: 0,
//     colors: {}, 
//   });

//   // Fetch Categories with Error Handling
//   useEffect(() => {
//     async function fetchCategories() {
//       try {
//         const { data, error } = await supabase
//           .from('categories')
//           .select('id, name')
//           .order('name', { ascending: true });
//         if (error) throw error;
//         setCategories(data || []);
//       } catch (err) {
//         console.error("Error fetching categories:", err.message);
//       }
//     }
//     fetchCategories();
//   }, []);

//   const [selectedColor, setSelectedColor] = useState('Default');
//   const [variants, setVariants] = useState([]);
//   const [imgUrl, setImgUrl] = useState("");

//   // Switch between Single and Multi Color
//   const handleToggleMode = (e) => {
//     const multi = e.target.checked;
//     setIsMultiColor(multi);
//     setSelectedColor(multi ? 'black' : 'Default');
//     // Optional: setVariants([]); // Uncomment if you want to clear list on toggle
//   };

//   const addImageByURL = () => {
//     if (!imgUrl) return;
//     const colorKey = isMultiColor ? selectedColor : 'Default';
//     const updatedColors = { ...formData.colors };
//     updatedColors[colorKey] = [...(updatedColors[colorKey] || []), imgUrl];
//     setFormData({ ...formData, colors: updatedColors });
//     setImgUrl("");
//   };

//   const addImageByFile = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const colorKey = isMultiColor ? selectedColor : 'Default';
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const base64Data = reader.result;
//       const updatedColors = { ...formData.colors };
//       updatedColors[colorKey] = [...(updatedColors[colorKey] || []), base64Data];
//       setFormData({ ...formData, colors: updatedColors });
//     };
//     reader.readAsDataURL(file);
//   };

//   const addVariant = (size, stock) => {
//     const colorKey = isMultiColor ? selectedColor : 'Default';
//     const exists = variants.find(v => v.color === colorKey && v.size === size);
//     if (exists) return alert("This size already exists for this color");
    
//     setVariants([...variants, { 
//       color: colorKey, 
//       size: size,
//       name: size,
//       stock: Number(stock), 
//       variant_type: 'size'
//     }]);
//   };

//   const handlePublish = async () => {
//     if (!formData.title || !formData.price || !formData.category_id) {
//       return alert("Title, Price, and Category are required");
//     }

//     const allImages = Object.values(formData.colors).flat();
//     if (allImages.length === 0) return alert("Add at least one image");

//     // Auto-generate slug from title
//     const slug = formData.title.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

//     const res = await publishProduct(
//       { ...formData, images: allImages, slug }, 
//       variants
//     );

//     if (res.success) {
//       alert("Published Successfully!");
//       setFormData({ title: '', price: '', description: '', category_id: '', discount: 0, colors: {} });
//       setVariants([]);
//       setSelectedColor(isMultiColor ? 'black' : 'Default');
//     } else {
//       alert("Error: " + res.error);
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-6 space-y-8 pb-20">
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-black italic uppercase">Add New Product</h1>
        
//         {/* Color Mode Toggle */}
//         <label className="flex items-center gap-3 cursor-pointer bg-gray-100 p-3 rounded-2xl border border-gray-200">
//           <span className="text-xs font-bold uppercase tracking-widest">Multi-Color Mode</span>
//           <input 
//             type="checkbox" 
//             className="w-5 h-5 accent-black"
//             checked={isMultiColor}
//             onChange={handleToggleMode}
//           />
//         </label>
//       </div>

//       {/* Color Selector - Only visible in Multi-Color mode */}
//       {isMultiColor && (
//         <div className="flex gap-2 animate-in fade-in slide-in-from-top-2">
//           {['black','white','red','blue','green'].map(color => (
//             <button
//               key={color}
//               type="button"
//               className={`px-4 py-2 rounded-full font-bold text-xs uppercase transition-all ${selectedColor === color ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
//               onClick={() => setSelectedColor(color)}
//             >
//               {color}
//             </button>
//           ))}
//         </div>
//       )}

//       {/* Images Section */}
//       <div className="flex gap-4 overflow-x-auto p-6 bg-gray-50 rounded-[20px] border-2 border-dashed border-gray-200">
//         {(formData.colors[isMultiColor ? selectedColor : 'Default'] || []).map((url, i) => (
//           <div key={i} className="relative min-w-[150px]">
//             <img src={url} className="w-full h-48 object-cover rounded-xl shadow-md" alt="Preview" />
//             <button 
//               onClick={() => {
//                 const colorKey = isMultiColor ? selectedColor : 'Default';
//                 const updated = formData.colors[colorKey].filter((_, idx) => idx !== i);
//                 setFormData({ ...formData, colors: { ...formData.colors, [colorKey]: updated } });
//               }} 
//               className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
//             >
//               <FiTrash size={12}/>
//             </button>
//           </div>
//         ))}

//         <div className="min-w-[200px] h-48 flex flex-col items-center justify-center bg-white rounded-xl border p-4 gap-2">
//           <FiImage className="text-gray-300" size={32} />
//           <input 
//             value={imgUrl} 
//             onChange={e => setImgUrl(e.target.value)} 
//             placeholder="Paste URL" 
//             className="text-xs w-full p-2 border rounded outline-none focus:ring-1 ring-black" 
//           />
//           <button onClick={addImageByURL} className="bg-black text-white px-4 py-1 rounded-full text-xs font-bold w-full">
//             Add URL
//           </button>
//           <input type="file" accept="image/*" onChange={addImageByFile} className="text-xs w-full mt-2" />
//         </div>
//       </div>

//       {/* Form Fields */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="space-y-4">
//           <label className="font-bold text-sm uppercase text-gray-400">Basic Details</label>
          
//           <input placeholder="Product Title" className="w-full p-4 bg-[#F0F0F0] rounded-xl outline-none focus:ring-2 ring-black"
//             value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />

//           <select 
//             className="w-full p-4 bg-[#F0F0F0] rounded-xl outline-none focus:ring-2 ring-black appearance-none cursor-pointer"
//             value={formData.category_id}
//             onChange={e => setFormData({ ...formData, category_id: e.target.value })}
//           >
//             <option value="">{categories.length > 0 ? "Select Category" : "Fetching Categories..."}</option>
//             {categories.map(cat => (
//               <option key={cat.id} value={cat.id}>{cat.name}</option>
//             ))}
//           </select>

//           <input placeholder="Price (PKR)" type="number" className="w-full p-4 bg-[#F0F0F0] rounded-xl outline-none"
//             value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
//           <textarea placeholder="Description" className="w-full p-4 bg-[#F0F0F0] rounded-xl h-32 outline-none"
//             value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
//         </div>

//         {/* Inventory Section */}
//         <div className="space-y-4">
//           <label className="font-bold text-sm uppercase text-gray-400">
//             Inventory: {isMultiColor ? selectedColor : 'General Stock'}
//           </label>
//           <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-3 min-h-[200px]">
//             {variants
//               .filter(v => v.color === (isMultiColor ? selectedColor : 'Default'))
//               .map((v, i) => (
//                 <div key={i} className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg">
//                   <span className="flex-1 font-bold text-sm">{v.size}</span>
//                   <span className="text-gray-500 text-sm">{v.stock} pcs</span>
//                   <button onClick={() => setVariants(variants.filter(item => item !== v))} className="text-red-400 p-1">
//                       <FiTrash size={14}/>
//                   </button>
//                 </div>
//             ))}
//             <button 
//               type="button"
//               onClick={() => {
//                 const size = prompt("Enter Size (e.g. Medium, 44)");
//                 const stock = prompt("Enter Stock Quantity");
//                 if (size && stock) addVariant(size, stock);
//               }} 
//               className="w-full py-3 border-2 border-dashed rounded-xl text-xs font-bold text-gray-400 hover:border-black hover:text-black transition-all"
//             >
//               + ADD {isMultiColor ? selectedColor.toUpperCase() : "PRODUCT"} SIZE
//             </button>
//           </div>
//         </div>
//       </div>

//       <button 
//         onClick={handlePublish} 
//         disabled={loading} 
//         className="w-full bg-black text-white py-5 rounded-full font-black uppercase italic tracking-widest hover:bg-zinc-800 transition-all disabled:bg-gray-400"
//       >
//         {loading ? "Syncing with Database..." : "Publish Product Live"}
//       </button>
//     </div>
//   );
// }


// import { useState, useEffect } from 'react';
// import { useAdmin } from '../../hooks/useAdmin';
// import { supabase } from '../../supabaseClient';
// import { FiTrash, FiImage, FiPlus } from 'react-icons/fi';

// export default function AddProduct() {
//   const { publishProduct, loading } = useAdmin();
//   const [categories, setCategories] = useState([]);
  
//   // Logic states
//   const [isMultiColor, setIsMultiColor] = useState(false);
//   const [productColors, setProductColors] = useState(['BLACK']); // Local to this product session
//   const [selectedColor, setSelectedColor] = useState('BLACK');
//   const [newColorInput, setNewColorInput] = useState('');

//   const [formData, setFormData] = useState({
//     title: '',
//     price: '',
//     description: '',
//     category_id: '',
//     discount: 0,
//     colors: {}, 
//   });

//   const [variants, setVariants] = useState([]);
//   const [imgUrl, setImgUrl] = useState("");

//   // Fetch Categories
//   useEffect(() => {
//     async function fetchCategories() {
//       const { data } = await supabase.from('categories').select('id, name').order('name');
//       setCategories(data || []);
//     }
//     fetchCategories();
//   }, []);

//   const handleToggleMode = (e) => {
//     const multi = e.target.checked;
//     setIsMultiColor(multi);
//     setSelectedColor(multi ? productColors[0] : 'Default');
//   };

//   const addCustomColor = () => {
//     const formatted = newColorInput.trim().toUpperCase();
//     if (formatted && !productColors.includes(formatted)) {
//       setProductColors([...productColors, formatted]);
//       setSelectedColor(formatted);
//       setNewColorInput('');
//     }
//   };

//   const activeKey = isMultiColor ? selectedColor : 'Default';

//   // Logic for adding images and variants (remains same but uses activeKey)
//   const addImageByURL = () => {
//     if (!imgUrl) return;
//     const updated = { ...formData.colors };
//     updated[activeKey] = [...(updated[activeKey] || []), imgUrl];
//     setFormData({ ...formData, colors: updated });
//     setImgUrl("");
//   };

//   const addVariant = (size, stock) => {
//     setVariants([...variants, { color: activeKey, size, name: size, stock: Number(stock), variant_type: 'size' }]);
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6 space-y-8">
//       {/* 1. TOP HEADER SECTION */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-black italic uppercase italic">ADD NEW PRODUCT</h1>
        
//         <div className="flex items-center gap-3 bg-[#F9F9F9] px-4 py-2 rounded-xl border">
//           <span className="text-[10px] font-bold uppercase">MULTI-COLOR MODE</span>
//           <input type="checkbox" className="w-5 h-5 accent-black cursor-pointer" 
//             checked={isMultiColor} onChange={handleToggleMode} />
//         </div>
//       </div>

//       {/* 2. DYNAMIC COLOR BAR (Product Specific) */}
//       <div className="flex flex-wrap items-center gap-3">
//         {isMultiColor && productColors.map(color => (
//           <button
//             key={color}
//             onClick={() => setSelectedColor(color)}
//             className={`px-6 py-2 rounded-full text-[10px] font-bold transition-all ${
//               selectedColor === color ? 'bg-black text-white' : 'bg-[#E1E7ED] text-gray-500'
//             }`}
//           >
//             {color}
//           </button>
//         ))}
        
//         {isMultiColor && (
//           <div className="flex items-center border-b-2 border-gray-200 focus-within:border-black ml-2">
//             <input 
//               value={newColorInput}
//               onChange={(e) => setNewColorInput(e.target.value)}
//               placeholder="+ ADD COLOR"
//               className="outline-none text-[10px] font-bold w-24 bg-transparent uppercase"
//               onKeyDown={(e) => e.key === 'Enter' && addCustomColor()}
//             />
//           </div>
//         )}
//       </div>

//       {/* 3. IMAGE UPLOAD BOX */}
//       <div className="bg-[#F9F9F9] rounded-[30px] border-2 border-dashed border-gray-200 p-10 flex items-center justify-center">
//         <div className="bg-white border rounded-[20px] p-6 w-72 shadow-sm space-y-4 text-center">
//           <FiImage className="mx-auto text-gray-300" size={40} />
//           <input value={imgUrl} onChange={e => setImgUrl(e.target.value)} placeholder="Paste URL" 
//             className="w-full p-2 border rounded-lg text-xs outline-none" />
//           <button onClick={addImageByURL} className="w-full bg-black text-white py-2 rounded-full text-xs font-bold">
//             Add URL
//           </button>
//           <p className="text-[10px] text-gray-400">Choose file No file chosen</p>
//         </div>
        
//         {/* Preview of images for active selection */}
//         <div className="flex gap-4 ml-6 overflow-x-auto">
//           {(formData.colors[activeKey] || []).map((url, i) => (
//             <img key={i} src={url} className="w-24 h-24 object-cover rounded-xl border-2 border-white shadow" />
//           ))}
//         </div>
//       </div>

//       {/* 4. DETAILS AND INVENTORY SIDE-BY-SIDE */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//         {/* BASIC DETAILS */}
//         <div className="space-y-4">
//           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">BASIC DETAILS</label>
//           <input placeholder="Product Title" className="w-full p-4 bg-[#F0F0F0] rounded-xl outline-none font-bold text-gray-500"
//             value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
          
//           <select className="w-full p-4 bg-[#F0F0F0] rounded-xl outline-none font-bold text-gray-500 appearance-none"
//             value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})}>
//             <option value="">Select Category</option>
//             {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//           </select>

//           <input placeholder="Price (PKR)" className="w-full p-4 bg-[#F0F0F0] rounded-xl outline-none font-bold text-gray-500"
//             value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
          
//           <textarea placeholder="Description" className="w-full p-4 bg-[#F0F0F0] rounded-xl h-40 outline-none text-gray-500"
//             value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
//         </div>

//         {/* INVENTORY */}
//         <div className="space-y-4">
//           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//             INVENTORY: {isMultiColor ? selectedColor : 'DEFAULT'}
//           </label>
//           <div className="bg-white border rounded-[25px] p-6 min-h-[300px] shadow-sm border-gray-100">
//              {variants.filter(v => v.color === activeKey).map((v, i) => (
//                <div key={i} className="flex justify-between bg-gray-50 p-3 rounded-xl mb-2">
//                  <span className="font-bold text-xs uppercase">{v.size}</span>
//                  <span className="text-gray-400 font-bold text-xs">{v.stock} PCS</span>
//                </div>
//              ))}
//              <button 
//                 type="button"
//                 onClick={() => {
//                   const s = prompt("Size?"); const q = prompt("Stock?");
//                   if(s && q) addVariant(s, q);
//                 }}
//                 className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-[10px] font-bold text-gray-400 hover:border-black hover:text-black transition-all"
//              >
//                + ADD {isMultiColor ? selectedColor : ""} SIZE
//              </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { supabase } from '../../supabaseClient';
import { FiTrash, FiImage, FiPlus, FiX, FiCheckCircle, FiPercent } from 'react-icons/fi';

export default function AddProduct() {
  const { publishProduct, loading } = useAdmin();
  const [categories, setCategories] = useState([]);
  
  // Logic states
  const [isMultiColor, setIsMultiColor] = useState(false);
  const [productColors, setProductColors] = useState(['BLACK', 'WHITE', 'RED', 'BLUE']); 
  const [selectedColor, setSelectedColor] = useState('BLACK');
  const [newColorInput, setNewColorInput] = useState('');

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
  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase.from('categories').select('id, name').order('name');
        if (error) throw error;
        setCategories(data || []);
      } catch (err) {
        console.error("Error fetching categories:", err.message);
      }
    }
    fetchCategories();
  }, []);

  const activeKey = isMultiColor ? selectedColor : 'Default';

  const handleToggleMode = (e) => {
    const multi = e.target.checked;
    setIsMultiColor(multi);
    setSelectedColor(multi ? 'BLACK' : 'Default');
  };

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

  const addImageByFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result;
      setFormData(prev => ({
        ...prev,
        colors: {
          ...prev.colors,
          [activeKey]: [...(prev.colors[activeKey] || []), base64Data]
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (colorKey, index) => {
    const updated = [...formData.colors[colorKey]];
    updated.splice(index, 1);
    setFormData({ ...formData, colors: { ...formData.colors, [colorKey]: updated } });
  };

  const addVariant = () => {
    if (!tempSize || !tempStock) return;
    const exists = variants.find(v => v.color === activeKey && v.size.toUpperCase() === tempSize.toUpperCase());
    if (exists) return alert("Size already exists for this color");

    setVariants([...variants, { 
      color: activeKey, 
      size: tempSize.toUpperCase(), 
      name: tempSize.toUpperCase(), 
      stock: Number(tempStock), 
      variant_type: 'size' 
    }]);
    setTempSize('');
    setTempStock('');
  };

  const handlePublish = async () => {
    if (!formData.title || !formData.price || !formData.category_id) {
      return alert("Title, Price, and Category are required");
    }

    const allImages = Object.values(formData.colors).flat();
    if (allImages.length === 0) return alert("Add at least one image");

    const slug = formData.title.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

    const res = await publishProduct(
      { ...formData, images: allImages, slug }, 
      variants
    );

    if (res.success) {
      alert("Published Successfully!");
      setFormData({ title: '', price: '', description: '', category_id: '', discount: 0, colors: {} });
      setVariants([]);
    } else {
      alert("Error: " + res.error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">Inventory Lab</h1>
          <p className="text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase mt-1">Product Creation Suite</p>
        </div>
        
        <label className="flex items-center gap-4 bg-gray-50 border border-gray-200 px-6 py-4 rounded-3xl cursor-pointer hover:bg-gray-100 transition-all">
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest leading-none">Multi-Color</p>
            <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">{isMultiColor ? 'Enabled' : 'Disabled'}</p>
          </div>
          <input type="checkbox" className="w-6 h-6 accent-black cursor-pointer" checked={isMultiColor} onChange={handleToggleMode} />
        </label>
      </div>

      {isMultiColor && (
        <div className="flex flex-wrap items-center gap-2 mb-10 p-2 bg-gray-50 rounded-[24px]">
          {productColors.map(color => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black transition-all ${
                selectedColor === color ? 'bg-black text-white shadow-xl scale-105' : 'bg-white text-gray-400 border border-gray-100 hover:border-black'
              }`}
            >
              {color}
            </button>
          ))}
          <input 
             className="bg-transparent border-b-2 border-gray-200 outline-none px-4 py-2 text-[10px] font-bold w-28 focus:border-black uppercase"
             placeholder="+ NEW COLOR"
             value={newColorInput}
             onChange={e => setNewColorInput(e.target.value)}
             onKeyDown={e => {
               if(e.key === 'Enter' && newColorInput) {
                 setProductColors([...productColors, newColorInput.toUpperCase()]);
                 setNewColorInput('');
               }
             }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <div className="lg:col-span-7 space-y-10">
          
          <section className="space-y-4">
            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Media Gallery — {activeKey}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-gray-200 rounded-[32px] p-8 flex flex-col items-center justify-center bg-gray-50 hover:border-black transition-all">
                <FiImage className="text-gray-300 mb-4" size={30} />
                <input 
                  value={imgUrl} 
                  onChange={e => setImgUrl(e.target.value)}
                  placeholder="Paste URL" 
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs mb-3 outline-none focus:ring-2 ring-black"
                />
                <button 
                  onClick={addImageByURL}
                  className="w-full bg-black text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-80 active:scale-95 transition-all"
                >
                  Add Image URL
                </button>
                <div className="relative w-full mt-4">
                  <input type="file" onChange={addImageByFile} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <div className="w-full py-2 border border-gray-200 rounded-xl text-center text-[10px] font-bold text-gray-400">
                    OR UPLOAD FILE
                  </div>
                </div>
              </div>

              <div className="flex md:grid md:grid-cols-2 gap-3 overflow-x-auto">
                {(formData.colors[activeKey] || []).map((url, i) => (
                  <div key={i} className="relative group min-w-[140px] aspect-square">
                    <img src={url} className="w-full h-full object-cover rounded-[24px] border border-gray-100 shadow-sm" />
                    <button 
                      onClick={() => removeImage(activeKey, i)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                placeholder="Product Title" 
                className="md:col-span-2 p-5 bg-gray-50 rounded-2xl border border-gray-500 font-bold text-gray-700 focus:bg-white focus:ring-2 ring-black transition-all"
                value={formData.title} 
                onChange={e => setFormData({ ...formData, title: e.target.value })} 
              />
              <select 
                className="p-5 bg-gray-50 rounded-2xl border border-gray-500 font-bold text-gray-500 appearance-none cursor-pointer"
                value={formData.category_id} 
                onChange={e => setFormData({ ...formData, category_id: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              
              <div className="relative">
                <input 
                  placeholder="Price (PKR)" 
                  type="number"
                  className="w-full p-5 bg-gray-50 rounded-2xl border border-gray-500 font-bold text-gray-700 focus:bg-white focus:ring-2 ring-black transition-all"
                  value={formData.price} 
                  onChange={e => setFormData({ ...formData, price: e.target.value })} 
                />
              </div>

              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black transition-colors">
                  <FiPercent size={14}/>
                </div>
                <input 
                  placeholder="Discount %" 
                  type="number"
                  max="100"
                  className="w-full p-5 pl-12 bg-gray-50 rounded-2xl border border-gray-500 font-bold text-gray-700 focus:bg-white focus:ring-2 ring-black transition-all"
                  value={formData.discount} 
                  onChange={e => setFormData({ ...formData, discount: e.target.value })} 
                />
                {formData.price > 0 && formData.discount > 0 && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black bg-black text-white px-2 py-1 rounded uppercase tracking-tighter">
                    Sale: {(formData.price - (formData.price * (formData.discount / 100))).toLocaleString()}
                  </div>
                )}
              </div>

              <textarea 
                placeholder="Product Description..." 
                className="md:col-span-2 p-5 bg-gray-50 rounded-2xl border border-gray-500 font-medium text-gray-600 h-40  focus:bg-white "
                value={formData.description} 
                onChange={e => setFormData({ ...formData, description: e.target.value })} 
              />
            </div>
          </section>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="bg-zinc-900 rounded-[40px] p-8 text-white shadow-2xl">
            <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-8">
              Inventory — {activeKey}
            </h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <input 
                  placeholder="Size (S, M, L...)" 
                  className="bg-zinc-800 p-4 rounded-2xl text-sm font-bold border-none outline-none focus:ring-1 ring-white/20"
                  value={tempSize}
                  onChange={e => setTempSize(e.target.value)}
                />
                <input 
                  placeholder="Stock Qty" 
                  type="number"
                  className="bg-zinc-800 p-4 rounded-2xl text-sm font-bold border-gray-600 outline-none focus:ring-1 ring-white/20"
                  value={tempStock}
                  onChange={e => setTempStock(e.target.value)}
                />
                <button 
                  onClick={addVariant}
                  className="col-span-2 bg-white text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all"
                >
                  Confirm Size Variant
                </button>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {variants.filter(v => v.color === activeKey).map((v, i) => (
                  <div key={i} className="flex justify-between items-center bg-zinc-800/50 p-4 rounded-2xl border border-white/5 group">
                    <div>
                      <p className="text-xs font-black uppercase">{v.size}</p>
                      <p className="text-[9px] text-zinc-500 font-bold">{v.stock} UNITS AVAILABLE</p>
                    </div>
                    <button 
                      onClick={() => setVariants(variants.filter((_, idx) => idx !== variants.indexOf(v)))}
                      className="p-2 text-zinc-600 hover:text-red-400"
                    >
                      <FiTrash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={handlePublish}
            disabled={loading}
            className="w-full py-8 bg-black text-white rounded-[32px] font-black text-xl italic uppercase tracking-tighter shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:bg-gray-300 disabled:scale-100"
          >
            {loading ? "Syncing to Cloud..." : "Publish Product Live"}
          </button>
        </div>
      </div>
    </div>
  );
}
// lasttttt final in uni 
// import { useState, useEffect } from 'react';
// import { useAdmin } from '../../hooks/useAdmin';
// import { supabase } from '../../supabaseClient';
// import { FiTrash, FiImage, FiPlus, FiX, FiCheckCircle } from 'react-icons/fi';

// export default function AddProduct() {
//   const { publishProduct, loading } = useAdmin();
//   const [categories, setCategories] = useState([]);
  
//   // Logic states
//   const [isMultiColor, setIsMultiColor] = useState(false);
//   const [productColors, setProductColors] = useState(['BLACK', 'WHITE', 'RED', 'BLUE']); 
//   const [selectedColor, setSelectedColor] = useState('BLACK');
//   const [newColorInput, setNewColorInput] = useState('');

//   // Inventory Inputs
//   const [tempSize, setTempSize] = useState('');
//   const [tempStock, setTempStock] = useState('');

//   const [formData, setFormData] = useState({
//     title: '',
//     price: '',
//     description: '',
//     category_id: '',
//     discount: 0,
//     colors: {}, 
//   });

//   const [variants, setVariants] = useState([]);
//   const [imgUrl, setImgUrl] = useState("");

//   useEffect(() => {
//     async function fetchCategories() {
//       try {
//         const { data, error } = await supabase.from('categories').select('id, name').order('name');
//         if (error) throw error;
//         setCategories(data || []);
//       } catch (err) {
//         console.error("Error fetching categories:", err.message);
//       }
//     }
//     fetchCategories();
//   }, []);

//   const activeKey = isMultiColor ? selectedColor : 'Default';

//   const handleToggleMode = (e) => {
//     const multi = e.target.checked;
//     setIsMultiColor(multi);
//     setSelectedColor(multi ? 'BLACK' : 'Default');
//   };

//   // IMAGE UPLOAD LOGIC
//   const addImageByURL = (e) => {
//     e.preventDefault(); // Stop form refresh
//     if (!imgUrl.trim()) return;

//     setFormData(prev => ({
//       ...prev,
//       colors: {
//         ...prev.colors,
//         [activeKey]: [...(prev.colors[activeKey] || []), imgUrl.trim()]
//       }
//     }));
//     setImgUrl("");
//   };

//   const addImageByFile = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const base64Data = reader.result;
//       setFormData(prev => ({
//         ...prev,
//         colors: {
//           ...prev.colors,
//           [activeKey]: [...(prev.colors[activeKey] || []), base64Data]
//         }
//       }));
//     };
//     reader.readAsDataURL(file);
//   };

//   const removeImage = (colorKey, index) => {
//     const updated = [...formData.colors[colorKey]];
//     updated.splice(index, 1);
//     setFormData({ ...formData, colors: { ...formData.colors, [colorKey]: updated } });
//   };

//   // INVENTORY LOGIC
//   const addVariant = () => {
//     if (!tempSize || !tempStock) return;
//     const exists = variants.find(v => v.color === activeKey && v.size.toUpperCase() === tempSize.toUpperCase());
//     if (exists) return alert("Size already exists for this color");

//     setVariants([...variants, { 
//       color: activeKey, 
//       size: tempSize.toUpperCase(), 
//       name: tempSize.toUpperCase(), 
//       stock: Number(tempStock), 
//       variant_type: 'size' 
//     }]);
//     setTempSize('');
//     setTempStock('');
//   };

//   // PUBLISH LOGIC
//   const handlePublish = async () => {
//     if (!formData.title || !formData.price || !formData.category_id) {
//       return alert("Title, Price, and Category are required");
//     }

//     const allImages = Object.values(formData.colors).flat();
//     if (allImages.length === 0) return alert("Add at least one image");

//     const slug = formData.title.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

//     const res = await publishProduct(
//       { ...formData, images: allImages, slug }, 
//       variants
//     );

//     if (res.success) {
//       alert("Published Successfully!");
//       setFormData({ title: '', price: '', description: '', category_id: '', discount: 0, colors: {} });
//       setVariants([]);
//     } else {
//       alert("Error: " + res.error);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-4 md:p-10 bg-white">
//       {/* HEADER SECTION */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
//         <div>
//           <h1 className="text-4xl font-black italic uppercase tracking-tighter">Inventory Lab</h1>
//           <p className="text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase mt-1">Product Creation Suite</p>
//         </div>
        
//         <label className="flex items-center gap-4 bg-gray-50 border border-gray-200 px-6 py-4 rounded-3xl cursor-pointer hover:bg-gray-100 transition-all">
//           <div className="text-right">
//             <p className="text-[10px] font-black uppercase tracking-widest leading-none">Multi-Color</p>
//             <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">{isMultiColor ? 'Enabled' : 'Disabled'}</p>
//           </div>
//           <input type="checkbox" className="w-6 h-6 accent-black cursor-pointer" checked={isMultiColor} onChange={handleToggleMode} />
//         </label>
//       </div>

//       {/* DYNAMIC COLOR BAR */}
//       {isMultiColor && (
//         <div className="flex flex-wrap items-center gap-2 mb-10 p-2 bg-gray-50 rounded-[24px]">
//           {productColors.map(color => (
//             <button
//               key={color}
//               onClick={() => setSelectedColor(color)}
//               className={`px-6 py-3 rounded-2xl text-[10px] font-black transition-all ${
//                 selectedColor === color ? 'bg-black text-white shadow-xl scale-105' : 'bg-white text-gray-400 border border-gray-100 hover:border-black'
//               }`}
//             >
//               {color}
//             </button>
//           ))}
//           <input 
//              className="bg-transparent border-b-2 border-gray-200 outline-none px-4 py-2 text-[10px] font-bold w-28 focus:border-black uppercase"
//              placeholder="+ NEW COLOR"
//              value={newColorInput}
//              onChange={e => setNewColorInput(e.target.value)}
//              onKeyDown={e => {
//                if(e.key === 'Enter' && newColorInput) {
//                  setProductColors([...productColors, newColorInput.toUpperCase()]);
//                  setNewColorInput('');
//                }
//              }}
//           />
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
//         {/* LEFT: MEDIA & DETAILS */}
//         <div className="lg:col-span-7 space-y-10">
          
//           {/* IMAGE SECTION */}
//           <section className="space-y-4">
//             <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Media Gallery — {activeKey}</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Uploader Card */}
//               <div className="border-2 border-dashed border-gray-200 rounded-[32px] p-8 flex flex-col items-center justify-center bg-gray-50 hover:border-black transition-all">
//                 <FiImage className="text-gray-300 mb-4" size={30} />
//                 <input 
//                   value={imgUrl} 
//                   onChange={e => setImgUrl(e.target.value)}
//                   placeholder="Paste URL" 
//                   className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs mb-3 outline-none focus:ring-2 ring-black"
//                 />
//                 <button 
//                   onClick={addImageByURL}
//                   className="w-full bg-black text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-80 active:scale-95 transition-all"
//                 >
//                   Add Image URL
//                 </button>
//                 <div className="relative w-full mt-4">
//                   <input type="file" onChange={addImageByFile} className="absolute inset-0 opacity-0 cursor-pointer" />
//                   <div className="w-full py-2 border border-gray-200 rounded-xl text-center text-[10px] font-bold text-gray-400">
//                     OR UPLOAD FILE
//                   </div>
//                 </div>
//               </div>

//               {/* Preview Grid */}
//               <div className="flex md:grid md:grid-cols-2 gap-3 overflow-x-auto">
//                 {(formData.colors[activeKey] || []).map((url, i) => (
//                   <div key={i} className="relative group min-w-[140px] aspect-square">
//                     <img src={url} className="w-full h-full object-cover rounded-[24px] border border-gray-100 shadow-sm" />
//                     <button 
//                       onClick={() => removeImage(activeKey, i)}
//                       className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
//                     >
//                       <FiX size={14} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </section>

//           {/* BASIC INFO SECTION */}
//           <section className="space-y-6">
//             <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Basic Information</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <input 
//                 placeholder="Product Title" 
//                 className="md:col-span-2 p-5 bg-gray-50 rounded-2xl outline-none font-bold text-gray-700 focus:bg-white focus:ring-2 ring-black transition-all"
//                 value={formData.title} 
//                 onChange={e => setFormData({ ...formData, title: e.target.value })} 
//               />
//               <select 
//                 className="p-5 bg-gray-50 rounded-2xl outline-none font-bold text-gray-500 appearance-none cursor-pointer"
//                 value={formData.category_id} 
//                 onChange={e => setFormData({ ...formData, category_id: e.target.value })}
//               >
//                 <option value="">Select Category</option>
//                 {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//               </select>
//               <input 
//                 placeholder="Price (PKR)" 
//                 type="number"
//                 className="p-5 bg-gray-50 rounded-2xl outline-none font-bold text-gray-700"
//                 value={formData.price} 
//                 onChange={e => setFormData({ ...formData, price: e.target.value })} 
//               />
//               <textarea 
//                 placeholder="Product Description..." 
//                 className="md:col-span-2 p-5 bg-gray-50 rounded-2xl outline-none font-medium text-gray-600 h-40 focus:bg-white border-none"
//                 value={formData.description} 
//                 onChange={e => setFormData({ ...formData, description: e.target.value })} 
//               />
//             </div>
//           </section>
//         </div>

//         {/* RIGHT: INVENTORY & SUBMIT */}
//         <div className="lg:col-span-5 space-y-8">
//           <div className="bg-zinc-900 rounded-[40px] p-8 text-white shadow-2xl">
//             <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-8">
//               Inventory — {activeKey}
//             </h3>
            
//             <div className="space-y-6">
//               {/* Inline Variant Adder */}
//               <div className="grid grid-cols-2 gap-3">
//                 <input 
//                   placeholder="Size (S, M, L...)" 
//                   className="bg-zinc-800 p-4 rounded-2xl text-sm font-bold border-none outline-none focus:ring-1 ring-white/20"
//                   value={tempSize}
//                   onChange={e => setTempSize(e.target.value)}
//                 />
//                 <input 
//                   placeholder="Stock Qty" 
//                   type="number"
//                   className="bg-zinc-800 p-4 rounded-2xl text-sm font-bold border-none outline-none focus:ring-1 ring-white/20"
//                   value={tempStock}
//                   onChange={e => setTempStock(e.target.value)}
//                 />
//                 <button 
//                   onClick={addVariant}
//                   className="col-span-2 bg-white text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all"
//                 >
//                   Confirm Size Variant
//                 </button>
//               </div>

//               {/* Variant List */}
//               <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
//                 {variants.filter(v => v.color === activeKey).map((v, i) => (
//                   <div key={i} className="flex justify-between items-center bg-zinc-800/50 p-4 rounded-2xl border border-white/5 group">
//                     <div>
//                       <p className="text-xs font-black uppercase">{v.size}</p>
//                       <p className="text-[9px] text-zinc-500 font-bold">{v.stock} UNITS AVAILABLE</p>
//                     </div>
//                     <button 
//                       onClick={() => setVariants(variants.filter((_, idx) => idx !== variants.indexOf(v)))}
//                       className="p-2 text-zinc-600 hover:text-red-400"
//                     >
//                       <FiTrash size={14} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* FINAL SUBMIT */}
//           <button 
//             onClick={handlePublish}
//             disabled={loading}
//             className="w-full py-8 bg-black text-white rounded-[32px] font-black text-xl italic uppercase tracking-tighter shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:bg-gray-300 disabled:scale-100"
//           >
//             {loading ? "Syncing to Cloud..." : "Publish Product Live"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }