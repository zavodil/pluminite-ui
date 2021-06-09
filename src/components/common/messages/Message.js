import React from 'react';

import { ReactChildrenTypeRequired } from '~/types/ReactChildrenTypes';

const Message = ({ children }) => <div>{children}</div>;

Message.propTypes = {
  children: ReactChildrenTypeRequired,
};

export default Message;
