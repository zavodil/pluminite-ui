import React, { useContext } from 'react';
import styled from 'styled-components';

import { NearContext } from '../contexts';

import { HeadingText, SmallText } from './common/typography';
import { Input, InputNear, InputRoyalty } from './common/forms';

import bgSignup from '../assets/bg-signup.png';
import Button from './common/Button';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 100px 28px 120px;

  h2 {
    margin-bottom: 0;
  }

  .freebies {
    height: 70px;
  }

  .collaborator {
    cursor: pointer;
  }

  .button-bottom {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    padding: 20px 13px;
    background-color: var(--plum);
    box-shadow: 0 0 74px rgba(190, 20, 205, 0.45);

    button {
      width: 100%;
      max-width: none;
    }
  }

  @media (min-width: 767px) {
    padding-top: 0;
    align-items: center;
    justify-content: center;
    background: url(${bgSignup}) no-repeat bottom left fixed;
  }
`;

export default function Mint() {
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
      <span className="collaborator">+ Add Collaborator</span>
      <div className="button-bottom">
        <Button isPrimary>Next Step: Upload Artwork</Button>
      </div>
    </Container>
  );
}
