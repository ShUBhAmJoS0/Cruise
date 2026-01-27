import { ShoppingCart, DollarSign, MapPin,  ShoppingBag, Users, Shirt } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import DataTable from "react-data-table-component";
import api from "../api/axios";


const merchColumns = [
  {
    name: "Product",
    selector: row => row.productName,
    sortable: true,
    grow: 2,
  },
  {
    name: "Date Added",
    selector: row =>  `${new Date(row.createdAt).toLocaleDateString()}`,
  },
  {
    name: "Ordered",
    selector: row => `${row.OrderItems.reduce((sum, item) => sum + item.quantity, 0)}`,
    center: true,
  },
  {
    name: "In Stock",
    selector: row => row.productQuantity,
    center: true,
  },
  {
    name: "Revenue",
    selector: row => `Rs. ${row.OrderItems.reduce((a, b) => a + Number(b.totalPrice), 0)}`,
    right: true,
  },
    {
    name: "Profit",
    selector: row => `Rs. ${Math.round((row.OrderItems.reduce((a, b) => a + Number(b.totalPrice), 0))*0.20)}`,
    right: true,
  },
];
const MerchExpanded = ({ data}) => (

  <div className="bg-[#F4FAFB] p-6 rounded-2xl mx-4 mb-5 shadow-inner border border-[#D6E7EE]/70">
    <div className="flex items-center justify-between mb-4">
      <h4 className="font-semibold text-sm uppercase tracking-[0.16em] text-[#3593A6]">
        Purchase details
      </h4>
      <span className="text-[0.7rem] text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
        {data.OrderItems.length} orders for this item
      </span>
    </div>

    <div className="space-y-3">
      {data.OrderItems.map((b, i) => (
        <div
          key={i}
          className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="mb-3 sm:mb-0">
            <p className="font-medium text-gray-900">{b.Order?.User?.name}</p>
            <p className="text-xs text-gray-500">
              Qty: <span className="font-medium text-gray-700">{b.quantity}</span>
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <p className="font-semibold text-[#1F6D7E] text-sm">
              Rs. {b.totalPrice}
            </p>
            <span
              className={`text-[0.7rem] px-3 py-1 rounded-full border ${
                b.Order.status === "Shipped"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {b.Order?.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);
const Stat = ({ title, value, icon }) => (
  <div className="bg-white/95 p-4 rounded-2xl shadow-sm border border-gray-200/70 flex items-center gap-4">
    <div className="p-3 rounded-xl bg-[#EFF7FA] text-[#1F6D7E] border border-[#D6E7EE]">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[0.7rem] uppercase tracking-[0.12em] text-gray-500 mb-1">
        {title}
      </p>
      <h3 className="text-xl font-semibold text-gray-900 truncate">{value}</h3>
    </div>
  </div>
);

export function ViewMerchandiseTable() {
    const[merchData,setGetItems]=useState([]);
    const getMerchItems = async () => {
    try {
      const res = await api.get("/artist/allmerch/details");
      console.log(res.data.data)
      console.log(res.data.message)
      setGetItems(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
  getMerchItems();
  }, []);

  const totalRevenue = merchData.reduce(
    (productAcc, product) =>
      productAcc +
      product.OrderItems.reduce(
        (orderAcc, item) => orderAcc + Number(item.totalPrice),
        0
      ),
    0
  );

  const totalProfit = merchData.reduce(
    (productAcc, product) =>
      productAcc +
      Math.round(
        product.OrderItems.reduce(
          (orderAcc, item) => orderAcc + Number(item.totalPrice),
          0
        ) * 0.20
      ),
    0
  );

  const totalOrders = merchData.reduce(
    (productAcc, product) =>
      productAcc +
      Math.round(
        product.OrderItems.reduce(
          (orderAcc, item) => orderAcc + Number(item.quantity),
          0
        )
      ),
    0
  );

  const topMerch = [...merchData]
    .sort(
      (a, b) =>
        b.OrderItems.reduce(
          (acc, item) => acc + Number(item.totalPrice),
          0
        ) -
        a.OrderItems.reduce(
          (acc, item) => acc + Number(item.totalPrice),
          0
        )
    )
    .slice(0, 3);

  return (
    
    <div className="ml-[22%] px-6 md:px-10 py-8 min-h-screen bg-[#F3F6F8]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <p className="text-[0.72rem] font-semibold tracking-[0.16em] uppercase text-[#3593A6]/80 mb-2">
            Merch performance
          </p>
          <h1 className="text-[2rem] md:text-[2.1rem] font-semibold tracking-tight text-gray-900 leading-tight">
            Merchandise sales overview
          </h1>
          <p className="text-sm text-gray-500 mt-2 max-w-xl">
            See how every piece of merch is performing, from revenue and profit to order-level detail.
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-3">
          <div className="inline-flex items-center gap-2 bg-white/90 border border-gray-200 rounded-full px-3 py-1 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-[0.7rem] text-gray-600">
              {merchData.length} active products tracked
            </span>
          </div>
          <div className="flex flex-wrap gap-2 text-[0.7rem] text-gray-500">
            <span className="px-2 py-1 rounded-full bg-[#EFF7FA] text-[#1F6D7E] border border-[#D6E7EE]">
              Revenue · <span className="font-semibold">Rs {totalRevenue}</span>
            </span>
            <span className="px-2 py-1 rounded-full bg-[#F8FFF7] text-[#24663A] border border-[#a2de79]/70">
              Profit · <span className="font-semibold">Rs {totalProfit}</span>
            </span>
            <span className="px-2 py-1 rounded-full bg-[#FDF3F4] text-[#B43B40] border border-[#F4C2C5]">
              Orders · <span className="font-semibold">{totalOrders}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Stat title="Merch items" value={merchData.length} icon={<Shirt className="w-5 h-5" />} />
        <Stat
          title="Total revenue"
          value={`Rs ${totalRevenue}`}
          icon={<Users className="w-5 h-5" />}
        />
        <Stat
          title="Estimated profit"
          value={`Rs ${totalProfit}`}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <Stat
          title="Total units ordered"
          value={totalOrders}
          icon={<ShoppingCart className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2.4fr)_minmax(0,1.2fr)] gap-6 items-start">
        {/* Table + main overview */}
        <div className="bg-white/95 rounded-2xl shadow-sm border border-gray-200/80 p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#EFF7FA] text-[#1F6D7E] border border-[#D6E7EE]">
                <ShoppingBag className="w-4 h-4" />
              </span>
              All products overview
            </h2>
            <p className="text-xs text-gray-500">
              Click a row to see order-level details for that product.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-gray-200/70 bg-white">
            <DataTable
              columns={merchColumns}
              data={merchData}
              expandableRows
              expandableRowsComponent={MerchExpanded}
              pagination
              highlightOnHover
              customStyles={customStyles}
            />
          </div>
        </div>

        {/* Side insights / top merch */}
        <div className="space-y-4">
          <div className="bg-white/95 rounded-2xl shadow-sm border border-gray-200/80 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Top performing merch
              </h3>
              <span className="text-[0.65rem] uppercase tracking-[0.18em] text-[#3593A6] bg-[#EFF7FA] px-2 py-1 rounded-full">
                Ranked by revenue
              </span>
            </div>
            <div className="space-y-3">
              {topMerch.map((item, index) => {
                const itemRevenue = item.OrderItems.reduce(
                  (acc, order) => acc + Number(order.totalPrice),
                  0
                );
                const itemUnits = item.OrderItems.reduce(
                  (acc, order) => acc + Number(order.quantity),
                  0
                );
                return (
                  <div
                    key={item.productId || index}
                    className="flex items-center justify-between rounded-xl border border-gray-200/70 bg-white px-3 py-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-7 w-7 rounded-full bg-[#EFF7FA] text-[#1F6D7E] flex items-center justify-center text-xs font-semibold">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.productName}
                        </p>
                        <p className="text-[0.7rem] text-gray-500">
                          {itemUnits} units · in stock {item.productQuantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      <p className="text-sm font-semibold text-[#1F6D7E]">
                        Rs {itemRevenue}
                      </p>
                      <p className="text-[0.7rem] text-gray-500">
                        Est. profit Rs {Math.round(itemRevenue * 0.2)}
                      </p>
                    </div>
                  </div>
                );
              })}
              {topMerch.length === 0 && (
                <p className="text-xs text-gray-500">
                  Once orders start coming in, your top merch will appear here.
                </p>
              )}
            </div>
          </div>

          <div className="bg-white/95 rounded-2xl shadow-sm border border-gray-200/80 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Quick breakdown
            </h3>
            <div className="space-y-2 text-[0.76rem]">
              <p className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#EFF7FA] text-[#1F6D7E] border border-[#D6E7EE]">
                <span>Total products with stock</span>
                <span className="font-semibold">{merchData.filter(m => m.productQuantity > 0).length}</span>
              </p>
              <p className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#FFF7EB] text-[#B35A11] border border-[#F5D9A7]">
                <span>Products low on stock ( &lt; 10 )</span>
                <span className="font-semibold">
                  {merchData.filter(m => m.productQuantity < 10).length}
                </span>
              </p>
              <p className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#F3EEFF] text-[#5B36C8] border border-[#D4C6FF]">
                <span>Average revenue per product</span>
                <span className="font-semibold">
                  Rs {merchData.length ? Math.round(totalRevenue / merchData.length) : 0}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const customStyles = {
  table: {
    style: {
      borderRadius: "16px",
      overflow: "hidden",
    },
  },

  headRow: {
    style: {
      backgroundColor: "#e6f4f7",
      minHeight: "56px",
      borderBottom: "1px solid #d0e7ec",
    },
  },

  headCells: {
    style: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#1f3f46",
      paddingLeft: "20px",
      paddingRight: "20px",
      textTransform: "uppercase",
      letterSpacing: "0.04em",
    },
  },

  rows: {
    style: {
      minHeight: "64px",
      fontSize: "14.5px",
      paddingTop: "6px",
      paddingBottom: "6px",
      borderBottom: "1px solid #f0f0f0",
    },
    highlightOnHoverStyle: {
      backgroundColor: "#f4fbfd",
      boxShadow: "inset 4px 0 0 #3593A6",
      cursor: "pointer",
    },
  },

  cells: {
    style: {
      paddingLeft: "20px",
      paddingRight: "20px",
    },
  },

  pagination: {
    style: {
      borderTop: "1px solid #e5e7eb",
      paddingTop: "12px",
    },
  },
};

