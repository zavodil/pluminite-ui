import { useEffect, useState } from 'react';

const useIsUnmounting = () => {
  const [isUnmounting, setIsUnmounting] = useState(false);

  useEffect(() => {
    return () => {
      setIsUnmounting(true);
    };
  }, []);

  return isUnmounting;
};

export default useIsUnmounting;
