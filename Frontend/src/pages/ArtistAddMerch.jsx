import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";


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
      toast(res.data.message, "success");
      reset();
      setSelectedImage(null);
      setPreview("");
      getMerchItems();
    } catch (error) {
      toast(error.response?.data?.message || "Failed to add product", "error");
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
        toast("Updated successfully", "success");
        refresh();
        close();
      } catch (error) {
        console.log(error);
       toast("Failed to update", "error");
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
      toast(res.data.message, "success")
      getMerchItems()
    } catch(error) {
      console.log(error)
      toast(error.response?.data?.message || "Failed to delete product", "error")
    }
  }

  return (
    <div className="flex bg-[#F3F6F8] flex-col ml-[22%]  px-10 py-8 min-h-screen">

      <div className="mb-8 border-b border-gray-200 pb-5 flex items-center justify-between">
        <div>
          <h1 className="text-[2.1rem] font-semibold tracking-tight text-gray-900 mb-1">
            Inventory Management
          </h1>
          <p className="text-sm text-gray-500">
            Curate, track and refine your merchandise in one place.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>Artist dashboard · Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-9">
        <div className="bg-[green]/10 border border-gray-100/80 rounded-2xl shadow-sm px-5 py-4 hover:shadow-md hover:-translate-y-[1px] transition-all duration-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[0.75rem] font-medium tracking-wide uppercase text-gray-500">
              Total Products
            </p>
            <div className="h-8 w-8 rounded-xl bg-[#EFF7FA] flex items-center justify-center text-[#3593A6]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-semibold tracking-tight text-gray-900">
            {getItems.filter(item => item.visible === "Active").length}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Active pieces currently in your store.
          </p>
        </div>

        <div className="bg-[blue]/10 border border-gray-100/80 rounded-2xl shadow-sm px-5 py-4 hover:shadow-md hover:-translate-y-[1px] transition-all duration-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[0.75rem] font-medium tracking-wide uppercase text-gray-500">
              Total Stock
            </p>
            <div className="h-8 w-8 rounded-xl bg-[#F3FAF3] flex items-center justify-center text-emerald-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-semibold tracking-tight text-gray-900">
            {getItems.filter(item => item.visible === "Active").reduce((sum, item) => sum + (item.productQuantity || 0), 0)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Units available across all active products.
          </p>
        </div>

        <div className="bg-[red]/10 border border-gray-100/80 rounded-2xl shadow-sm px-5 py-4 hover:shadow-md hover:-translate-y-[1px] transition-all duration-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[0.75rem] font-medium tracking-wide uppercase text-gray-500">
              Low Stock Items
            </p>
            <div className="h-8 w-8 rounded-xl bg-[#FFF4F3] flex items-center justify-center text-[#d65659]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-semibold tracking-tight text-gray-900">
            {getItems.filter(item => item.visible === "Active").filter(item => item.productQuantity < 20).length}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Items to consider restocking soon.
          </p>
        </div>
      </div>

      {/* Add Merchandise Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white/95 p-8 rounded-2xl shadow-sm mb-10 border border-gray-200/70">
        <div className="flex items-center mb-6">
          <div className="bg-[#EFF7FA] p-3 rounded-xl mr-3 border border-[#D6E7EE]">
            <svg className="w-5 h-5 text-[#3593A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
              Add new product
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Create a new piece of merch with pricing, stock and imagery.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1.5">Product name</label>
            <input
              {...register("productName", { required: true })}
              className="h-[52px] border border-gray-200/80 bg-gray-50/60 px-4 rounded-xl focus:border-[#3593A6] focus:ring-2 focus:ring-[#93CAD5]/40 focus:outline-none text-sm placeholder:text-gray-400 transition"
              placeholder="Limited edition hoodie, enamel pin…"
            />
            {errors.productName && <p className="text-[#e07a7d] text-xs mt-1">Product name is required</p>}
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1.5">Price (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">$</span>
              <input
                type="number"
                {...register("price", { required: true })}
                className="h-[52px] w-full border border-gray-200/80 bg-gray-50/60 pl-7 pr-4 rounded-xl focus:border-[#3593A6] focus:ring-2 focus:ring-[#93CAD5]/40 focus:outline-none text-sm placeholder:text-gray-400 transition"
                placeholder="0.00"
              />
            </div>
            {errors.price && <p className="text-[#e07a7d] text-xs mt-1">Product price is required</p>}
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="text-xs font-medium text-gray-600 mb-1.5">Description</label>
            <input
              {...register("description")}
              className="h-[52px] border border-gray-200/80 bg-gray-50/60 px-4 rounded-xl focus:border-[#3593A6] focus:ring-2 focus:ring-[#93CAD5]/40 focus:outline-none text-sm placeholder:text-gray-400 transition"
              placeholder="Brief description of the product"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1.5">Quantity</label>
            <input
              type="number"
              {...register("stockQuantity", { required: true })}
              className="h-[52px] border border-gray-200/80 bg-gray-50/60 px-4 rounded-xl focus:border-[#3593A6] focus:ring-2 focus:ring-[#93CAD5]/40 focus:outline-none text-sm placeholder:text-gray-400 transition"
              placeholder="0"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1.5">Category</label>
            <select
              {...register("category", { required: true })}
              className="h-[52px] border border-gray-200/80 bg-gray-50/60 px-4 rounded-xl focus:border-[#3593A6] focus:ring-2 focus:ring-[#93CAD5]/40 focus:outline-none text-sm text-gray-700 transition"
            >
              <option value="" disabled>Select a category</option>
              <option value="Clothing">Clothing</option>
              <option value="Accessories">Accessories</option>
              <option value="Signed">Signed items</option>
            </select>
            {errors.category && <p className="text-[#e07a7d] text-xs mt-1">Category is required</p>}
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1.5">SKU (optional)</label>
            <input
              {...register("sku")}
              className="h-[52px] border border-gray-200/80 bg-gray-50/60 px-4 rounded-xl focus:border-[#3593A6] focus:ring-2 focus:ring-[#93CAD5]/40 focus:outline-none text-sm placeholder:text-gray-400 transition"
              placeholder="SKU-000"
            />
          </div>
        </div>

        <label className="block mt-6 cursor-pointer">
          <div className="border border-dashed border-gray-300 rounded-xl p-7 flex flex-col items-center hover:border-[#3593A6] hover:bg-[#F7FBFD] transition-colors bg-gray-50/80">
            {preview ? (
              <img src={preview} alt="preview" className="w-32 h-32 object-cover mb-4 rounded-xl shadow-md border border-white" />
            ) : (
              <div className="bg-white border border-dashed border-gray-200 p-5 rounded-xl mb-4 flex items-center justify-center">
                <svg className="w-10 h-10 text-[#3593A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            <p className="text-sm font-medium text-gray-800">Upload product image</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB · Square images look best.</p>
          </div>
        </label>

        <button
          type="submit"
          className="w-full mt-7 h-[52px] inline-flex items-center justify-center gap-2 bg-[#1F6D7E] text-white font-medium text-sm rounded-xl shadow-sm hover:shadow-md hover:bg-[#1a5c6a] active:bg-[#164f5c] transition-colors"
        >
          Add Merchandise
        </button>
      </form>

      {/* Merchandise List */}
      <div className="bg-white/95 p-8 rounded-2xl shadow-sm border border-gray-200/70">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-[#EFF7FA] p-3 rounded-xl border border-[#D6E7EE]">
              <svg className="w-5 h-5 text-[#3593A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
                Recent merchandise
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Swipe through your latest drops and manage stock instantly.
              </p>
            </div>
          </div>
          <span className="bg-gray-50 text-gray-700 px-4 py-1.5 rounded-full text-xs font-medium border border-gray-200">
            {getItems.length} items total
          </span>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {getItems.filter(item => item.visible === "Active") .map(item =>(
           
            <div key={item.productId} className="min-w-[220px] flex-shrink-0 bg-white rounded-2xl shadow-sm border border-gray-200/70 overflow-hidden group hover:shadow-md hover:-translate-y-[2px] transition-all duration-200">
              <div className="relative h-44 overflow-hidden bg-gray-100">
                <img src={`http://localhost:5000/${item.productImage}`} alt={item.productName} className="w-full h-full object-cover group-hover:scale-[1.04] transition duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">
                  <button
                    onClick={() => setShowPopup(item)}
                    className="w-full bg-white/95 text-[#1F6D7E] py-1.5 rounded-lg text-xs font-medium hover:bg-[#1F6D7E] hover:text-white transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-medium text-gray-900 mb-0.5 truncate">{item.productName}</h3>
                  <p className="text-[#1F6D7E] font-semibold text-base">
                    ${item.productPrice}
                  </p>
                </div>
                
                <div className="flex gap-2 mb-3">
                  <span className="bg-[#EFF7FA] text-[#1F6D7E] px-3 py-1 rounded-full text-[0.7rem] font-medium">
                    Stock: {item.productQuantity}
                  </span>
                </div>

                <div className="space-y-2">
                  <button 
                    onClick={() => setEditpopup(item)} 
                    className="w-full py-2 text-xs bg-[#1F6D7E] text-white rounded-lg font-medium hover:bg-[#1a5c6a] transition-colors"
                  >
                    Edit Product
                  </button>
                  <button 
                    className="w-full py-2 text-xs bg-white text-[#d65659] border border-[#f2b5b7] rounded-lg font-medium hover:bg-[#FFF4F3] transition-colors" 
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
          <div className="bg-white/95 p-7 rounded-2xl shadow-2xl max-w-md w-full transform animate-scale-in border border-gray-100" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 tracking-tight">{showPopup.productName}</h3>
                <p className="text-xs text-gray-500 mt-1">Performance overview for this product</p>
              </div>
              <button onClick={() => setShowPopup(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>

            <div className="space-y-4">
              <div className="bg-[#F4FAFB] p-4 rounded-xl flex items-center justify-between border border-[#D6E7EE]">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-lg border border-[#a2de79]/40">
                    <svg className="w-5 h-5 text-[#7bc963]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Units Sold</p>
                    <p className="text-2xl font-bold text-gray-800">{showPopup.OrderItems.reduce((sum, item) => sum + item.quantity, 0)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#F4FAFB] p-4 rounded-xl flex items-center justify-between border border-[#D6E7EE]">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-lg border border-[#3593A6]/30">
                    <svg className="w-5 h-5 text-[#3593A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <div className="bg-[#F8FFF7] p-4 rounded-xl border border-[#a2de79]/40">
                  <p className="text-xs text-gray-500 mb-1">Total sales</p>
                  <p className="text-xl font-bold text-gray-800">{showPopup.OrderItems.reduce((a, b) => a + Number(b.totalPrice), 0)}</p>
                </div>

                <div className="bg-[#F4FAFB] p-4 rounded-xl border border-[#D6E7EE]">
                  <p className="text-xs text-gray-500 mb-1">Net profit (est.)</p>
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