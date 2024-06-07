import "../Styles/welcomepopup.css"
const Welcomepopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="w-popup-overlay">
      <div className="w-popup-content">
        <h2>Welcome!</h2>
        <button type="submit">Submit</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Welcomepopup;