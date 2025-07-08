import React, { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import ReorderPage from "./components/ReorderPage";
import MapPage from "./components/MapPage";
import SignOutButton from "./components/SignOutButton";

function App() {
  const [manager, setManager] = useState(() => {
    const stored = sessionStorage.getItem("manager");
    return stored ? JSON.parse(stored) : null;
  });
  const [page, setPage] = useState(
    () => sessionStorage.getItem("page") || "login"
  );
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [routeData, setRouteData] = useState(null); // Includes supplier, warehouse, mode

  const handleLogin = (mgr) => {
    setManager(mgr);
    setPage("dashboard");
  };

  const handleReorder = (product) => {
    setSelectedProduct(product);
    setPage("reorder");
  };

  const handleOrderPlaced = ({
    supplierCoords,
    warehouseCoords,
    transportMode,
  }) => {
    setRouteData({ supplierCoords, warehouseCoords, transportMode });
    setPage("map");
  };

  const handleBackToDashboard = () => {
    setSelectedProduct(null);
    setRouteData(null);
    setPage("dashboard");
  };

  const handleSignOut = () => {
    sessionStorage.clear();
    setManager(null);
    setPage("login");
  };

  // Persist manager and page to sessionStorage
  useEffect(() => {
    if (manager) {
      sessionStorage.setItem("manager", JSON.stringify(manager));
    }
  }, [manager]);
  useEffect(() => {
    sessionStorage.setItem("page", page);
  }, [page]);

  return (
    <div>
      {page !== "login" && <SignOutButton onSignOut={handleSignOut} />}
      {page === "login" && <LoginPage onLogin={handleLogin} />}

      {page === "dashboard" && manager && (
        <Dashboard manager={manager} onReorder={handleReorder} />
      )}

      {page === "reorder" && selectedProduct && manager && (
        <ReorderPage
          product={selectedProduct}
          manager={manager}
          onOrderPlaced={handleOrderPlaced}
          onCancel={handleBackToDashboard}
        />
      )}

      {page === "map" && routeData && (
        <MapPage
          supplierCoords={routeData.supplierCoords}
          warehouseCoords={routeData.warehouseCoords}
          transportMode={routeData.transportMode}
          onBackToDashboard={handleBackToDashboard}
        />
      )}
    </div>
  );
}

export default App;
