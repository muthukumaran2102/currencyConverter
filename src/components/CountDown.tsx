import { useState, useEffect } from 'react';

interface CountdownProps {
  initialMinutes?: number;
  reset: (flag: boolean) => void;
}

const CountdownTimer:React.FC<CountdownProps> = ({initialMinutes = 10, reset}) => {
  const initialTimeInSeconds = initialMinutes * 60;
  const [timeRemaining, setTimeRemaining] = useState(initialTimeInSeconds);

  useEffect(() => {
    if (timeRemaining <= 0) {
      reset(true);
      return;
    }

    const timerId = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeRemaining]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return <div className='bg-blue-500 p-2 flex items-center justify-center gap-2 text-white w-40 rounded-lg'>
        <div>Expires in:</div>
        <div>{`${minutes.toString().padStart(2, '0')}’`}</div>
        <div>{`${seconds.toString().padStart(2, '0')}’’`}</div>
    </div>
  };

  return (
    <div>
      <h1>{formatTime(timeRemaining)}</h1>
    </div>
  );
};

export default CountdownTimer;