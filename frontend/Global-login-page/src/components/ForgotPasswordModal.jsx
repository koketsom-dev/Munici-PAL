import React from 'react';
export default function ForgotPasswordModal({ onClose }) {
    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1200
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
                style={{
                    maxWidth: 560,
                    width: '92%',
                    background: '#0b1220',
                    color: '#e6f7f7',
                    borderRadius: 10,
                    padding: '1.6rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                    textAlign: 'center'
                }}
            >
                <h2 style={{ margin: '0 0 0.4rem' }}>Password reset</h2>
                <p style={{ margin: '0 0 1rem' }}>
                    To reset your password, please contact the support team:
                </p>
 
                <div style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
                    <div style={{ fontWeight: 700 }}>Email:</div>
                    <div>support@munici-pal.gov</div>
 
                    <div style={{ height: 8 }} />
 
                    <div style={{ fontWeight: 700 }}>Phone:</div>
                    <div>011 587 7980</div>
 
                    <div style={{ height: 8 }} />
 
                    <div style={{ fontWeight: 700 }}>Operating hours:</div>
                    <div>Monday - Friday, 8:00 AM - 6:00 PM</div>
                </div>
 
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={onClose} className="primary">
                        Back to login
                    </button>
                </div>
            </div>
        </div>
    );
}