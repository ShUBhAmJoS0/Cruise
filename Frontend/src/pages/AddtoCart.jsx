import React, { useState, useEffect } from "react";
import api from "../api/axios";

function AddToCart() {
  const [cart, setCart] = useState([]);

  // Fetch cart items
  useEffect(() => {
    api.get("/api/cart")
      .then(res => {
        setCart(res.data?.OrderItems || []);
      })
      .catch(err => console.log(err));
  }, []);

  // Increase quantity
  const increase = (item) => {
    api.patch(`/api/cart/${item.id}`, { quantity: item.quantity + 1 })
      .then(() => {
        item.quantity += 1;
        setCart([...cart]);
      });
  };

  // Decrease quantity
  const decrease = (item) => {
    if (item.quantity <= 1) return;
    api.patch(`/api/cart/${item.id}`, { quantity: item.quantity - 1 })
      .then(() => {
        item.quantity -= 1;
        setCart([...cart]);
      });
  };

  // Remove item
  const remove = (item) => {
    api.delete(`/api/cart/${item.id}`)
      .then(() => {
        setCart(cart.filter(i => i.id !== item.id));
      });
  };

  // Checkout
  const checkout = () => {
    api.post("/api/orders/checkout")
      .then(() => {
        alert("Order placed!");
        setCart([]);
      });
  };

  return (
    <div style={{ backgroundColor: "#C8C8C8", minHeight: "100vh", padding: "20px" }}>
      <h1>Your Cart</h1>

      {cart.length === 0 && <p>Cart is empty</p>}

      {cart.map(item => (
        <div key={item.id} style={{ background: "white", padding: "10px", margin: "10px 0" }}>
          <p>{item.Product.name}</p>
          <p>Price: {item.Product.price}</p>
          <p>Quantity: {item.quantity}</p>
          <button onClick={() => decrease(item)}>-</button>
          <button onClick={() => increase(item)}>+</button>
          <button onClick={() => remove(item)}>Remove</button>
        </div>
      ))}

      {cart.length > 0 && <button onClick={checkout}>Checkout</button>}
    </div>
  );
}

export default AddToCart;
