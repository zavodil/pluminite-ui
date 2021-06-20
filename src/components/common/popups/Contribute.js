import React from 'react';

import { Button } from '~/components/common/buttons';

import { APP } from '~/constants';

const Contribute = () => (
  <Button isSecondary>
    <a href="https://github.com/zavodil/pluminite-ui">{APP.NAME} is Open-Source. Contribute :)</a>
  </Button>
);

export default Contribute;
