import React from 'react';

import ArtItem from './ArtItem';

// todo: art items are not editable
const ArtItemEditable = ({ ...props }) => <ArtItem buttonText="Edit" {...props} />;

export default ArtItemEditable;
