import React, { useState, useEffect } from "react";
import axios from "axios";

const Merchandise = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch products from backend API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/merchandise", {
        params: {
          category: selectedCategory === "All" ? "" : selectedCategory,
          sort: sortOrder,
          search: search,
        },
      });
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch whenever filters change
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortOrder, search]);

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-300">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 px-4 md:px-10 gap-4">
          <div className="flex flex-wrap items-center gap-4 md:gap-20">
            <a className="font-bold text-3xl text-[#95c9d3] hover:opacity-80 transition">
              Cruise
            </a>
            <div className="flex flex-wrap gap-4 md:gap-6 text-sm md:text-lg font-bold text-[#95c9d3]">
              <a href="#" className="hover:underline">Home</a>
              <a href="#" className="hover:underline">ExploreEvents</a>
              <a href="#" className="border-b-2 border-[#95c9d3] pb-1">Shop</a>
              <a href="#" className="hover:underline">Community</a>
              <a href="#" className="hover:underline">About</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <span className="text-base font-medium">User</span>
          </div>
        </div>
      </nav>

      {/* Main Section */}
      <main className="mt-20 min-h-screen bg-gradient-to-b from-[#95c9d3] to-cyan-50 pb-10">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 pt-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Official Event Merchandise
          </h1>
          <p className="text-sm text-white/80 mb-6">
            Exclusive merchandise from your favorite events and artists.
          </p>

          {/* Search + Sort */}
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="flex items-center bg-white rounded-lg shadow px-3 py-2 w-full md:w-80">
              <span className="mr-2 text-gray-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search merchandise.."
                className="w-full text-sm outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="bg-white rounded-lg shadow px-3 py-2 text-sm w-full md:w-40"
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
        </section>

        {/* Content */}
        <section className="max-w-6xl mx-auto px-4 mt-6 flex gap-6">
          {/* Sidebar */}
          <aside className="w-56 bg-cyan-100 rounded-2xl p-5">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            {["All", "Clothing", "Accessories", "Signed"].map((cat) => (
              <button
                key={cat}
                className={`w-full text-left mb-3 py-2 px-4 rounded-full text-sm font-medium ${
                  selectedCategory === cat
                    ? "bg-[#95c9d3] text-white"
                    : "bg-cyan-200 text-[#333] hover:bg-cyan-300"
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
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-4 shadow flex flex-col hover:shadow-lg transition"
                >
                  <div className="bg-gray-100 rounded-xl h-40 flex items-center justify-center mb-4">
                    <div
                      className={`w-20 h-28 ${product.bg} rounded-md flex flex-col items-center justify-center text-white font-bold`}
                    >
                      <span className="text-xs tracking-wide mb-1">{product.label}</span>
                      <span className="text-2xl">{product.number}</span>
                    </div>
                  </div>

                  <p className="text-sm mb-1">{product.name}</p>
                  <p className="text-sm font-semibold mb-3">{product.price}</p>

                  <button className="mt-auto py-2 rounded-lg text-sm font-medium text-white bg-[#95c9d3] hover:bg-[#7fbac6] transition-all hover:scale-105">
                    Add to Cart
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
