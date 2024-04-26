import React, { useState, useEffect } from 'react';

interface ScoreDisplayProps {
  playerName: string;
  isAi: boolean;
  playerScore: number;
  color: string;
  gotCorrect?: boolean | null;
}

const colorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-orange-500',
};

const bgClass = (isAi: boolean) => isAi ? 'bg-yellow-500' : 'bg-blue-500';

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  playerName,
  playerScore,
  color,
  isAi,
  gotCorrect
}) => {
  const [animation, setAnimation] = useState<string | null>(null);

  const handleAnimationEnd = () => {
    setAnimation(null);
  };

  useEffect(() => {
    if (gotCorrect === true) {
      setAnimation('animate-bounce transition-colors duration-2000 bg-green-500');
    } else if (gotCorrect === false) {
      setAnimation('animate-shake transition-colors duration-2000 bg-red-500');
    }
  }, [gotCorrect]);

  return (
    <div className={`card lg:card-side ${colorClasses[color as keyof typeof colorClasses]} shadow-xl ${animation}`} onAnimationEnd={handleAnimationEnd}>
      <figure className="lg:w-2/5 flex justify-center items-center">
        <div className={`rounded-full w-16 h-16 overflow-hidden ${bgClass(isAi)} flex items-center justify-center text-3xl`}>
          {isAi ? '🤖' : '🐱'}
        </div>
      </figure>
      <div className="card-body">
        <h2 className="card-title">{playerName}</h2>
        <div className="flex items-center">
          <div className="ml-4">
            <p className="text-3xl font-bold">{playerScore}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;