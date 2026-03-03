import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export function useOrientation() {
  const [isLandscape, setIsLandscape] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return width > height;
  });
  const [dims, setDims] = useState(() => Dimensions.get('window'));

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      setIsLandscape(window.width > window.height);
      setDims(window);
    });
    return () => sub.remove();
  }, []);

  return { isLandscape, width: dims.width, height: dims.height };
}
