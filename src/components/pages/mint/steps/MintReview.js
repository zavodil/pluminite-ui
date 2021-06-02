import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useQueryClient } from 'react-query';
import { Link, Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import { MarketContractContext, NearContext } from '../../../../contexts';

import { getNextBidNearsFormatted } from '../../../../utils/nears';

import { HeadingText } from '../../../common/typography';
import { ArtItemPriced } from '../../../common/art';
import { StickedToBottom } from '../../../common/layout';
import Button from '../../../common/Button';
import { DotsLoading } from '../../../common/utils';

import { uploadFileData } from '../../../../apis';

import { QUERY_KEYS } from '../../../../constants';

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
  const [isMinting, setIsMinting] = useState(false);
  const { user } = useContext(NearContext);
  const { mintAndListGem } = useContext(MarketContractContext);
  const queryClient = useQueryClient();

  const uploadToIPFS = async ({ imageDataUrl, imageThumbnailDataUrl }) =>
    Promise.all([uploadFileData(imageDataUrl), uploadFileData(imageThumbnailDataUrl)]);

  const processMintClick = async () => {
    setIsMinting(true);

    await Promise.all([
      queryClient.invalidateQueries(QUERY_KEYS.GEMS_FOR_OWNER, user.accountId),
      queryClient.invalidateQueries(QUERY_KEYS.GEMS_FOR_CREATOR, user.accountId),
      queryClient.invalidateQueries(QUERY_KEYS.SALES_POPULATED),
    ]);

    let ipfsHash;
    let thumbnailIpfsHash;
    let uploadError;

    try {
      [ipfsHash, thumbnailIpfsHash] = await uploadToIPFS({
        imageDataUrl: nft.artDataUrl,
        imageThumbnailDataUrl: nft.artThumbnailDataUrl,
      });
    } catch (e) {
      console.error(e);
      uploadError = e;
    }

    if (!ipfsHash || !thumbnailIpfsHash || uploadError) {
      setIsMinting(false);
      toast.error('Sorry 😢 There was a problem with uploading your art file to IPFS. Try again later.');

      return;
    }

    try {
      await mintAndListGem({ ...nft, media: ipfsHash, media_lowres: thumbnailIpfsHash });
    } catch (e) {
      console.error(e);

      setIsMinting(false);
      toast.error('Sorry 😢 There was a problem with minting and listing your gem on the market. Try again later.');

      return;
    }

    // todo: show MintSuccessMessage on mint success (check if success from query params after on redirect from near
    // wallet when we stop using hash browser) toast.success(<MintSuccessMessage />);

    setIsMinting(false);
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
      <ArtItemPriced
        nft={{ metadata: { media: nft.artDataUrl } }}
        bid={getNextBidNearsFormatted(nft)}
        bidAvailable={false}
      />
      <StickedToBottom isSecondary>
        <StyledButton isSecondary isDisabled={isMinting}>
          <Link to={backLink}>Replace Art</Link>
        </StyledButton>
        <StyledButton onClick={processMintClick} isPrimary isDisabled={isMinting}>
          {isMinting ? 'Minting' : 'Mint NFT'}
          {isMinting && <DotsLoading />}
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
