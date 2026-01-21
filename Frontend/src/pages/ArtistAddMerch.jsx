import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import api from "../api/axios";

function AddMerch() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showPopup, setShowPopup] = useState(null);
  const [editpopup, setEditpopup] = useState(null);
  const [getItems, setGetItems] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("productName", data.productName);
      formData.append("price", data.price);
      formData.append("description", data.description || "");
      formData.append("stockQuantity", data.stockQuantity);
      formData.append("category", data.category);
      formData.append("sku", data.sku || "");
      if (selectedImage) formData.append("image", selectedImage);

      const res = await api.post("/artist/addmerch", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(res.data.message);
      reset();
      setSelectedImage(null);
      setPreview("");
      getMerchItems();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add product");
      console.log(error.message);
    }
  };

  const getMerchItems = async () => {
    try {
      const res = await api.get("/artist/allmerch/details");
      setGetItems(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMerchItems();
  }, []);

  function EditMerchModal({ item, close, refresh }) {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(`http://localhost:5000/${item.productImage}`);
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
      if (item) {
        reset({
          productName: item.productName,
          price: item.productPrice,
          description: item.productDescription,
          stockQuantity: item.productQuantity,
          sku: item.skuNumber,
        });
        setPreview(`http://localhost:5000/${item.productImage}`);
        setImage(null);
      }
    }, [item]);

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImage(file);
        setPreview(URL.createObjectURL(file));
      }
    };

    const onSubmit = async (data) => {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => formData.append(k, v));
      if (image) formData.append("image", image);
      try {
        await api.put(`/artist/addmerch/${item.productId}`, formData);
        alert("Updated successfully");
        refresh();
        close();
      } catch (error) {
        console.log(error);
        alert("Failed to update");
      }
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={() => setEditpopup(null)}>
          <div className="bg-white pr-10 pl-10 pt-6 pb-6 w-[90%] max-w-[500px] rounded-2xl shadow-2xl transform animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-[#3593A6]">Edit Product</h3>
              <button type="button" onClick={close} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">Product Name</label>
                <input {...register("productName", { required: true })} className="h-[45px] border-2 border-gray-200 p-3 rounded-lg focus:border-[#93CAD5] focus:outline-none transition" />
                {errors.productName && <p className="text-red-500 text-xs mt-1">Product name is required</p>}
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">Product Price</label>
                <input type="number" {...register("price", { required: true })} className="h-[45px] border-2 border-gray-200 p-3 rounded-lg focus:border-[#93CAD5] focus:outline-none transition" />
                {errors.price && <p className="text-red-500 text-xs mt-1">Product price is required</p>}
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">Description</label>
                <input {...register("description")} className="h-[45px] border-2 border-gray-200 p-3 rounded-lg focus:border-[#93CAD5] focus:outline-none transition" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">Stock Quantity</label>
                  <input type="number" {...register("stockQuantity", { required: true })} className="h-[45px] border-2 border-gray-200 p-3 rounded-lg focus:border-[#93CAD5] focus:outline-none transition" />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">SKU</label>
                  <input {...register("sku")} className="h-[45px] border-2 border-gray-200 p-3 rounded-lg focus:border-[#93CAD5] focus:outline-none transition" />
                </div>
              </div>

              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center hover:border-[#93CAD5] transition bg-gray-50">
                  {preview && <img src={preview} alt="preview" className="w-24 h-24 object-cover mb-3 rounded-lg shadow" />}
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  <p className="text-sm text-gray-600">Click to upload new image</p>
                </div>
              </label>

              <button type="submit" className="w-full mt-6 p-3 bg-gradient-to-r from-[#3593A6] to-[#93CAD5] text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-[1.02] transition">
                Update Product
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }

  const deleteProduct = async(id) => {
    try {
      const res = await api.delete(`/artist/addmerch/${id}`)
      console.log(deleteProduct)
      alert(res.data.message)
      getMerchItems()
    } catch(error) {
      console.log(error)
      alert(error.response.data.message)
    }
  }

  return (
    <div className="flex bg-gradient-to-br from-[#F5F5F5] to-[#E8F4F8] flex-col ml-[20%] w-[80%] p-10 min-h-screen">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Inventory Management</h1>
        <p className="text-gray-600">Manage your merchandise and track inventory</p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#93CAD5] to-[#3593A6] p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Total Products</p>
              <p className="text-3xl font-bold">{getItems.length}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#a2de79] to-[#7bc963] p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Total Stock</p>
              <p className="text-3xl font-bold">{getItems.reduce((sum, item) => sum + (item.productQuantity || 0), 0)}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#e07a7d] to-[#d65659] p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Low Stock Items</p>
              <p className="text-3xl font-bold">{getItems.filter(item => item.productQuantity < 20).length}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Add Merchandise Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-2xl shadow-xl mb-10 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="bg-gradient-to-r from-[#93CAD5] to-[#3593A6] p-3 rounded-xl mr-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">Product Name</label>
            <input {...register("productName", { required: true })} className="h-[55px] border-2 border-gray-200 p-4 rounded-xl focus:border-[#93CAD5] focus:outline-none transition" placeholder="Enter product name" />
            {errors.productName && <p className="text-red-500 text-xs mt-1">Product name is required</p>}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
            <input type="number" {...register("price", { required: true })} className="h-[55px] border-2 border-gray-200 p-4 rounded-xl focus:border-[#93CAD5] focus:outline-none transition" placeholder="0.00" />
            {errors.price && <p className="text-red-500 text-xs mt-1">Product price is required</p>}
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 mb-2">Description</label>
            <input {...register("description")} className="h-[55px] border-2 border-gray-200 p-4 rounded-xl focus:border-[#93CAD5] focus:outline-none transition" placeholder="Brief description of the product" />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">Quantity</label>
            <input type="number" {...register("stockQuantity", { required: true })} className="h-[55px] border-2 border-gray-200 p-4 rounded-xl focus:border-[#93CAD5] focus:outline-none transition" placeholder="0" />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select {...register("category", { required: true })} className="h-[55px] border-2 border-gray-200 p-4 rounded-xl focus:border-[#93CAD5] focus:outline-none transition">
              <option value="" disabled>Select Category</option>
              <option value="Clothing">Clothing</option>
              <option value="Accessories">Accessories</option>
              <option value="Signed">Signed items</option>
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">Category is required</p>}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">SKU (Optional)</label>
            <input {...register("sku")} className="h-[55px] border-2 border-gray-200 p-4 rounded-xl focus:border-[#93CAD5] focus:outline-none transition" placeholder="SKU-000" />
          </div>
        </div>

        <label className="block mt-6 cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center hover:border-[#93CAD5] transition bg-gradient-to-br from-gray-50 to-white">
            {preview ? (
              <img src={preview} alt="preview" className="w-32 h-32 object-cover mb-4 rounded-xl shadow-lg" />
            ) : (
              <div className="bg-[#93CAD5]/10 p-6 rounded-xl mb-4">
                <svg className="w-12 h-12 text-[#3593A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            <p className="text-sm font-semibold text-gray-700">Click to upload product image</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
          </div>
        </label>

        <button type="submit" className="w-full mt-8 p-4 bg-gradient-to-r from-[#3593A6] to-[#93CAD5] text-white font-bold text-lg rounded-xl hover:shadow-2xl transform hover:scale-[1.02] transition">
          Add Merchandise
        </button>
      </form>

      {/* Merchandise List */}
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-[#93CAD5] to-[#3593A6] p-3 rounded-xl mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Recent Merchandise</h2>
          </div>
          <span className="bg-[#93CAD5]/10 text-[#3593A6] px-4 py-2 rounded-full text-sm font-semibold">{getItems.length} Items</span>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4">
          {getItems.filter(item => item.visible === "Active") .map(item =>(
           
            <div key={item.productId} className="min-w-[200px] flex-shrink-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-2xl transform hover:scale-105 transition">
              <div className="relative h-48 overflow-hidden">
                <img src={`http://localhost:5000/${item.productImage}`} alt={item.productName} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                  <button
                    onClick={() => setShowPopup(item)}
                    className="w-full bg-white text-[#3593A6] py-2 rounded-lg font-semibold hover:bg-[#93CAD5] hover:text-white transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-1 truncate">{item.productName}</h3>
                <p className="text-[#3593A6] font-bold text-lg mb-3">${item.productPrice}</p>
                
                <div className="flex gap-2 mb-3">
                  <span className="bg-[#93CAD5]/10 text-[#3593A6] px-3 py-1 rounded-full text-xs font-semibold">
                    Stock: {item.productQuantity}
                  </span>
                </div>

                <div className="space-y-2">
                  <button 
                    onClick={() => setEditpopup(item)} 
                    className="w-full p-2.5 bg-gradient-to-r from-[#3593A6] to-[#93CAD5] text-white rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105"
                  >
                    Edit Product
                  </button>
                  <button 
                    className="w-full p-2.5 bg-gradient-to-r from-[#e07a7d] to-[#d65659] text-white rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105" 
                    onClick={() => deleteProduct(item.productId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editpopup && <EditMerchModal item={editpopup} close={() => setEditpopup(null)} refresh={getMerchItems} />}

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowPopup(null)}>
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full transform animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-[#3593A6]">{showPopup.productName}</h3>
              <button onClick={() => setShowPopup(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#93CAD5]/10 to-[#3593A6]/10 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-[#a2de79] p-2 rounded-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Units Sold</p>
                    <p className="text-2xl font-bold text-gray-800">{showPopup.OrderItems.reduce((sum, item) => sum + item.quantity, 0)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#93CAD5]/10 to-[#3593A6]/10 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-[#3593A6] p-2 rounded-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Remaining Stock</p>
                    <p className="text-2xl font-bold text-gray-800">{showPopup.productQuantity}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-[#a2de79]/20 to-[#7bc963]/20 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Total Sales</p>
                  <p className="text-xl font-bold text-gray-800">{showPopup.OrderItems.reduce((a, b) => a + Number(b.totalPrice), 0)}</p>
                </div>

                <div className="bg-gradient-to-br from-[#93CAD5]/20 to-[#3593A6]/20 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Net Profit</p>
                  <p className="text-xl font-bold text-gray-800">{showPopup.OrderItems.reduce((a, b) => a + Number(b.totalPrice), 0)*0.40}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from { 
            opacity: 0;
            transform: scale(0.9);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export { AddMerch };