import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { parseNearAmount } from 'near-api-js/lib/utils/format';
import { QUERY_KEYS } from '../../../../constants';

import { NftContractContext } from '../../../../contexts';

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

const BottomSell = ({ gem }) => {
  const [sellPrice, setSellPrice] = useState('');
  const { listForSale } = useContext(NftContractContext);
  const queryClient = useQueryClient();

  const processList = async () => {
    await queryClient.invalidateQueries(QUERY_KEYS.SALES_POPULATED);
    await listForSale(gem.token_id, parseNearAmount(sellPrice));

    toast.success('Success! Your gem is on the marketplace.');
  };

  return (
    <StickedToBottom isSecondary>
      <Container>
        <InputNear
          name="price"
          labelText="Price"
          isRequired
          nearsInitial={sellPrice}
          onNearsChange={setSellPrice}
          autoFocus
        />
        <Button className="sell-button" isPrimary onClick={processList}>
          List Gem for {sellPrice || '0'}Ⓝ
        </Button>
      </Container>
    </StickedToBottom>
  );
};

BottomSell.propTypes = {
  gem: PropTypes.shape({
    token_id: PropTypes.string,
  }).isRequired,
};

export default BottomSell;
