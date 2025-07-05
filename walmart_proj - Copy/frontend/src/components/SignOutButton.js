import React, { useState } from "react";
import "../styles/SignOutButton.css";

function SignOutButton({ onSignOut, className = "" }) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    onSignOut();
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <button
        className={`signout-button ${className}`}
        onClick={handleClick}
        title="Sign Out"
      >
        <span className="icon">🚪</span>
        <span className="text">Sign Out</span>
      </button>

      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <div className="confirmation-header">
              <span className="confirmation-icon">⚠️</span>
              <h3>Confirm Sign Out</h3>
            </div>
            <p>Are you sure you want to sign out?</p>
            <div className="confirmation-buttons">
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
              <button className="confirm-button" onClick={handleConfirm}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .confirmation-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          animation: fadeIn 0.2s ease-out;
        }

        .confirmation-modal {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          max-width: 400px;
          width: 90%;
          text-align: center;
          animation: slideUp 0.3s ease-out;
        }

        .confirmation-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .confirmation-icon {
          font-size: 24px;
        }

        .confirmation-header h3 {
          margin: 0;
          color: #333;
          font-size: 18px;
          font-weight: 600;
        }

        .confirmation-modal p {
          margin: 0 0 24px 0;
          color: #666;
          font-size: 14px;
        }

        .confirmation-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .cancel-button {
          padding: 10px 20px;
          border: 1px solid #ddd;
          background: white;
          color: #666;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .cancel-button:hover {
          background: #f5f5f5;
          border-color: #ccc;
        }

        .confirm-button {
          padding: 10px 20px;
          border: none;
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
          color: white;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .confirm-button:hover {
          background: linear-gradient(135deg, #ff5252 0%, #d32f2f 100%);
          transform: translateY(-1px);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}

export default SignOutButton;
