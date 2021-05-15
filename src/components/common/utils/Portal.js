import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children, mountClassName }) => {
  const mount = document.getElementsByClassName(mountClassName)[0];
  const el = document.createElement('div');

  useEffect(() => {
    mount.appendChild(el);

    return () => {
      mount.removeChild(el);
    };
  }, [el, mount]);

  return createPortal(children, el);
};

export default Portal;
