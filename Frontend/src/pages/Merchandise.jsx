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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Poppins', sans-serif;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out forwards;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #3593A6 0%, #FF6B6B 50%, #FFD93D 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .product-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .product-card:hover {
          transform: translateY(-8px) scale(1.02);
        }
        
        .shimmer-effect {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
        
        .category-btn {
          position: relative;
          overflow: hidden;
        }
        
        .category-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(53, 147, 166, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        
        .category-btn:hover::before {
          width: 300px;
          height: 300px;
        }
        
        .neon-border {
          box-shadow: 0 0 20px rgba(53, 147, 166, 0.5),
                      0 0 40px rgba(53, 147, 166, 0.3),
                      0 0 60px rgba(53, 147, 166, 0.1);
        }
        
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
      `}</style>

      <main className="mt-16 min-h-screen bg-[#0A0E27] relative overflow-hidden pb-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#3593A6] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-[#FF6B6B] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-[#FFD93D] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
        </div>

        {/* Hero Section */}
        <section className="relative max-w-[1400px] mx-auto px-6 pt-12 pb-8">
          <div className="relative bg-gradient-to-br from-[#3593A6] via-[#2d7a8a] to-[#1e5a6b] rounded-3xl overflow-hidden p-12 neon-border">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full blur-2xl"></div>
            <div className="absolute top-10 left-20 w-32 h-32 border-4 border-white/20 rounded-full"></div>
            <div className="absolute bottom-10 right-32 w-24 h-24 border-4 border-white/20 rounded-lg rotate-45"></div>
            
            <div className="relative z-10 text-center animate-slideUp">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-2.5 rounded-full mb-6 glass-effect animate-pulse-slow">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                <span className="text-white font-bold text-sm tracking-wider">OFFICIAL STORE</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-black text-white mb-4 tracking-tight">
                EVENT <span className="text-[#FFD93D]">MERCH</span>
              </h1>
              <p className="text-white/90 text-xl font-medium max-w-2xl mx-auto">
                🎉 Exclusive merchandise from your favorite events & artists
              </p>
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <section className="relative max-w-[1400px] mx-auto px-6 mb-8">
          <div className="bg-[#151B3D] rounded-2xl p-6 border border-[#3593A6]/30 animate-slideUp stagger-1">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch">
              {/* Search Input */}
              <div className="flex-1 relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3593A6] transition-all group-focus-within:scale-110">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search for awesome merchandise..."
                  className="w-full h-14 pl-14 pr-6 bg-[#0A0E27] border-2 border-[#3593A6]/40 rounded-xl text-white placeholder:text-gray-500 outline-none focus:border-[#3593A6] focus:ring-4 focus:ring-[#3593A6]/20 transition-all font-medium"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Sort Dropdown */}
              <select
                className="h-14 px-6 bg-[#0A0E27] border-2 border-[#3593A6]/40 rounded-xl text-white font-bold outline-none focus:border-[#3593A6] focus:ring-4 focus:ring-[#3593A6]/20 cursor-pointer transition-all"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="Newest">🆕 Newest First</option>
                <option value="Oldest">📅 Oldest First</option>
              </select>

              {/* Item Counter */}
              <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#3593A6] to-[#2d7a8a] rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span className="text-white font-black text-lg">{products.length}</span>
                <span className="text-white/80 font-medium">items</span>
              </div>
            </div>

            {/* Cart Success */}
            {cartUpdated && (
              <div className="mt-4 flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl px-6 py-4 animate-slideUp">
                <svg className="w-6 h-6 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white font-bold text-lg">🎉 Added to cart!</span>
              </div>
            )}
          </div>
        </section>

        {/* Main Content */}
        <section className="relative max-w-[1400px] mx-auto px-6 flex gap-8">
          {/* Categories Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0 animate-slideInLeft">
            <div className="bg-[#151B3D] rounded-2xl p-6 border border-[#3593A6]/30 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-10 bg-gradient-to-b from-[#3593A6] to-[#FFD93D] rounded-full"></div>
                <h2 className="text-2xl font-black text-white">Categories</h2>
              </div>
              
              <div className="space-y-3">
                {["All", "Clothing", "Accessories", "Signed"].map((cat, index) => (
                  <button
                    key={cat}
                    className={`category-btn w-full text-left py-4 px-6 rounded-xl font-bold transition-all relative z-10 ${
                      selectedCategory === cat
                        ? "bg-gradient-to-r from-[#3593A6] to-[#2d7a8a] text-white shadow-lg shadow-[#3593A6]/50 scale-105"
                        : "bg-[#0A0E27] text-gray-300 hover:text-white border border-[#3593A6]/20 hover:border-[#3593A6]/60"
                    }`}
                    onClick={() => setSelectedCategory(cat)}
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-lg">{cat === "All" ? "🛍️ All Products" : cat === "Clothing" ? "👕 Clothing" : cat === "Accessories" ? "🎒 Accessories" : "✍️ Signed"}</span>
                      {selectedCategory === cat && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Mobile Categories */}
          <div className="lg:hidden w-full mb-6 animate-slideUp">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {["All", "Clothing", "Accessories", "Signed"].map((cat) => (
                <button
                  key={cat}
                  className={`flex-shrink-0 py-3 px-6 rounded-full font-bold transition-all ${
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-[#3593A6] to-[#2d7a8a] text-white shadow-lg"
                      : "bg-[#151B3D] text-gray-300 border border-[#3593A6]/30"
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === "All" ? "🛍️ All" : cat === "Clothing" ? "👕 " + cat : cat === "Accessories" ? "🎒 " + cat : "✍️ " + cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 border-8 border-[#3593A6]/20 rounded-full"></div>
                    <div className="absolute inset-0 border-8 border-transparent border-t-[#3593A6] rounded-full animate-spin"></div>
                  </div>
                  <p className="text-white font-bold text-xl">Loading amazing products...</p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-[#151B3D] rounded-2xl border border-[#3593A6]/30 p-16 text-center animate-slideUp">
                <div className="w-32 h-32 bg-gradient-to-br from-[#3593A6] to-[#2d7a8a] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-3xl font-black text-white mb-3">No products found</h3>
                <p className="text-gray-400 text-lg">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((item, index) => (
                  <div 
                    key={item.productId} 
                    className="product-card bg-[#151B3D] rounded-2xl border-2 border-[#3593A6]/30 overflow-hidden animate-slideUp hover:border-[#3593A6] hover:shadow-2xl hover:shadow-[#3593A6]/30"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    {/* Product Image */}
                    <div className="relative h-72 bg-gradient-to-br from-[#0A0E27] to-[#151B3D] overflow-hidden group">
                      <img 
                        src={`http://localhost:5000/${item.productImage}`} 
                        alt={item.productName} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E27] via-transparent to-transparent opacity-60"></div>
                      
                      {/* Floating Badge */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-gradient-to-r from-[#FFD93D] to-[#FF6B6B] text-[#0A0E27] px-4 py-2 rounded-full font-black text-xs shadow-lg animate-pulse-slow">
                          HOT 🔥
                        </div>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-[#3593A6]/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="text-center transform scale-75 group-hover:scale-100 transition-transform">
                          <svg className="w-16 h-16 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <p className="text-white font-bold">Quick View</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Product Details */}
                    <div className="p-6">
                      <h3 className="font-black text-white text-xl mb-3 line-clamp-1 hover:text-[#3593A6] transition-colors">
                        {item.productName}
                      </h3>
                      
                      <div className="flex items-baseline gap-3 mb-4">
                        <span className="text-[#3593A6] font-black text-3xl">
                          ${item.productPrice}
                        </span>
                        <span className="text-gray-500 text-lg line-through font-bold">
                          ${(item.productPrice * 1.3).toFixed(2)}
                        </span>
                        <span className="ml-auto bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-black">
                          SAVE 30%
                        </span>
                      </div>
                      
                      {/* Meta Tags */}
                      <div className="flex gap-2 mb-5 flex-wrap">
                        <div className="flex items-center gap-1.5 bg-[#3593A6]/20 px-3 py-2 rounded-lg border border-[#3593A6]/40">
                          <svg className="w-4 h-4 text-[#3593A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <span className="text-white text-xs font-bold">
                            {item.productQuantity} left
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 bg-[#FFD93D]/20 px-3 py-2 rounded-lg border border-[#FFD93D]/40">
                          <svg className="w-4 h-4 text-[#FFD93D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-[#FFD93D] text-xs font-bold line-clamp-1">
                            by {item.User.name}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <button 
                          onClick={() => handleAddToCart(item)} 
                          className="group/btn w-full py-4 bg-gradient-to-r from-[#3593A6] to-[#2d7a8a] text-white rounded-xl font-black text-lg shadow-lg shadow-[#3593A6]/40 hover:shadow-2xl hover:shadow-[#3593A6]/60 transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105 active:scale-95"
                        >
                          <svg className="w-6 h-6 group-hover/btn:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Add to Cart
                        </button>
                        
                        <button 
                          onClick={() => handleBuyNow(item)}
                          className="w-full py-4 bg-[#0A0E27] text-[#3593A6] border-2 border-[#3593A6] rounded-xl font-black text-lg hover:bg-[#3593A6] hover:text-white transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105 active:scale-95"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default Merchandise;