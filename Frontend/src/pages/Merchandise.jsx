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
              products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white group rounded-2xl p-5 w-60 shadow flex flex-col hover:shadow-lg transition"
                >
                  <div className="bg-gray-100 rounded-xl h-40 flex items-center justify-center mb-4">
                    <img 
                      src={`http://localhost:5000/${product.productImage}`} 
                      className="w-full h-full rounded-2xl group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <span className="text-xs text-gray-400 tracking-wide mb-1">{product.User.name}</span>
                  <span className="text-xs text-gray-400">{product.skuNumber}</span>
                  <p className="text-sm mb-1">{product.productName}</p>
                  <p className="text-sm font-semibold mb-3">${product.productPrice}</p>

                  <button
                    className="mt-auto py-2 rounded-lg text-sm font-medium text-white bg-[#95c9d3] hover:bg-[#7fbac6] transition-all hover:scale-105"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button> 
                  <button
                    className="mt-3 py-2 rounded-lg text-sm font-medium text-black border border-[#7fbac6] hover:bg-[#7fbac6]/10 transition-all hover:scale-105"
                    onClick={() => handleBuyNow(product)}
                  >
                    Buy 
                  </button>
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
