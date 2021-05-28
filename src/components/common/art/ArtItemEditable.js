import React from 'react';
import PropTypes from 'prop-types';

import ArtItem from './ArtItem';

// todo: art items are not editable? is it possible to edit price?
const ArtItemEditable = ({ forwardedRef, ...props }) => <ArtItem ref={forwardedRef} buttonText="Edit" {...props} />;

ArtItemEditable.propTypes = {
  forwardedRef: PropTypes.object,
};

export default ArtItemEditable;
