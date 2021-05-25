import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useQueryClient } from 'react-query';
import { Link, Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { NearContext, NftContractContext } from '../../../../contexts';

import { HeadingText } from '../../../common/typography';
import { ArtItemPriced } from '../../../common/art';
import { StickedToBottom } from '../../../common/layout';
import Button from '../../../common/Button';

import { NftTypeRequired } from '../../../../types/NftTypes';

const Container = styled('div')`
  max-width: 600px;
  margin: 0 auto;
  width: 100%;

  h2 {
    margin-bottom: 0;
  }

  .clarification {
    margin-bottom: 40px;
    line-height: 24px;
  }

  .text {
    margin-bottom: 25px;
    line-height: 24px;
  }

  .sub-header {
    color: var(--periwinkle);
  }

  a {
    width: 100%;
  }
`;

const StyledButton = styled(Button)`
  width: 50%;

  :first-of-type {
    margin-right: 10px;
  }
`;

const MintReview = ({ backLink, nft }) => {
  const { user } = useContext(NearContext);
  const { mintGem } = useContext(NftContractContext);
  const queryClient = useQueryClient();

  const processMintClick = async () => {
    await queryClient.invalidateQueries('gemsForOwner', user.accountId);
    await mintGem(nft);

    // todo: show MintSuccessMessage on mint success (check if success from query params after on redirect from near wallet when we stop using hash browser)
    // toast.success(<MintSuccessMessage />);
  };

  const wasDescribed = !!nft.creator;

  if (!wasDescribed) {
    return <Redirect to="/" />;
  }

  return (
    <Container>
      <HeadingText>Yay!</HeadingText>
      <p className="clarification">
        This is how your NFT will appear on the marketplace. You cannot remove an NFT once it is minted.
      </p>
      <p className="sub-header">Art piece title</p>
      <p className="text">{nft.title}</p>
      <p className="sub-header">Art piece description</p>
      <p className="text">{nft.description}</p>
      <ArtItemPriced dataUrl={nft.artDataUrl} bid={nft.startingBid} bidAvailable={false} />
      <StickedToBottom isSecondary>
        <StyledButton isSecondary>
          <Link to={backLink}>Replace Art</Link>
        </StyledButton>
        <StyledButton onClick={processMintClick} isPrimary>
          Mint NFT
        </StyledButton>
      </StickedToBottom>
    </Container>
  );
};

MintReview.propTypes = {
  backLink: PropTypes.string.isRequired,
  nft: NftTypeRequired,
};

export default MintReview;
