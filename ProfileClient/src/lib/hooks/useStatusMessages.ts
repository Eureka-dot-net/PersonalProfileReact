import { useEffect, useRef, useState } from 'react';

const STATUS_MESSAGES = [
  "Analyzing your CV...",
  "Comparing skills to job description...",
  "Checking experience match...",
  "Scoring compatibility...",
  "Almost done..."
];

export const useStatusMessages = (isPending: boolean) => {
  const [statusMessageIndex, setStatusMessageIndex] = useState(0);
  const statusIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPending) {
      setStatusMessageIndex(0);
      statusIntervalRef.current = setInterval(() => {
        setStatusMessageIndex(prev => (prev + 1) % STATUS_MESSAGES.length);
      }, 2000);
    } else {
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
        statusIntervalRef.current = null;
      }
      setStatusMessageIndex(0);
    }

    return () => {
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
      }
    };
  }, [isPending]);

  return STATUS_MESSAGES[statusMessageIndex];
};