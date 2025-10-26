import React from "react";

export default function NotificationModal({ modal, closeModal }) {
    return (
        modal.isOpen && (
            <div className="modal-overlay" onClick={closeModal}>
                <div className={`modal-content modal-${modal.type}`} onClick={(e) => e.stopPropagation()}>
                    <div className="modal-icon">
                        {modal.type === "success" && "✅"}
                        {modal.type === "error" && "❌"}
                        {modal.type === "info" && "ℹ️"}
                    </div>
                    <h3 className="modal-title">{modal.title}</h3>
                    <p className="modal-message">{modal.message}</p>
                </div>
            </div>
        )
    );
}