// Simulated DB (replace this with real DB query later)

const productsDB = [
  { id: "messi-shirt", name: "Messi Signature T-Shirt", price: "$5000", bg: "bg-pink-400", label: "MESSI", number: "10", category: "Clothing", date: "2025-12-01" },
  { id: "ronaldo-hoodie", name: "Ronaldo Hoodie", price: "$4200", bg: "bg-blue-400", label: "RONALDO", number: "7", category: "Clothing", date: "2025-12-05" },
  { id: "neymar-jersey", name: "Neymar Signed Jersey", price: "$6000", bg: "bg-green-400", label: "NEYMAR", number: "11", category: "Signed", date: "2025-12-03" },
  { id: "messi-cap", name: "Messi Cap", price: "$1500", bg: "bg-purple-400", label: "MESSI", number: "1", category: "Accessories", date: "2025-12-02" },
  { id: "ronaldo-scarf", name: "Ronaldo Scarf", price: "$1200", bg: "bg-yellow-400", label: "RONALDO", number: "2", category: "Accessories", date: "2025-12-04" },
  { id: "signed-ball", name: "Signed Football", price: "$8000", bg: "bg-red-400", label: "NEYMAR", number: "99", category: "Signed", date: "2025-12-06" },
];

export const getProducts = (req, res) => {
  const { category, sort, search } = req.query;

  let filtered = [...productsDB];

  if (category) filtered = filtered.filter(p => p.category === category);
  if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  if (sort === "Newest") filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  if (sort === "Oldest") filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

  res.json(filtered);
};
