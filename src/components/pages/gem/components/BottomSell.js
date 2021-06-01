import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../../../common/Button';
import { InputNear } from '../../../common/forms';
import { StickedToBottom } from '../../../common/layout';

const Container = styled('div')`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 767px;

  .input-sign-aside {
    width: 100%;
    max-width: 350px;
    margin-bottom: 30px;

    input.input {
      width: 200px;
    }
  }

  .sell-button {
    width: 100%;
  }
`;

const BottomSell = () => {
  const [sellPrice, setSellPrice] = useState('');

  return (
    <StickedToBottom isSecondary>
      <Container>
        <InputNear
          name="price"
          labelText="Price"
          isRequired
          // isDisabled={isDisabled}
          nearsInitial={sellPrice}
          onNearsChange={setSellPrice}
          autoFocus
        />
        <Button className="sell-button" isPrimary>
          List Gem for {sellPrice || '0'}Ⓝ
        </Button>
      </Container>
    </StickedToBottom>
  );
};

export default BottomSell;
