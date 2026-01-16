import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Merchandise = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [cartUpdated, setCartUpdated] = useState(false); 
  const navigate = useNavigate();


  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/merch", {
        params: {
          category: selectedCategory === "All" ? "" : selectedCategory,
          sort: sortOrder,
          search: search,
        },
      });
      setProducts(response.data.data);
      console.log(response.data.data)
      console.log(response.data.message)
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortOrder, search]);

  const handleAddToCart = async (product) => {
    try {
      await api.post("/api/cart", {
        productId: product.productId,
        quantity: 1, 
      });
      setCartUpdated(true);
      alert("added to cart sucessfully");
      setTimeout(() => setCartUpdated(false), 1500);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Failed to add to cart.");
    }
  };


  const handleBuyNow = async(product) => {
      try {
    const res = await api.post("/api/cart", {
      productId: product.productId,
      quantity: 1,
    });
console.log(res.data.data.id)
console.log("ola")
    const cartItemId = res.data.data.id; 
    navigate("/checkout", { state: { cartItemIds: [cartItemId] } });
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Failed to buy product.");
  }
  };

  return (
    <>
      <main className="mt-20 min-h-screen bg-[#F5F5F5] pb-10">
        {/* Hero */}
        <section className=" mx-auto px-4 pt-8">
           <div
            className="text-white py-16 px-10 rounded-2xl text-center mb-10"
            style={{ background: `linear-gradient(to right, #3593A6, #66c7d6)` }}
            
          >    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Official Event Merchandise
          </h1></div>
      
          <p className="text-sm text-gray-600 mb-6">
            Exclusive merchandise from your favorite events and artists.
          </p>

          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="flex items-center bg-white rounded-lg shadow px-3 py-2 w-full md:w-80">
              <span className="mr-2 text-gray-400 text-sm"></span>
              <input
                type="text"
                placeholder="Search merchandise.."
                className="w-full h-10 text-sm outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="bg-white rounded-lg shadow px-3 py-2 text-sm w-full md:w-40 h-10"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
            </select>

            <p className="ml-auto text-sm font-medium">
              {products.length} items found
            </p>
          </div>

          {cartUpdated && (
            <p className="mt-3 text-green-600 font-medium">
              Added to cart!
            </p>
          )}
        </section>

        {/* Content */}
        <section className=" mx-auto px-4 mt-6 flex gap-6 ">
          {/* Sidebar */}
          <aside className="w-70 bg-[#3593A6]/22 rounded-2xl p-5 sticky ">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            {["All", "Clothing", "Accessories", "Signed"].map((cat) => (
              <button
                key={cat}
                className={`w-full text-left mb-3 py-2 px-4 rounded-md text-sm font-medium ${
                  selectedCategory === cat
                    ? "bg-[#3593A6] text-white"
                    : "bg-white text-[#333] hover:bg-[#3593A6]/30"
                } transition`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === "All" ? "All products" : cat}
              </button>
            ))}
          </aside>

          {/* Products Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {loading ? (
              <p>Loading products...</p>
            ) : products.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 text-lg">
                No products found 
              </p>
            ) : (
              products.map((item) => (
                           <div key={item.productId} className="min-w-[200px] flex-shrink-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-2xl transform hover:scale-105 transition">
              <div className="relative h-48 overflow-hidden">
                <img src={`http://localhost:5000/${item.productImage}`} alt={item.productName} className="w-full h-full object-contain group-hover:scale-110 transition duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-1 truncate">{item.productName}</h3>
                <p className="text-[#3593A6] font-bold text-lg mb-3">${item.productPrice}</p>
                
                <div className="flex gap-2 mb-3">
                  <span className="bg-[#93CAD5]/10 text-[#3593A6] px-3 py-1 rounded-full text-xs font-semibold">
                  Available: {item.productQuantity}
                  </span>
                   <span className="bg-[#93CAD5]/10 text-[#3593A6] px-3 py-1 rounded-full text-xs font-semibold">
                  Product by: {item.User.name}
                  </span>
                </div>

                <div className="space-y-2">
                  <button 
                    onClick={()=>handleAddToCart(item)} 
                    className="w-full p-2.5 bg-gradient-to-r from-[#3593A6] to-[#93CAD5] text-white rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105"
                  >
                   Add to cart
                  </button>
                  <button 
                    className="w-full p-2.5  text-[#3593A6] border-2 border-[#93CAD5] rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105" 
                    onClick={()=>handleBuyNow(item)}
                  >
                    Buy now
                  </button>
                </div>
              </div>
            </div>
                
              ))
            )}
            
          </div>
        </section>
      </main>
    </>
  );
};

export default Merchandise;
