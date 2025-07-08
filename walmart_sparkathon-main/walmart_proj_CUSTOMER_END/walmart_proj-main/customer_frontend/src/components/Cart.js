import React, { useEffect, useState } from "react";
import axios from "axios";

function Cart({ customer }) {
  const [cart, setCart] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:4000/cart/${customer.id}`)
      .then((res) => setCart(res.data));
  }, [customer.id]);
  const removeFromCart = (product_id) => {
    axios
      .delete(`http://localhost:4000/cart/${customer.id}/${product_id}`)
      .then(() =>
        setCart(cart.filter((item) => item.product_id !== product_id))
      );
  };
  return (
    <div>
      <h2>Cart</h2>
      {cart.length === 0 && <div>Cart is empty.</div>}
      {cart.map((item) => (
        <div key={item.product_id}>
          Product ID: {item.product_id} | Quantity: {item.quantity}
          <button onClick={() => removeFromCart(item.product_id)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
export default Cart;
