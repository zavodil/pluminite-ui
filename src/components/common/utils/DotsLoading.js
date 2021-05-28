import React, { useEffect, useState } from 'react';

const DotsLoading = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDots(dots.length < 3 ? '.'.repeat(dots.length + 1) : '');
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [dots]);

  return <span>{dots}</span>;
};

export default DotsLoading;
