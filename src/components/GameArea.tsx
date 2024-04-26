/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react'
import GuessCard from './GuessCard'
import ScoreDisplay from './ScoreDisplay'
import { API } from '../core/coreApi'

const api = API.getInstance()

const GameInterface: React.FC = () => {
    const [playerScore] = useState(0)
    const [aiScore, _setAiScore] = useState(0)
    const [_countdown, setCountdown] = useState(10)
    const [selectedButton, setSelectedButton] = useState<number | null>(null)
    const [question, setQuestion] = useState<Question | null>(null);
    const [aiResponse, setAiResponse] = useState<string | null>(null);
    const [gotCorrect, setGotCorrect] = useState<boolean | null>(null);
    const [gotCorrectAi, setGotCorrectAi] = useState<boolean | null>(null);


  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prevCountdown => prevCountdown - 1)
    }, 1000)
  
    const cleanup = () => clearInterval(interval);
  
    const fetchQuestion = async () => {
      const question = await api.getQuestion();
      setTimeout(() => setQuestion(question), 1000);
    };
  
    fetchQuestion();
  
    return cleanup;
  }, []);

  const handleSelection = async (index: number) => {
    setSelectedButton(index);

    if (question && question.selections) {
        return;
    }
  
    // Check if question and selections exist
    const selection = question!.selections[index];
    // Submit the selection to the API
    const response = await api.submitAnswer(selection, question!.breed);
    const responseAi = await api.submitReplicate(question!.breed, question!.imageUrl);

    if (!responseAi && !response) {
        return;
    }

    setAiResponse(responseAi.answer);
    setGotCorrectAi(responseAi.isMatch as boolean)
    setGotCorrect(response.isMatch as boolean);
  };

  return (
    <>
    {!question? ( 
        <div className='flex justify-center items-center min-h-screen'>
            <span className="loading loading-ring loading-lg text-primary"></span>
        </div>
        ) : (
        <div className="container mx-auto px-4">
            <div>
            <ul className="steps pb-10">
                <li className="step step-warning"></li>
                <li className="step"></li>
                <li className="step"></li>
                <li className="step"></li>
                <li className="step"></li>
            </ul>
            <GuessCard imageUrl={question!.imageUrl} selections={question!.selections} selectedButton={selectedButton} setSelected={handleSelection} isLocked={false} resetSelection={false} />
            </div>
            <div className="flex justify-around relative">
            <ScoreDisplay 
                playerScore={playerScore} 
                playerName="YOU" 
                isAi={false}
                color="green"
                gotCorrect={gotCorrect}
            />
            <div className="divider divider-horizontal">VS</div>
            <ScoreDisplay 
                playerScore={aiScore} 
                playerName="RESNET" 
                isAi={true}
                color="blue"
                gotCorrect={gotCorrectAi}
            />

            {aiResponse && (
                <div className="chat chat-start absolute top-0 right-0">
                <div className="chat-bubble chat-bubble-primary">{aiResponse} <br></br> {gotCorrect === true && '✔️'}</div>
                </div>
            )}
            </div>
        </div>
        )
    }
    </>
  )
}

export default GameInterface
