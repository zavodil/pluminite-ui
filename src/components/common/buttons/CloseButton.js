import React from 'react';
import PropTypes from 'prop-types';

import { CloseIcon } from '~/components/common/icons';

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
