import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import Page from './Page';

const GuestPage = ({ isAuthenticated, ...rest }) => {
  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return <Page {...rest} />;
};

GuestPage.propTypes = {
  isAuthenticated: PropTypes.oneOfType([PropTypes.bool.isRequired, PropTypes.instanceOf(null)]),
};

export default GuestPage;
