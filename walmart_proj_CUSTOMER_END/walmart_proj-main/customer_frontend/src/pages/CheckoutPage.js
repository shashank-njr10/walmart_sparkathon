import React, { useState, useEffect } from "react";
import axios from "axios";
import SustainablePopup from "../components/SustainablePopup";

// Geocode using Nominatim (OpenStreetMap)
async function geocode(city, postalCode) {
  const query = encodeURIComponent(`${city} ${postalCode}`);
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.length === 0) {
    alert("Could not find location. Please check your city and postal code.");
    return { lat: null, lng: null };
  }
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

function CheckoutPage({ cart, customer, onBack, setPage }) {
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [closestWarehouses, setClosestWarehouses] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [workingCart, setWorkingCart] = useState(cart);
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  useEffect(() => {
    axios
      .get(
        `http://localhost:4000/cart/${customer.id}/sustainable-recommendations`
      )
      .then((res) => setRecommendations(res.data));
  }, [customer.id]);

  const handleChoose = async (accept, recommendation) => {
    if (accept && recommendation.recommended) {
      // Remove old item from backend cart
      await axios.delete(
        `http://localhost:4000/cart/${customer.id}/${recommendation.cart_product_id}`
      );
      // Add recommended item to backend cart with same quantity
      await axios.post(`http://localhost:4000/cart/${customer.id}`, {
        product_id: recommendation.recommended.product_id,
        quantity: 1, // or use recommendation.quantity if you want to keep the same quantity
      });
      // Update frontend cart state
      setWorkingCart((prev) =>
        prev.map((item) =>
          item.product_id === recommendation.cart_product_id
            ? { ...item, ...recommendation.recommended }
            : item
        )
      );
    }
    // Remove the handled recommendation from the list
    setRecommendations((prev) =>
      prev.filter(
        (rec) => rec.cart_product_id !== recommendation.cart_product_id
      )
    );
  };

  const handleFindWarehouses = async () => {
    const { lat, lng } = await geocode(city, postalCode);
    if (lat == null || lng == null) return;
    const res = await axios.post(
      `http://localhost:4000/cart/${customer.id}/closest-warehouses`,
      { customer_lat: lat, customer_lng: lng }
    );
    setClosestWarehouses(res.data);
    // Fetch delivery estimate as well
    const deliveryRes = await axios.post(
      `http://localhost:4000/cart/${customer.id}/delivery-estimate`,
      { customer_lat: lat, customer_lng: lng }
    );
    setDeliveryInfo(deliveryRes.data);
  };

  const handlePlaceOrder = async () => {
    const { lat, lng } = await geocode(city, postalCode);
    if (lat == null || lng == null) return;
    axios
      .post(`http://localhost:4000/cart/${customer.id}/checkout`, {
        customer_lat: lat,
        customer_lng: lng,
      })
      .then((res) => {
        setDeliveryInfo(res.data);
        setPage("orders");
      });
  };

  const subtotal = workingCart.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  if (workingCart.length === 0) {
    return (
      <div style={{ padding: 32, background: "#e8f5e9", minHeight: "100vh" }}>
        <h2 style={{ color: "#388e3c" }}>Checkout</h2>
        <div>Your cart is empty after applying sustainable choices.</div>
        <button
          onClick={onBack}
          style={{
            marginTop: 16,
            background: "#388e3c",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: 4,
          }}
        >
          Back to Cart
        </button>
      </div>
    );
  }

  if (recommendations.length > 0) {
    return (
      <SustainablePopup
        recommendations={recommendations}
        onChoose={handleChoose}
      />
    );
  }

  return (
    <div style={{ background: "#f5f7fa", minHeight: "100vh", padding: 32 }}>
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          background: "white",
          borderRadius: 16,
          boxShadow: "0 4px 24px #e0f2f1",
          padding: 32,
        }}
      >
        <h2
          style={{
            color: "#2e7d32",
            fontWeight: 700,
            fontSize: 28,
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          Checkout
        </h2>
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 24,
            justifyContent: "center",
          }}
        >
          <input
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{
              margin: 8,
              padding: 12,
              borderRadius: 8,
              border: "1px solid #bdbdbd",
              fontSize: 16,
              minWidth: 180,
            }}
          />
          <input
            placeholder="Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            style={{
              margin: 8,
              padding: 12,
              borderRadius: 8,
              border: "1px solid #bdbdbd",
              fontSize: 16,
              minWidth: 140,
            }}
          />
          <button
            onClick={handleFindWarehouses}
            style={{
              background: "linear-gradient(90deg, #43a047 60%, #66bb6a 100%)",
              color: "white",
              padding: "12px 24px",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              boxShadow: "0 2px 8px #c8e6c9",
              cursor: "pointer",
              transition: "background 0.2s",
              margin: 8,
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#2e7d32")}
            onMouseOut={(e) =>
              (e.currentTarget.style.background =
                "linear-gradient(90deg, #43a047 60%, #66bb6a 100%)")
            }
          >
            Show Closest Warehouses
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            border="0"
            cellPadding="10"
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
              background: "#fafafa",
              borderRadius: 12,
              boxShadow: "0 2px 8px #e0f2f1",
            }}
          >
            <thead>
              <tr style={{ background: "#e8f5e9" }}>
                <th
                  style={{
                    fontWeight: 700,
                    color: "#2e7d32",
                    fontSize: 16,
                    padding: 12,
                  }}
                >
                  Product
                </th>
                <th
                  style={{
                    fontWeight: 700,
                    color: "#2e7d32",
                    fontSize: 16,
                    padding: 12,
                  }}
                >
                  Qty
                </th>
                <th
                  style={{
                    fontWeight: 700,
                    color: "#2e7d32",
                    fontSize: 16,
                    padding: 12,
                  }}
                >
                  Price
                </th>
                <th
                  style={{
                    fontWeight: 700,
                    color: "#2e7d32",
                    fontSize: 16,
                    padding: 12,
                  }}
                >
                  Closest Warehouse
                </th>
                <th
                  style={{
                    fontWeight: 700,
                    color: "#2e7d32",
                    fontSize: 16,
                    padding: 12,
                  }}
                >
                  Distance (km)
                </th>
              </tr>
            </thead>
            <tbody>
              {workingCart.map((item) => {
                const wh = closestWarehouses.find(
                  (w) => w.product_id === item.product_id
                );
                return (
                  <tr
                    key={item.product_id}
                    style={{
                      background: "white",
                      borderBottom: "1px solid #e0e0e0",
                    }}
                  >
                    <td style={{ padding: 12, fontWeight: 500 }}>
                      {item.name}
                    </td>
                    <td style={{ padding: 12 }}>{item.quantity}</td>
                    <td style={{ padding: 12 }}>₹{item.price}</td>
                    <td style={{ padding: 12 }}>
                      {wh?.warehouse?.name || wh?.message || "-"}
                    </td>
                    <td style={{ padding: 12 }}>
                      {wh?.warehouse?.distance_km || "-"}
                    </td>
                  </tr>
                );
              })}
              {deliveryInfo && (
                <tr style={{ background: "#f1f8e9" }}>
                  <td
                    colSpan={4}
                    style={{ textAlign: "right", padding: 12, fontWeight: 600 }}
                  >
                    Delivery Cost
                  </td>
                  <td
                    style={{ padding: 12, fontWeight: 600, color: "#1565c0" }}
                  >
                    {/* Group by warehouse and sum unique delivery costs */}
                    {(() => {
                      const warehouseCostMap = {};
                      deliveryInfo.delivery.forEach((d) => {
                        if (d.warehouse && d.delivery_cost) {
                          warehouseCostMap[d.warehouse] = parseFloat(
                            d.delivery_cost
                          );
                        }
                      });
                      const totalUniqueDeliveryCost = Object.values(
                        warehouseCostMap
                      ).reduce((a, b) => a + b, 0);
                      return (
                        <>
                          ₹{totalUniqueDeliveryCost.toFixed(2)}
                          <br />
                          <span style={{ fontSize: 12, color: "#757575" }}>
                            {Object.entries(warehouseCostMap)
                              .map(
                                ([warehouse, cost], i) =>
                                  `Warehouse: ${warehouse} (Delivery: ₹${cost})`
                              )
                              .join(", ")}
                          </span>
                        </>
                      );
                    })()}
                  </td>
                </tr>
              )}
              <tr style={{ background: "#e3f2fd" }}>
                <td
                  colSpan={4}
                  style={{
                    textAlign: "right",
                    padding: 12,
                    fontWeight: 700,
                    fontSize: 17,
                  }}
                >
                  Total
                </td>
                <td
                  style={{
                    padding: 12,
                    fontWeight: 700,
                    fontSize: 17,
                    color: "#2e7d32",
                  }}
                >
                  ₹
                  {(() => {
                    let deliveryCost = 0;
                    if (deliveryInfo) {
                      const warehouseCostMap = {};
                      deliveryInfo.delivery.forEach((d) => {
                        if (d.warehouse && d.delivery_cost) {
                          warehouseCostMap[d.warehouse] = parseFloat(
                            d.delivery_cost
                          );
                        }
                      });
                      deliveryCost = Object.values(warehouseCostMap).reduce(
                        (a, b) => a + b,
                        0
                      );
                    }
                    return (subtotal + deliveryCost).toFixed(2);
                  })()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          style={{
            marginTop: 32,
            display: "flex",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <button
            onClick={onBack}
            style={{
              background: "#388e3c",
              color: "white",
              padding: "12px 28px",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              boxShadow: "0 2px 8px #c8e6c9",
              cursor: "pointer",
              marginRight: 8,
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#2e7d32")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#388e3c")}
          >
            Back to Cart
          </button>
          <button
            onClick={handlePlaceOrder}
            style={{
              background: "linear-gradient(90deg, #43a047 60%, #66bb6a 100%)",
              color: "white",
              padding: "12px 28px",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              boxShadow: "0 2px 8px #c8e6c9",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#2e7d32")}
            onMouseOut={(e) =>
              (e.currentTarget.style.background =
                "linear-gradient(90deg, #43a047 60%, #66bb6a 100%)")
            }
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
