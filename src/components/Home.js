import React from 'react';
import styled from 'styled-components';
import DiamondIcon from '../assets/DiamondIcon';
import art from '../assets/art.png';

const Container = styled('div')`
  padding: 15px;
  max-width: 1200px;
  margin: 0 auto;

  .items-container {
    margin-top: 60px;
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

  h1 {
    text-align: center;
    font-size: 100px;
    margin-bottom: 20px;

    @media (max-width: 767px) {
      margin-top: 30px;
      font-size: 70px;
    }
  }

  .desc {
    text-align: center;
    font-size: 24px;
    font-weight: 300;
  }

  > svg {
    display: block;
    margin: 20px auto 0 auto;
  }
`;

export default function SignUp() {
  return (
    <Container>
      <h1 className="border-text">RARE ART GEMS</h1>
      <div className="desc">Create, buy, and sell art with Cryptocurrency</div>
      <DiamondIcon />
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
    </Container>
  );
}
