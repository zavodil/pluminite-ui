import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { NearContext } from '../../contexts';

import { HeadingText, SmallText } from '../common/typography';
import { Input, InputNear, InputRoyalty, InputSign } from '../common/forms';
import ButtonBottom from '../common/Button/ButtonBottom';
import Button from '../common/Button';
import RemoveIcon from '../../assets/RemoveIcon';

import { APP } from '../../constants';

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

  .collaborator-id {
    min-width: 200px;
  }

  .remove-icon {
    cursor: pointer;
  }
`;

const Collaborator = ({ number, userId, royalty, onRemoveButtonClick, onCollaboratorChange }) => {
  return (
    <CollaboratorContainer>
      <InputSign
        type="number"
        className="collaborator-royalty"
        name={`royalty-${number}`}
        isRequired
        isSmall
        sign="%"
        onChange={(e) => onCollaboratorChange(number, userId, e.target.value)}
        value={royalty || ''}
      />
      <InputSign
        className="collaborator-id"
        type="text"
        sign="@"
        placement="left"
        name={`collaborator-id-${number}`}
        isRequired
        isSmall
        onChange={(e) => onCollaboratorChange(number, e.target.value, royalty)}
        value={userId || ''}
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

const MintDescribe = ({ onCompleteLink }) => {
  const { user } = useContext(NearContext);
  const [collaborators, setCollaborators] = useState([]);

  const addCollaborator = () => setCollaborators((prevNumber) => [...prevNumber, {}]);

  const removeCollaborator = (index) => {
    setCollaborators((prevCollaborators) => prevCollaborators.filter((_, i) => i !== index));
  };

  const updateCollaborator = (index, userId, royalty) => {
    setCollaborators((prevCollaborators) => [
      ...prevCollaborators.slice(0, index),
      {
        royalty,
        userId,
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
      <InputRoyalty name="royalty" labelText="Royalty Fee" isRequired asideText={`@${user.accountId}`} isSmall />
      {collaborators.map(({ royalty, userId }, index) => (
        <Collaborator
          key={index}
          number={index}
          royalty={royalty}
          userId={userId}
          onRemoveButtonClick={() => removeCollaborator(index)}
          onCollaboratorChange={updateCollaborator}
        />
      ))}
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
