import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { NearContext } from '../../contexts';

import { HeadingText, SmallText } from '../common/typography';
import { Input, InputNear, InputRoyalty, InputSign } from '../common/forms';
import ButtonBottom from '../common/Button/ButtonBottom';
import Button from '../common/Button';

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

  > *:first-child {
    margin-right: 22px;
  }

  .collaborator-id {
    min-width: 200px;
  }
`;

const Collaborator = () => {
  const [collaboratorName, setCollaboratorName] = useState('');

  const onCollaboratorInputChange = (e) => {
    const collaboratorNewName = e.target.value;
    setCollaboratorName(collaboratorNewName);
  };

  return (
    <CollaboratorContainer>
      <InputSign className="collaborator-royalty" name="royalty" isRequired sign="%" />
      <InputSign
        className="collaborator-id"
        type="text"
        sign="@"
        placement="left"
        name="royalty"
        isRequired
        inputOnChange={onCollaboratorInputChange}
      />
    </CollaboratorContainer>
  );
};

const MintDescribe = ({ onCompleteLink }) => {
  const { user } = useContext(NearContext);

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
      <InputRoyalty name="royalty" labelText="Royalty Fee" isRequired asideText={`@${user.accountId}`} />
      <Collaborator />
      <Button className="collaborator-add">+ Add Collaborator</Button>
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
