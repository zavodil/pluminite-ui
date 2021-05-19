import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { NearContext } from '../../contexts';

import { HeadingText, SmallText } from '../common/typography';
import { Input, InputNear, InputRoyalty, InputSign } from '../common/forms';
import ButtonBottom from '../common/Button/ButtonBottom';
import Button from '../common/Button';

import RemoveIcon from '../../assets/RemoveIcon';

import { APP } from '../../constants';

import { useDebounce } from '../../hooks';

import { doesAccountExists } from '../../apis';

const Container = styled('div')`
  max-width: 600px;
  margin: 0 auto;

  h2 {
    margin-bottom: 0;
  }

  .freebies {
    min-height: 70px;
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
  margin-bottom: 22px;
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

const Collaborator = ({ number, userId, royalty, onRemoveButtonClick, onCollaboratorChange }) => {
  const { nearContent } = useContext(NearContext);

  const [userIdValue, setUserIdValue] = useState(userId);
  const [royaltyValue, setRoyaltyValue] = useState(royalty);
  const [royaltyIsError, setRoyaltyIsError] = useState(false);
  const [userIdIsError, setUserIdIsError] = useState(false);

  const debouncedUserIdValue = useDebounce(userIdValue, 500);
  const debouncedRoyaltyValue = useDebounce(royaltyValue, 500);

  useEffect(() => {
    if (debouncedUserIdValue) {
      doesAccountExists(debouncedUserIdValue, nearContent.connection).then((doesExist) => {
        setUserIdIsError(!doesExist);
        onCollaboratorChange(number, debouncedUserIdValue, royalty, doesExist);
      });
    }
  }, [debouncedUserIdValue]);

  useEffect(() => {
    if (debouncedRoyaltyValue < APP.MIN_ROYALTY || debouncedRoyaltyValue > APP.MAX_ROYALTY) {
      setRoyaltyIsError(true);
    } else {
      setRoyaltyIsError(false);
    }

    onCollaboratorChange(number, userId, debouncedRoyaltyValue);
  }, [debouncedRoyaltyValue]);

  return (
    <CollaboratorContainer>
      <InputSign
        type="number"
        className="collaborator-royalty"
        name={`royalty-${number}`}
        isRequired
        isSmall
        isError={royaltyIsError}
        sign="%"
        onChange={(e) => setRoyaltyValue(e.target.value)}
        value={royaltyValue || ''}
      />
      <InputSign
        className="collaborator-id"
        type="text"
        sign="@"
        placement="left"
        name={`collaborator-id-${number}`}
        isRequired
        isSmall
        isError={userIdIsError}
        onChange={(e) => setUserIdValue(e.target.value)}
        value={userIdValue || ''}
      />
      <RemoveIcon onClick={onRemoveButtonClick} />
    </CollaboratorContainer>
  );
};

Collaborator.propTypes = {
  number: PropTypes.number,
  userId: PropTypes.string,
  royalty: PropTypes.string,
  onRemoveButtonClick: PropTypes.func,
  onCollaboratorChange: PropTypes.func,
};

const isToMuchRoyalties = (collaborators, userRoyalty) => {
  return collaborators.reduce((acc, cv) => acc + +(cv.royalty || 0), 0) + +userRoyalty > APP.MAX_ROYALTY;
};

const MintDescribe = ({ onCompleteLink }) => {
  const { user } = useContext(NearContext);
  const [collaborators, setCollaborators] = useState([]);
  const [userRoyalty, setUserRoyalty] = useState(APP.DEFAULT_ROYALTY);

  const addCollaborator = () => setCollaborators((prevNumber) => [...prevNumber, {}]);

  const removeCollaborator = (index) => {
    setCollaborators((prevCollaborators) => prevCollaborators.filter((_, i) => i !== index));
  };

  const updateCollaborator = (index, userId, royalty, accountExists = true) => {
    setCollaborators((prevCollaborators) => [
      ...prevCollaborators.slice(0, index),
      {
        royalty,
        userId,
        accountExists,
      },
      ...prevCollaborators.slice(index + 1),
    ]);
  };

  return (
    <Container>
      <HeadingText>Mint a Gem</HeadingText>
      <div className="freebies">
        <SmallText>
          We&apos;ll front the cost of your first 3 mints. You&apos;ll need to make a sale to cover your first 3 mints
          or add funds to your NEAR wallet to continue minting more NFTs.
        </SmallText>
      </div>
      <Input name="gem_title" labelText="Gem Title" isRequired />
      <Input name="description" labelText="Description" isRequired />
      <InputNear name="starting_bid" labelText="Starting Bid" isRequired />
      <InputRoyalty
        name="royalty"
        labelText="Royalty Fee"
        isRequired
        asideText={`@${user.accountId}`}
        isSmall
        onChange={(e) => setUserRoyalty(e.target.value)}
      />
      {collaborators.map(({ royalty, userId }, index) => (
        <Collaborator
          key={`collaborator-${index}`}
          number={index}
          royalty={royalty}
          userId={userId}
          onRemoveButtonClick={() => removeCollaborator(index)}
          onCollaboratorChange={updateCollaborator}
        />
      ))}
      <div className="error-messages">
        {isToMuchRoyalties(collaborators, userRoyalty) && (
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
        <Button className="collaborator-add" onClick={addCollaborator}>
          + Add Collaborator
        </Button>
      )}
      <p className="fee-description">
        Pluminite will take a 5% fee for all sales to continue building the Pluminite community.
      </p>
      <ButtonBottom link={onCompleteLink} text="Next Step: Upload Artwork" />
    </Container>
  );
};

MintDescribe.propTypes = {
  onCompleteLink: PropTypes.string,
};

export default MintDescribe;
