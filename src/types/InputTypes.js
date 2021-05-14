import PropTypes from 'prop-types';

export const TextInputType = PropTypes.oneOf(['email', 'number', 'password', 'search', 'tel', 'text', 'url']);
export const TextInputTypeRequired = TextInputType.isRequired;
