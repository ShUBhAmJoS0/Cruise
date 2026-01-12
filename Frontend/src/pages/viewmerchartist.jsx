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

  <div className="bg-[#f4fbfd] p-6 rounded-xl mx-6 mb-6 shadow-inner">
    <h4 className="font-semibold text-lg mb-4 text-[#3593A6]">
   Purchase Details
    </h4>

    {data.OrderItems.map((b, i) => (
      <div
        key={i}
        className="flex justify-between items-center bg-white p-4 rounded-lg mb-3 shadow-sm"
      >
        <div>
          <p className="font-medium">{b.Order?.User?.name}</p>
          <p className="text-sm text-gray-500">
            Qty: {b.quantity}
          </p>
        </div>

        <div className="text-right">
          <p className="font-semibold text-[#3593A6]">
            Rs. {b.totalPrice}
          </p>
          <span
            className={`text-xs px-3 py-1 rounded-full ${
              b.Order.status === "Shipped"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {b.Order?.status}
          </span>
        </div>
      </div>
    ))}
  </div>
);
const Stat = ({ title, value, icon }) => (
  <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
    <div className="p-3 bg-[#3593A6]/10 text-[#3593A6] rounded-lg">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-xl font-bold">{value}</h3>
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

  return (
    
    <div className="ml-80 p-8">
          <div className="grid grid-cols-4 gap-6 mb-8 ">
        <Stat title="Merch items" value={merchData.length} icon={<Shirt />} />
        <Stat
          title="Revenue"
          value={"Rs "+`${merchData.reduce(
  (productAcc, product) =>
    productAcc +
    product.OrderItems.reduce(
      (orderAcc, item) => orderAcc + Number(item.totalPrice),
      0
    ),
  0
)}`}
          icon={<Users />}
        />
        <Stat
          title="profit"
 value={"Rs "+`${merchData.reduce(
  (productAcc, product) =>
    productAcc +
    Math.round((product.OrderItems.reduce(
      (orderAcc, item) => orderAcc + Number(item.totalPrice),
      0
    ))*0.20),
  0
)}`}
          icon={<DollarSign />}
        />
        <Stat title="Total Orders" value={"Rs "+`${merchData.reduce(
  (productAcc, product) =>
    productAcc +
    Math.round((product.OrderItems.reduce(
      (orderAcc, item) => orderAcc + Number(item.quantity),
      0
    ))),
  0
)}`} icon={<ShoppingCart />} />
      </div>

      <h2 className="text-2xl font-bold mb-6 text-[#3593A6]">
        Merchandise Sales Overview
      </h2>
<div className="bg-[#3593A6]/40 rounded-2xl shadow-lg p-6">


   <div className="bg-white rounded-2xl shadow-xl p-6 mt-4">
  <h2 className="text-2xl font-semibold text-[#3593A6] mb-4 flex  items-center gap-3">
 <ShoppingBag></ShoppingBag>All products overview
  </h2>

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

