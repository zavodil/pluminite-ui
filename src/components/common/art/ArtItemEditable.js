import React from 'react';

import ArtItem from './ArtItem';

const ArtItemEditable = ({ ...props }) => <ArtItem buttonText="Edit" {...props} />;

export default ArtItemEditable;
