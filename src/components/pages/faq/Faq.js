import React from 'react';
import styled from 'styled-components';

import { HeadingText } from '../../common/typography';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  min-height: calc(100% - 90px);
  padding: 100px 28px 60px;
  margin: 0 auto;

  p {
    margin: 0;
  }

  ul {
    list-style: none;
  }

  .faq {
    text-align: center;
    margin-bottom: 60px;
  }

  .question {
    color: var(--bubble-gum);
  }

  .answer {
    margin-bottom: 20px;
  }
`;

export default function Faq() {
  return (
    <Container>
      <HeadingText>Faqs</HeadingText>
      <div className="faq">
        <p className="question">What is Pluminite?</p>
        <p className="answer">
          Pluminite is an NFT marketplace that allows you to mint your creations on the NEAR blockchain. You don’t even
          need NEAR tokens in your wallet to get started––Pluminite will front the cost of your first three mints!
        </p>
      </div>
      <div className="faq">
        <p className="question">What does “minting” mean?</p>
        <p className="answer">“Minting” means creating and publishing an NFT on a blockchain.</p>
      </div>
      <div className="faq">
        <p className="question">
          How can you offer minting with “no upfront costs” to people without funds in their NEAR wallet?
        </p>
        <p className="answer">
          Pluminite uses a unique NEAR feature that allows us to supply a small amount of NEAR to an account so the user
          can get started. In exchange, the feature will deduct the cost of those mints from the first NFT sale (don’t
          worry: the cost of minting three pieces is less than 0.1 NEAR).
        </p>
        <p className="answer">
          Pluminite also takes a 5% cut of all sales so that we can continue to enable other artists to mint without any
          upfront costs.
        </p>
      </div>
      <div className="faq">
        <p className="question">Can I fund my NEAR wallet through other methods?</p>
        <p className="answer">
          Definitely! If you already have some NEAR, you can start minting right away. If you add funds after you’ve
          started minting, you unlock the ability for unlimited mints.
        </p>
      </div>
      <div className="faq">
        <p className="question">Is minting my NFT on Pluminite bad for the planet?</p>
        <p className="answer">
          Because Pluminite is built on NEAR, a Proof-of-Stake blockchain network, the cost of minting 1 NFT is roughly
          equivalent to running your laptop for 2 minutes. In addition to the native efficiency of the network, NEAR has
          been certified as carbon-neutral. You can read more about NEAR’s carbon neutrality{' '}
          <a href="https://near.org/blog/the-near-blockchain-is-climate-neutral/">here</a>.
        </p>
      </div>
      <div className="faq">
        <p className="question">What kind of content is NOT permitted on Pluminite?</p>
        <p className="answer">
          <em>We reserve the right to add to this list as needed.</em>
        </p>
        <p className="answer">
          Please report content that violates the guidelines below{' '}
          <a href="https://2biqpwq7khk.typeform.com/to/FgnGmWij">here</a>.
        </p>
        <ul>
          <li>
            <strong>Content You Don’t Own or Haven’t Received Permission to Post</strong>
            <ul>
              <li>
                You must provably own the content you are posting to Pluminite or have clear written consent from the
                original creator.
              </li>
            </ul>
          </li>
          <li>
            <strong>Hate Speech / Harassment</strong>
            <ul>
              <li>
                No instance of Hate Speech or harassment is allowed. No Pluminite user may create content that promotes
                violence or hate speech against anyone or any subset of people based on their race, ethnicity, sex
                gender, national origin, gender, gender identity, sexual orientation, religious affiliation, ability, or
                health status. If your content features related material in an instance to raise awareness, please
                specify that in the description.
              </li>
            </ul>
          </li>
          <li>
            <strong>Extreme Violence or Gore</strong>
            <ul>
              <li>Content that exclusively focuses on extreme gore and violence is not permitted on Pluminite.</li>
            </ul>
          </li>
          <li>
            <strong>Pornography</strong>
            <ul>
              <li>
                Sexually explicit content, such as depictions of sexual acts/intercourse, are not permitted on
                Pluminite.
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div className="faq">
        <p className="question">What happens if I post content that is not permitted?</p>
        <p className="answer">
          Pluminite operates on a “one strike, you’re out” rule. Because our platform allows anyone to mint 3 NFTs
          without any upfront cost, we cannot enable a more complex moderation system at this time. So if you violate
          our content rules, we will take down your entire profile, end of story.
        </p>
      </div>
      <div className="faq">
        <p className="question">Have a different question?</p>
        <p className="answer">
          Join our discord <a href="https://discord.gg/3gCbaHbEkp">here</a> or email us at{' '}
          <a href="mailto:info@pluminite.com">info@pluminite.com</a>.
        </p>
      </div>
    </Container>
  );
}
