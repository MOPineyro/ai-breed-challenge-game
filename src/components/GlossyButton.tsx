import React from 'react';
import './glossyButton.css'; // Import the custom CSS

const GlossyButton: React.FC = () => {
  return (
    <button className="btn btn-primary glossy-btn">
      Click Me
    </button>
  );
};

export default GlossyButton;