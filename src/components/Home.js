import React, { useContext } from 'react';
import styled from 'styled-components';

import { NearContext } from '../contexts';

import { DisplayText } from './common/typography';
import { Contribute, Mint } from './common/popups';

import DiamondIcon from '../assets/DiamondIcon';
import art from '../assets/art.png';

const Container = styled('div')`
  padding: 15px;
  max-width: 1200px;
  margin: 100px auto 0;

  .description-container {
    margin-left: 30px;
  }

  .items {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }

  .item {
    position: relative;
    transition: 250ms;
    margin: 15px 5px;

    :hover {
      transform: scale(1.01);
    }

    img {
      border-radius: 8px;
      max-width: 100%;

      @media (min-width: 1100px) {
        max-width: 320px;
      }
    }

    button {
      position: absolute;
      right: 20px;
      bottom: 20px;
    }
  }

  .desc {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 300;
    line-height: 36px;
  }

  .pop-up {
    position: fixed;
    bottom: 10px;
    right: 10px;
  }

  @media (min-width: 767px) {
    .description-container {
      margin-left: 0;
      margin-bottom: 60px;
      text-align: center;
    }
  }
`;

export default function Home() {
  const { user } = useContext(NearContext);

  return (
    <Container>
      <div className="description-container">
        <DisplayText isBig>RARE ART GEMS</DisplayText>
        <div className="desc">Create, buy, and sell NFT&apos;s with Cryptocurrency</div>
        <div className="diamond">
          <DiamondIcon />
        </div>
      </div>
      <div className="items-container">
        <div className="items">
          <div className="item">
            <img src={art} alt="art" />
            <button>Bid $55</button>
          </div>
          <div className="item">
            <img src={art} alt="art" />
            <button>Bid $55</button>
          </div>
          <div className="item">
            <img src={art} alt="art" />
            <button>Bid $55</button>
          </div>
          <div className="item">
            <img src={art} alt="art" />
            <button>Bid $55</button>
          </div>
          <div className="item">
            <img src={art} alt="art" />
            <button>Bid $55</button>
          </div>
          <div className="item">
            <img src={art} alt="art" />
            <button>Bid $55</button>
          </div>
        </div>
      </div>
      <div className="pop-up">{user ? <Mint /> : <Contribute />}</div>
    </Container>
  );
}
