
// components/Popup.js
import React from 'react';
import './Styles/pop-up.css'

const Popup = ({ isVisible, onClose, onSubmit }) => {
  if (!isVisible) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const inputValue = event.target.elements.input.value;
    onSubmit(inputValue);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <form onSubmit={handleSubmit}>
        <h2>Welcome!</h2>
          <input type="text" name="input" placeholder="Enter something" required />
          <button type="submit">Submit</button>
        <button onClick={onClose}>Close</button>
        </form>
      </div>
    </div>
  );
};

export default Popup;
