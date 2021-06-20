import { useEffect } from 'react';

import { APP } from '~/constants';

const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${APP.NAME} | ${title}` : APP.NAME;
  }, [title]);
};

export default useDocumentTitle;
