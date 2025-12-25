import { useState } from "react";

function AddMerch(){

    const [productname,setProductName] = useState("")
    const [price,setPrice] = useState("")
    const [Description,setDescription] = useState("")
    const [stockquantity,setQuantity] = useState("")
    const [category,setCategory] = useState("")
    const [sku,setSku] = useState("")
    const [selectedimage,setSelectedImage] = useState("")
    const [preview,setImagePreviewUrl] = useState("")
    const [showpopup,setShowpopup]  = useState(null)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };


const merchandiseItems= [
  {
    id: 1,
    name: "Classic White Tee",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop",
    inStock: true,
  },
  {
    id: 2,
    name: "Denim Jacket",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=200&fit=crop",
    inStock: true,
  },
  {
    id: 3,
    name: "Running Shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop",
    inStock: true,
  },
  {
    id: 4,
    name: "Leather Watch",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=200&h=200&fit=crop",
    inStock: false,
  },
  {
    id: 5,
    name: "Canvas Backpack",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop",
    inStock: false,
  },
];

return(
    <>
    <div className="flex bg-[#F5F5F5] flex-col ml-[20%] w-[80%] p-10">
 <div className="flex items-start mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
          Inventory Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your inventory and update product details.
        </p>
      </div>
      <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
      
      </button>
    </div>
    <div className="bg-white rounded-xl p-5 shadow-lg ">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-foreground">Product Details</h2>

</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">

            Product name
          </label>
          <input 
          value={productname}
          onChange={e=>setProductName(e.target.value)}
          type='text' 
            placeholder="Enter product name"
      
            className="md:w-130 h-[60px] border border-black rounded-md p-4"
          />
        </div>


        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
         
            Price
          </label>

            <input
                value={price}
          onChange={e=>setPrice(e.target.value)}
            type='text' 
              placeholder="0.00"
    
              className="md:w-130 h-[60px] border border-black rounded-md p-4"
            />

        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
     
            Description
          </label>
          <input
              value={Description}
          onChange={e=>setDescription(e.target.value)}
          type='text' 
            placeholder="Enter product description"
            className="md:w-130 h-[60px] border border-black rounded-md p-4"
          />
        </div>


        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
   
            Stock quantity
          </label>
          <div className="relative">
            <input 
                 value={stockquantity}
          onChange={e=>setQuantity(e.target.value)}
              type="number"
              placeholder="0"
              className="md:w-130 h-[60px] border border-black rounded-md p-4"
            />
            <span className="absolute right-16 bottom-1 text-xs text-muted-foreground">
              Max: 500
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
       
            Category
          </label>
            <select className="md:w-130 h-[60px] border border-black rounded-md p-4"
                 value={category}
          onChange={e=>setCategory(e.target.value)}>
                <option value="" disabled>Select Category</option>
              <option value="Clothing">Clothing</option>
              <option value="Accesories">Accessories</option>
              <option value="Signed items">Signed items</option>
            </select>

        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
    
            SKU
          </label>
          <input
          value={sku}
          onChange={(e)=>setSku(e.target.value)}
            placeholder="Enter SKU"
            className="md:w-130 h-[60px] border border-black rounded-md p-4"
          />
        </div>
        </div>

 <div className=" rounded-xl p-5 shadow-sm border h-full flex flex-col mt-10">
      <div className="flex items-center gap-2 mb-5">
        <h2 className="font-semibold text-foreground">Media</h2>
      </div>

        <label htmlfor="image-upload">
      <div className="flex-1 border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer mb-4">
        
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 ">

              <img src={selectedimage? preview : "/images/preview.png"} alt="Preview" />
  
        </div>

        <input type="file" accept="image/*" className="hidden " onChange={handleImageChange} id="image-upload"></input>
        <p className="text-sm font-medium text-foreground mb-1 ">
          Click to upload
        </p>
        <p className="text-xs text-muted-foreground">
          PNG, JPG, JPEG
        </p>

      </div>
      </label>


      <button className="p-3 text-white text-[15px] rounded-md mt-4 transition hover:opacity-70 bg-[#93CAD5] " onClick={""}>
        Add Merchandise
      </button>
    </div>
    
    <div className="bg-card rounded-xl p-5 bg-[#F5F5F5] mt-10">

        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-foreground">Recent Merchandise</h2>
        </div>


      <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1 ">
        {merchandiseItems.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-32 md:w-36 relative group"
          >
              <button onClick={()=>setShowpopup(item)}  className="w-25 h-7 bg-[#93CAD5] rounded-md text-white text-sm absolute  z-1 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none  group-hover:pointer-events-auto group-hover:opacity-100 flex justify-center items-center transition-opacity duration-300  hover:bg-green-600 transition">
                View details
              </button>
              
              {showpopup && (
  <div className="fixed left-[20%] top-0 bottom-0 right-0 z-2  backdrop-blur-[1px] flex items-center justify-center " onClick={()=>setShowpopup}>

    <div className="bg-white p-6 rounded-lg shadow-lg  w-80 relative ">
      
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-black"
        onClick={() => setShowpopup(null)}
      >
        X
      </button>

      <h3 className="text-lg font-semibold mb-2">{showpopup.name}</h3>
      <span className="block">Sold out: 45</span>
      <span className="block">Remaining: 4</span>
      <span className="block">Sale amount: 2</span>
    </div>
  </div>
)   }   
                       <div className="relative rounded-xl overflow-hidden mb-2 ">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-32 md:h-36 object-cover group-hover:opacity-30 transition "
              /> 
            
              {item.inStock ?  
                <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-bold bg-success text-success-foreground rounded-full text-[green] ">
                  In Stock
                </span> :   <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-bold bg-success text-success-foreground rounded-full text-[red] ">
                 Out of stock
                </span>
              }
            </div>
            <p className="text-sm font-medium ">
              {item.name}
            </p>
          </div>
        ))}
        </div>
        </div>
        </div>
        </div>
        </>
)}
        export{ AddMerch}