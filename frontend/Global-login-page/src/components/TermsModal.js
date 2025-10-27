import React from 'react';
import TermsAndConditions from './TermsAndConditions';

const TermsModal = ({ isOpen, onClose, onAgree }) => {
  if (!isOpen) return null;

  return (
    <div className="terms-modal-overlay">
      <div className="terms-modal">
        <TermsAndConditions />
        <div className="terms-modal-buttons">
          <button className="terms-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="terms-agree-btn" onClick={onAgree}>
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;