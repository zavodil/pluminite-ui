import React from 'react';
import PropTypes from 'prop-types';

import CloseIcon from '~/assets/CloseIcon';

const CloseButton = ({ closeToast, processCLick = () => {}, ...props }) => (
  <div onClick={closeToast || processCLick} {...props}>
    <CloseIcon />
  </div>
);

CloseButton.propTypes = {
  closeToast: PropTypes.func,
  processCLick: PropTypes.func,
};

export default CloseButton;
