import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children, mountClassName }) => {
  let mount;
  if (mountClassName) {
    [mount] = document.getElementsByClassName(mountClassName);
  } else {
    mount = document.body;
  }

  const element = document.createElement('div');
  element.classList.add('portal-container');

  useEffect(() => {
    mount.insertAdjacentElement('afterbegin', element);

    return () => {
      mount.removeChild(element);
    };
  }, [element, mount]);

  return createPortal(children, element);
};

export default Portal;
