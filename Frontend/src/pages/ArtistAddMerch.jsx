import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import api from "../api/axios";

function AddMerch() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState("");
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
      getMerchItems(); // refresh list
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add product");
      console.log(error.message);
    }
  };

  const getMerchItems = async () => {
    try {
      const res = await api.get("/artist/addmerch");
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
    }, [item, reset]);

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
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center" onClick={() => setEditpopup(null)}>
          <div className="bg-white pr-10 pl-10 pt-5 pb-5  w-70 md:w-110 rounded-lg " onClick={e => e.stopPropagation()}>
            <div className="flex flex-col">
              <label>Product Name</label>
              <input {...register("productName", { required: true })} className="h-[40px] border p-4 rounded-md" />
              {errors.productName && <p className="text-red-500 text-xs mt-1">Product name is required</p>}
            </div>

            <div className="flex flex-col mt-2">
              <label>Product Price</label>
              <input type="number" {...register("price", { required: true })} className="h-[40px] border p-4 rounded-md" />
              {errors.price && <p className="text-red-500 text-xs mt-1">Product price is required</p>}
            </div>

            <div className="flex flex-col mt-2">
              <label>Description</label>
              <input {...register("description")} className="h-[40px] border p-4 rounded-md" />
            </div>

            <div className="flex flex-col mt-2">
              <label>Stock Quantity</label>
              <input type="number" {...register("stockQuantity", { required: true })} className="h-[40px] border p-4 rounded-md" />
            </div>

            <div className="flex flex-col mt-2">
              <label>SKU</label>
              <input {...register("sku")} className="h-[40px] border p-4 rounded-md" />
            </div>

            <label className="block mt-4 cursor-pointer">
              <div className="border-2 border-dashed p-6 flex flex-col items-center">
                <img src={preview} alt="preview" className="w-10 h-10 object-cover mb-3" />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                <p className="text-sm">Click to upload</p>
              </div>
            </label>

            <button type="submit" className="w-full mt-4 p-3 bg-[#93CAD5] text-white rounded-md hover:opacity-80">Update</button>
          </div>
        </div>
      </form>
    );
  }
const deleteProduct = async(id)=>{
  try{
   const res = await api.delete(`/artist/addmerch/${id}`)
   console.log(deleteProduct)
   alert(res.data.message)
   getMerchItems()
  }
  catch(error){
    console.log(error)
    alert(error.response.data.message)
  }
   
}
  return (
    <div className="flex bg-[#F5F5F5] flex-col ml-[20%] w-[80%] p-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Inventory Management</h1>

      {/* Add Merchandise Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-5 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label>Product Name</label>
            <input {...register("productName", { required: true })} className="h-[60px] border p-4 rounded-md" />
            {errors.productName && <p className="text-red-500 text-xs mt-1">Product name is required</p>}
          </div>

          <div className="flex flex-col">
            <label>Price</label>
            <input type="number" {...register("price", { required: true })} className="h-[60px] border p-4 rounded-md" />
            {errors.price && <p className="text-red-500 text-xs mt-1">Product price is required</p>}
          </div>

          <div className="flex flex-col md:col-span-2">
            <label>Description</label>
            <input {...register("description")} className="h-[60px] border p-4 rounded-md" />
          </div>

          <div className="flex flex-col">
            <label>Quantity</label>
            <input type="number" {...register("stockQuantity", { required: true })} className="h-[60px] border p-4 rounded-md" />
          </div>

          <div className="flex flex-col">
            <label>Category</label>
            <select {...register("category", { required: true })} className="h-[60px] border p-4 rounded-md">
              <option value="" disabled>Select Category</option>
              <option value="Clothing">Clothing</option>
              <option value="Accessories">Accessories</option>
              <option value="Signed">Signed items</option>
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">Category is required</p>}
          </div>

          <div className="flex flex-col">
            <label>SKU</label>
            <input {...register("sku")} className="h-[60px] border p-4 rounded-md" />
          </div>
        </div>

        <label className="block mt-4 cursor-pointer">
          <div className="border-2 border-dashed p-6 flex flex-col items-center">
            <img src={preview || "/images/preview.png"} alt="preview" className="w-20 h-20 object-cover mb-3" />
            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            <p className="text-sm">Click to upload</p>
          </div>
        </label>

        <button type="submit" className="w-full mt-4 p-3 bg-[#93CAD5] text-white rounded-md hover:opacity-80">Add Merchandise</button>
      </form>

      {/* Merchandise List */}
      <div className="mt-10">
        <h2 className="font-semibold mb-4">Recent Merchandise</h2>
        <div className="flex gap-5 overflow-x-auto bg-white p-9 shadow-lg rounded-2xl">
          {getItems.map(item => (
            <div key={item.productId} className="w-36 flex-shrink-0 relative group">
              <button
                onClick={() => setShowPopup(item)}
                className="absolute inset-0 m-auto z-1 w-24 h-7 bg-[#a2de79] text-white text-sm opacity-0 group-hover:opacity-100 transition"
              >
                View details
              </button>
              <img src={`http://localhost:5000/${item.productImage}`} alt={item.productName} className="w-full h-36 object-cover rounded-lg group-hover:opacity-50 transition" />
              <p className="text-sm mt-2">{item.productName}</p>
              <button onClick={() => setEditpopup(item)} className="w-full p-2 mt-2 bg-[#3593A6] text-white rounded-md hover:opacity-80">Edit</button>
              <button className="w-full p-2 mt-2 bg-[#e07a7d] text-white rounded-md hover:opacity-80" onClick={()=>{deleteProduct(item.productId)}}>Delete</button>
            </div>
          ))}
        </div>
      </div>

      {editpopup && <EditMerchModal item={editpopup} close={() => setEditpopup(null)} refresh={getMerchItems} />}

      {showPopup && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center" onClick={() => setShowPopup(null)}>
          <div className="bg-white p-10 rounded-lg pr-5 pl-5 " onClick={e => e.stopPropagation()}>
            <h3 className="text-[#3593A6] text-2xl mb-7">{showPopup.productName}</h3>
            <div className="flex gap-3 items-center  "><p className="font-semibold text-gray-600 text-sm">Sold: </p>  <span className="text-gray-600 text-sm"> 32</span></div>
             <div  className="flex gap-3 items-center "><p className="font-semibold text-gray-900 text-sm">Remaining:</p> <span  className="text-gray-600 text-sm"> 32</span></div>
             <div className="flex gap-3 items-center "><p className="font-semibold text-gray-900 text-sm">Sales: </p> <span  className="text-gray-600 text-sm"> 32</span></div>
            <div className="flex gap-3 items-center "><p className="font-semibold text-gray-900 text-sm">Profit: </p> <span  className="text-gray-600 text-sm" > 32</span></div>
          </div>
        </div>
      )}
    </div>
  );
}

export { AddMerch };
