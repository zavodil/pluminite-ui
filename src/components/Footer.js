import React from 'react';
import styled from 'styled-components';

const Container = styled('footer')`
  z-index: 1;
  padding: 24px;
  background-color: var(--plum);
  box-shadow: 0 0 74px rgba(190, 20, 205, 0.45);
  font-size: 20px;

  .top {
    display: flex;
    justify-content: space-between;
    max-width: 912px;
    margin: 0 auto 20px;

    a {
      color: var(--lavendar);
      transition: color 250ms;

      :hover {
        color: var(--periwinkle);
      }
    }
  }

  .bottom {
    text-align: center;
  }
`;

export default function Footer() {
  return (
    <Container>
      <div className="top">
        <a href="/">Terms of Service</a>
        <a href="/">FAQs</a>
        <a href="https://2biqpwq7khk.typeform.com/to/FgnGmWij">Report Content</a>
      </div>
      <div className="bottom">Pluminite is in Open Beta :)</div>
    </Container>
  );
}
