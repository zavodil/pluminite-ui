import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import { useDocumentTitle } from '../hooks';

const appName = 'Pluminite';

const Page = ({ component: Component, title, ...rest }) => {
  useDocumentTitle(title ? `${appName} | ${title}` : appName);

  return <Route {...rest} render={(props) => <Component {...rest} {...props} />} />;
};

Page.propTypes = {
  component: PropTypes.func,
  title: PropTypes.string,
};

export default Page;
