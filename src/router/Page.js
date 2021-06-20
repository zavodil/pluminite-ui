import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Route, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useDocumentTitle, useNativeSearchParams } from '~/hooks';

import { ERROR_REDIRECTS, PAYABLE_METHODS_DESCRIPTIONS, PAYABLE_METHODS_SUCCESS_MESSAGES, STORAGE } from '~/constants';

const Page = ({ component: Component, title, ...rest }) => {
  const query = useNativeSearchParams();
  const history = useHistory();

  useDocumentTitle(title);

  const payableMethod = localStorage.getItem(STORAGE.PAYABLE_METHOD_ITEM_NAME);

  useEffect(() => {
    if (payableMethod) {
      const errorCode = query.get('errorCode') && decodeURIComponent(query.get('errorCode'));
      const transactionHashes = query.get('transactionHashes') && decodeURIComponent(query.get('transactionHashes'));

      let newUrl = window.location.origin + window.location.hash;

      if (errorCode) {
        const errorMessage = query.get('errorMessage') && decodeURIComponent(query.get('errorMessage'));

        toast.error(
          `Sorry 😢 There was an error during ${PAYABLE_METHODS_DESCRIPTIONS[payableMethod]}. Message: '${errorMessage}'.`
        );

        if (errorCode in ERROR_REDIRECTS) {
          localStorage.removeItem(STORAGE.PAYABLE_METHOD_ITEM_NAME);
          newUrl = `${window.location.origin}/#${ERROR_REDIRECTS[errorCode]}`;

          history.push(ERROR_REDIRECTS[errorCode], { reason: ERROR_REDIRECTS[errorCode] });
        }
      }

      if (transactionHashes) {
        toast.success(PAYABLE_METHODS_SUCCESS_MESSAGES[payableMethod]);
      }

      localStorage.removeItem(STORAGE.PAYABLE_METHOD_ITEM_NAME);
      window.history.pushState(null, null, newUrl);
    }
  }, []);

  return <Route {...rest} render={(props) => <Component {...rest} {...props} />} />;
};

Page.propTypes = {
  component: PropTypes.func,
  title: PropTypes.string,
};

export default Page;
