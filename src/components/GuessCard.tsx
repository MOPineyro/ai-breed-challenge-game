import React from 'react';
import './glossyButton.css'; // Ensure your glossy button styles are defined here

interface GuessCardProps {
  selectedButton: number | null;
  setSelected: (index: number) => Promise<void>;
  isLocked: boolean;
  resetSelection: boolean;
  imageUrl: string
  selections: Selection[];
}

const GuessCard: React.FC<GuessCardProps> = ({
  selectedButton,
  setSelected,
  isLocked,
  resetSelection,
  imageUrl,
  selections
}) => {
  const handleButtonClick = (index: number) => {
    if (!isLocked && (selectedButton === null || resetSelection)) {
      setSelected(index);
    }
  };

  // React effect to handle resetSelection logic
  React.useEffect(() => {
    // if (resetSelection) {
    //   setSelected(null); // Resets the selection when resetSelection prop changes to true
    // }
  }, [resetSelection, setSelected]);

  return (
    <div className="card lg:card-side bg-base-200 shadow-xl mb-10">
        <figure className="lg:w-2/5">
               <img className="rounded-xl" src={imageUrl} alt="Guess this" />
        </figure>
      <div className="card-body lg:w-3/5">
        <div className="flex flex-col space-y-2">
          {selections.map((selection, index) => (
            <button
              key={index}
            //   disabled={isLocked || (selectedButton !== null && !resetSelection)} 
              className={`btn ${selectedButton === index ? 'btn-success ring-4 ring-green-500' : 'btn btn-outline btn-primary'}`}
              onClick={() => handleButtonClick(index)}
            >
              {selection.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuessCard;
