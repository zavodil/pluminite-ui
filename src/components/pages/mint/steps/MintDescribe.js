import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { parseNearAmount } from 'near-api-js/lib/utils/format';

import { NearContext, NftContractContext } from '../../../../contexts';

import { convertYoctoNearsToNears } from '../../../../utils/nears';

import { HeadingText, SmallText } from '../../../common/typography';
import { Input, InputNear, InputRoyalty, InputSign, Textarea } from '../../../common/forms';
import ButtonBottom from '../../../common/Button/ButtonBottom';
import Button from '../../../common/Button';

import RemoveIcon from '../../../../assets/RemoveIcon';

import { APP, QUERY_KEYS } from '../../../../constants';

import { useDebounce } from '../../../../hooks';

import { doesAccountExist } from '../../../../apis';

import { NftTypeRequired } from '../../../../types/NftTypes';

const Container = styled('div')`
  max-width: 600px;
  margin: 0 auto;

  h2 {
    margin-bottom: 0;
  }

  .freebies {
    min-height: 70px;
  }

  .user-royalty-input {
    .form-group {
      margin-bottom: 0;
    }
  }

  .collaborator-add {
    margin-bottom: 30px;
  }

  .fee-description {
    font-size: 13px;
    line-height: 18px;
  }

  .error-messages {
    margin: 35px 0 40px;
  }

  .error-message {
    margin-bottom: 25px;
    padding: 20px 25px;
    border: 1px solid var(--error);
    border-radius: var(--radius-default);
    background-color: var(--error-bg);
  }
`;

const CollaboratorContainer = styled('div')`
  display: flex;
  margin: 22px 0;
  align-items: center;

  > .form-group {
    margin-right: 22px;
  }

  .form-group {
    margin-bottom: 0;
  }

  .collaborator-royalty {
    width: 90px;
  }

  .collaborator-id {
    min-width: 200px;
  }

  .remove-icon {
    cursor: pointer;
  }
`;

const Collaborator = ({ number, collaborator, onRemoveButtonClick, onCollaboratorChange, connection }) => {
  const { userId, royalty } = collaborator;

  const [userIdValue, setUserIdValue] = useState(userId);
  const [royaltyValue, setRoyaltyValue] = useState(royalty);
  const [royaltyIsError, setRoyaltyIsError] = useState(false);
  const [userIdIsError, setUserIdIsError] = useState(false);

  const debouncedUserIdValue = useDebounce(userIdValue, 500);
  const debouncedRoyaltyValue = useDebounce(royaltyValue, 500);

  useEffect(() => {
    if (debouncedUserIdValue) {
      doesAccountExist(debouncedUserIdValue, connection).then((doesExist) => {
        setUserIdIsError(!doesExist);
        onCollaboratorChange(number, { ...collaborator, userId: debouncedUserIdValue, accountExists: doesExist });
      });
    } else {
      setUserIdIsError(false);
      onCollaboratorChange(number, { collaborator, userId: debouncedUserIdValue });
    }
  }, [debouncedUserIdValue]);

  useEffect(() => {
    if (
      debouncedRoyaltyValue &&
      (debouncedRoyaltyValue < APP.MIN_COLLABORATOR_ROYALTY || debouncedRoyaltyValue > APP.MAX_ROYALTY)
    ) {
      setRoyaltyIsError(true);
    } else {
      setRoyaltyIsError(false);
    }

    onCollaboratorChange(number, { ...collaborator, royalty: debouncedRoyaltyValue });
  }, [debouncedRoyaltyValue]);

  return (
    <CollaboratorContainer>
      <InputSign
        type="number"
        className="collaborator-royalty"
        name={`royalty-${number}`}
        isSmall
        isError={royaltyIsError}
        sign="%"
        onChange={(e) => setRoyaltyValue(e.target.value)}
        value={royaltyValue || ''}
      />
      <InputSign
        className="collaborator-id"
        type="text"
        autoCapitalize="off"
        sign="@"
        placement="left"
        name={`collaborator-id-${number}`}
        isSmall
        isError={userIdIsError}
        onChange={(e) => setUserIdValue(e.target.value.toLowerCase())}
        value={userIdValue || ''}
      />
      <RemoveIcon onClick={onRemoveButtonClick} />
    </CollaboratorContainer>
  );
};

Collaborator.propTypes = {
  number: PropTypes.number,
  collaborator: PropTypes.shape({
    userId: PropTypes.string,
    royalty: PropTypes.string,
  }),
  onRemoveButtonClick: PropTypes.func,
  onCollaboratorChange: PropTypes.func,
  connection: PropTypes.object,
};

const MintDescribe = ({ onCompleteLink, nft, setNft, setNftField }) => {
  const { user, nearContent } = useContext(NearContext);
  const { getIsFreeMintAvailable } = useContext(NftContractContext);

  const [userRoyalty, setUserRoyalty] = useState(APP.DEFAULT_ROYALTY);
  const [collaborators, setCollaborators] = useState([]);
  const [userRoyaltyIsError, setUserRoyaltyIsError] = useState(false);

  const { data: isFreeMintAvailable } = useQuery(
    [QUERY_KEYS.IS_FREE_MINT_AVAILABLE, user.accountId],
    () => getIsFreeMintAvailable(user.accountId),
    {
      enabled: !!user?.accountId,
      staleTime: 0,
    }
  );

  useEffect(() => {
    if (userRoyalty && (userRoyalty < APP.MIN_CREATOR_ROYALTY || userRoyalty > APP.MAX_ROYALTY)) {
      setUserRoyaltyIsError(true);
    } else {
      setUserRoyaltyIsError(false);
      setNftField('creatorRoyalty', String(userRoyalty));
    }
  }, [userRoyalty]);

  const isTooMuchRoyalties = () =>
    collaborators.reduce((acc, cv) => acc + +(cv.royalty || 0), 0) + +userRoyalty > APP.MAX_ROYALTY;
  const hasEnoughNears = () => Number(convertYoctoNearsToNears(user.balance)) > APP.MIN_NEARS_TO_MINT;
  const hasExceededPrepaidMints = () => !isFreeMintAvailable;
  const isMintForbidden = () => !hasEnoughNears() && hasExceededPrepaidMints();
  const isDisabled = isMintForbidden();

  const addCollaborator = () => {
    if (isDisabled) {
      return;
    }

    setCollaborators((prevNumber) => [...prevNumber, { key: new Date().getTime() }]);
  };

  const removeCollaborator = (index) => {
    setCollaborators((prevCollaborators) => prevCollaborators.filter((_, i) => i !== index));
  };

  const updateCollaborator = (index, collaboratorNew) => {
    setCollaborators((prevCollaborators) => [
      ...prevCollaborators.slice(0, index),
      collaboratorNew,
      ...prevCollaborators.slice(index + 1),
    ]);
  };

  // todo: add more checks, check length
  const isProceedAllowed = () =>
    nft.title &&
    nft.description &&
    nft.description.length <= APP.GEM_DESCRIPTION_MAX_LENGTH &&
    nft.conditions?.near !== undefined &&
    nft.collaborators.length < APP.MAX_COLLABORATORS &&
    !isTooMuchRoyalties() &&
    !userRoyaltyIsError;

  useEffect(() => setNftField('creator', user.accountId), []);

  useEffect(() => {
    setNft((nftOld) => {
      return {
        ...nftOld,
        collaborators: collaborators
          .filter(({ userId, accountExists, royalty }) => userId && accountExists && royalty)
          .map(({ userId, royalty }) => {
            return { userId, royalty };
          }),
      };
    });
  }, [collaborators]);

  return (
    <Container>
      <HeadingText>Mint a Gem</HeadingText>
      <div className="freebies">
        {!hasEnoughNears() && !isDisabled && (
          <SmallText>
            We&apos;ll front the cost of your first 3 mints. You&apos;ll need to make a sale to cover your first 3 mints
            or add funds to your NEAR wallet to continue minting more NFTs.
          </SmallText>
        )}
        {isDisabled && (
          <SmallText isError>
            We&apos;ve fronted the cost of your first 3 mints. Sell one of those NFTs or send $NEAR to your wallet to
            mint more.
          </SmallText>
        )}
      </div>
      <Input
        name="gem_title"
        labelText="Gem Title"
        isRequired
        isDisabled={isDisabled}
        value={nft.title || ''}
        onChange={(e) => setNftField('title', e.target.value)}
      />
      <Textarea
        name="description"
        labelText="Description"
        rows={4}
        maxLength={APP.GEM_DESCRIPTION_MAX_LENGTH}
        isRequired
        isDisabled={isDisabled}
        textInitial={nft.description || ''}
        onTextChange={(value) => setNftField('description', value)}
      />
      <InputNear
        name="starting_bid"
        labelText="Price"
        isRequired
        isDisabled={isDisabled}
        nearsInitial={nft?.conditions?.near ? convertYoctoNearsToNears(nft?.conditions?.near) : ''}
        onNearsChange={(value) => setNftField('conditions', { near: parseNearAmount(value) })}
      />
      <div className="user-royalty-input">
        <InputRoyalty
          name="royalty"
          labelText="Royalty Fee"
          asideText={`@${user.accountId}`}
          isSmall
          value={userRoyalty}
          onChange={(e) => setUserRoyalty(e.target.value)}
          isDisabled={isDisabled}
          isError={userRoyaltyIsError}
        />
      </div>
      {collaborators.map((collaborator, index) => {
        return (
          <Collaborator
            key={`collaborator-${collaborator.key}`}
            number={index}
            collaborator={collaborator}
            onRemoveButtonClick={() => removeCollaborator(index)}
            onCollaboratorChange={updateCollaborator}
            connection={nearContent.connection}
          />
        );
      })}
      <div className="error-messages">
        {isTooMuchRoyalties() && (
          <div className="error-message">You cannot exceed {APP.MAX_ROYALTY}% in royalties.</div>
        )}
        {collaborators.map(({ userId, accountExists }, index) => {
          if (!userId || accountExists) {
            return null;
          }

          return (
            <div key={`nonexistent-user-${index}`} className="error-message">
              Wallet name &apos;{userId}&apos; not found
            </div>
          );
        })}
      </div>
      {collaborators.length + 1 < APP.MAX_COLLABORATORS && (
        <Button className="collaborator-add" onClick={addCollaborator} isDisabled={isDisabled}>
          + Add Collaborator
        </Button>
      )}
      <p className="fee-description">
        {APP.NAME} will take a 5% fee for all sales to continue building the {APP.NAME} community.
      </p>
      <ButtonBottom
        link={onCompleteLink}
        text="Next Step: Upload Artwork"
        isDisabled={isDisabled || !isProceedAllowed()}
      />
    </Container>
  );
};

MintDescribe.propTypes = {
  onCompleteLink: PropTypes.string.isRequired,
  nft: NftTypeRequired,
  setNft: PropTypes.func.isRequired,
  setNftField: PropTypes.func.isRequired,
};

export default MintDescribe;
