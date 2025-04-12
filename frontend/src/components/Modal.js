import React from 'react';
import './Modal.css';

const Modal = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Close modal">×</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
