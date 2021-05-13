import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import Page from './Page';

const UserPage = ({ isAuthenticated, ...rest }) => {
  if (isAuthenticated) {
    return <Page {...rest} />;
  }

  return <Redirect to="/" />;
};

UserPage.propTypes = {
  isAuthenticated: PropTypes.oneOfType([PropTypes.bool.isRequired, PropTypes.instanceOf(null)]),
};

export default UserPage;
