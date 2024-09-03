import React from 'react';
import './Modal.css';

const Modal = ({ editData, setEditData, handleSaveEdit, handleClose }) => {
    const handleApproverChange = (index, field, value) => {
        const updatedApprovers = [...(editData.approvers || [])]; // Use empty array as default
        updatedApprovers[index][field] = value;
        setEditData({ ...editData, approvers: updatedApprovers });
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Edit Area</h2>
                <div className="modal-field">
                    <label htmlFor="editAreaName">Area Name:</label>
                    <input
                        id="editAreaName"
                        type="text"
                        value={editData.newName || ''} // Default to empty string
                        onChange={(e) => setEditData({ ...editData, newName: e.target.value })}
                    />
                </div>
                <div className="modal-field">
                    <h3>Approvers:</h3>
                    {(editData.approvers || []).map((approver, index) => (
                        <div key={approver.email} className="modal-approver">
                            <input
                                type="text"
                                value={approver.name || ''} // Default to empty string
                                onChange={(e) => handleApproverChange(index, 'name', e.target.value)}
                            />
                            <input
                                type="email"
                                value={approver.email || ''} // Default to empty string
                                onChange={(e) => handleApproverChange(index, 'email', e.target.value)}
                            />
                        </div>
                    ))}
                </div>
                <div className="modal-buttons">
                    <button className="modal-button" onClick={handleSaveEdit}>Save</button>
                    <button className="remove-button" onClick={handleClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};


export default Modal;