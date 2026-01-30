import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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
      toast.success("added to cart sucessfully");
      setTimeout(() => setCartUpdated(false), 1500);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      toast.error("Failed to add to cart.");
    }
  };


  const handleBuyNow = async (product) => {
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
      toast.error(err.response?.data?.message || "Failed to buy product.");
    }
  };

  return (
    <>
      <main className="mt-4 min-h-screen bg-slate-50 pb-16">
        {/* Hero Section */}
        <section className="max-w-[1400px] mx-auto px-6 pt-8">
          <div className="bg-[#3593A6] rounded-3xl overflow-hidden shadow-2xl mb-8">
            <div className="relative py-12 px-10">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full blur-3xl"></div>

              <div className="relative z-10 text-center">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span className="text-white font-semibold text-xs">Official Merchandise Store</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                  Event Merchandise
                </h1>
                <p className="text-white/90 text-base max-w-xl mx-auto">
                  Exclusive merchandise from your favorite events and artists
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 w-full lg:max-w-md">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search for merchandise..."
                  className="w-full h-12 pl-12 pr-4 bg-slate-50 rounded-xl border-2 border-slate-200 outline-none focus:border-[#3593A6] focus:bg-white transition-all text-slate-700 placeholder:text-slate-400"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Sort and Results */}
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <div className="flex items-center gap-3">
                  <label className="text-slate-600 font-medium text-sm whitespace-nowrap">Sort by:</label>
                  <select
                    className="h-12 px-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-700 font-medium outline-none focus:border-[#3593A6] focus:bg-white transition-all cursor-pointer"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="Newest">Newest First</option>
                    <option value="Oldest">Oldest First</option>
                  </select>
                </div>

                <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#3593A6]/10 rounded-xl">
                  <svg className="w-5 h-5 text-[#3593A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="text-[#3593A6] font-bold text-sm">
                    {products.length} {products.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
              </div>
            </div>

            {/* Cart Success Message */}
            {cartUpdated && (
              <div className="mt-4 flex items-center gap-3 bg-emerald-50 border-2 border-emerald-500 rounded-xl px-4 py-3 animate-[slideDown_0.3s_ease-out]">
                <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-700 font-semibold">Successfully added to cart!</span>
              </div>
            )}
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-[1400px] mx-auto px-6 flex gap-8">
          {/* Sidebar Categories */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-[#3593A6] rounded-full"></div>
                <h2 className="text-xl font-bold text-slate-800">Categories</h2>
              </div>

              <div className="space-y-2">
                {["All", "Clothing", "Accessories", "Signed"].map((cat) => (
                  <button
                    key={cat}
                    className={`w-full text-left py-3.5 px-5 rounded-xl font-semibold transition-all duration-200 ${selectedCategory === cat
                      ? "bg-[#3593A6] text-white shadow-lg shadow-[#3593A6]/25 scale-[1.02]"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 hover:scale-[1.01]"
                      }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{cat === "All" ? "All Products" : cat}</span>
                      {selectedCategory === cat && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Mobile Category Pills */}
          <div className="lg:hidden w-full mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {["All", "Clothing", "Accessories", "Signed"].map((cat) => (
                <button
                  key={cat}
                  className={`flex-shrink-0 py-2.5 px-5 rounded-full font-semibold transition-all ${selectedCategory === cat
                    ? "bg-[#3593A6] text-white"
                    : "bg-white text-slate-700 border-2 border-slate-200"
                    }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === "All" ? "All Products" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-[#3593A6]/30 border-t-[#3593A6] rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-600 font-medium">Loading products...</p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No products found</h3>
                <p className="text-slate-500">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((item) => (
                  <div
                    key={item.productId}
                    className="group bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-2xl hover:border-[#3593A6]/30 transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Product Image */}
                    <div className="relative h-64 bg-slate-50 overflow-hidden">
                      <img
                        src={`http://localhost:5000/${item.productImage}`}
                        alt={item.productName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="inline-block bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-[#3593A6] text-xs font-bold shadow-lg">
                          {item.productCategory || 'Merchandise'}
                        </span>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-6">
                      <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-1 group-hover:text-[#3593A6] transition-colors">
                        {item.productName}
                      </h3>

                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-[#3593A6] font-bold text-2xl">
                          NPR {item.productPrice}
                        </span>
                        <span className="text-slate-400 text-sm line-through">
                          NPR {(item.productPrice * 1.2).toFixed(2)}
                        </span>
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap gap-2 mb-5">
                        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg">
                          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <span className="text-slate-600 text-xs font-semibold">
                            {item.productQuantity} available
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 bg-[#3593A6]/10 px-3 py-1.5 rounded-lg">
                          <svg className="w-4 h-4 text-[#3593A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-[#3593A6] text-xs font-semibold line-clamp-1">
                            {item.User.name}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="group/btn w-full py-3.5 bg-[#3593A6] text-white rounded-xl font-bold shadow-lg shadow-[#3593A6]/25 hover:bg-[#2d7a8a] hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Add to Cart
                        </button>

                        <button
                          onClick={() => handleBuyNow(item)}
                          className="w-full py-3.5 bg-white text-[#3593A6] border-2 border-[#3593A6] rounded-xl font-bold hover:bg-[#3593A6] hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
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