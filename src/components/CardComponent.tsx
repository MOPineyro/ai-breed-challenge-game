import React from 'react';
import GlossyButton from './GlossyButton';

const CardComponent: React.FC = () => {
  return (
    <div className="p-4 max-w-sm mx-auto">
      <div className="card bg-base-100 shadow-xl image-full">
        <figure>
          <img src="https://placeimg.com/400/225/arch" alt="Architecture" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Beautiful Architecture</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div className="card-actions justify-end">
            <GlossyButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
