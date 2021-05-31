import React, { useContext } from 'react';
import { useInfiniteQuery } from 'react-query';
import styled from 'styled-components';

import { NearContext, MarketContractContext } from '../../../contexts';

import { getNextBidNearsFormatted } from '../../../utils/nears';

import { DisplayText } from '../../common/typography';
import { Contribute, MintPlus } from '../../common/popups';
import { ArtItemPriced } from '../../common/art';
import Button from '../../common/Button';

import DiamondIcon from '../../../assets/DiamondIcon';

import { QUERY_KEYS, APP } from '../../../constants';
import { Loading } from '../../common/utils';

const Container = styled('div')`
  padding: 15px;
  max-width: 1200px;
  margin: 100px auto 0;

  .description-container {
    margin-left: 30px;
  }

  .items-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    .items {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: space-evenly;
    }

    .load-more {
      margin-top: 25px;
    }
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
    position: sticky;
    bottom: 10px;
    right: 10px;
    width: fit-content;
    margin-left: auto;
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
  const { getSalesPopulated } = useContext(MarketContractContext);

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery(
    QUERY_KEYS.SALES_POPULATED,
    ({ pageParam = 0 }) => getSalesPopulated(String(pageParam), String(APP.MAX_ITEMS_PER_PAGE_HOME)),
    {
      getNextPageParam(lastPage, pages) {
        if (lastPage.length === APP.MAX_ITEMS_PER_PAGE_HOME) {
          return pages.length * APP.MAX_ITEMS_PER_PAGE_HOME;
        }

        return undefined;
      },
      enabled: !!user?.accountId,
    }
  );

  return (
    <Container>
      <div className="description-container">
        <DisplayText isBig>RARE ART GEMS</DisplayText>
        <div className="desc">Create, buy, and sell NFT&apos;s with Cryptocurrency</div>
        <div className="diamond">
          <DiamondIcon />
        </div>
      </div>
      <Loading waitingFor={data?.pages}>
        <div className="items-container">
          <div className="items">
            {data?.pages &&
              data.pages
                .flat()
                .map((sale) => (
                  <ArtItemPriced
                    key={sale.token_id}
                    nft={sale}
                    bid={getNextBidNearsFormatted(sale)}
                    gemOnSale={sale}
                    isLink
                    isFromIpfs
                  />
                ))}
          </div>
          {hasNextPage && (
            <Button
              isPrimary
              onClick={() => fetchNextPage()}
              isDisabled={isFetching || isFetchingNextPage}
              className="load-more"
            >
              Load more
            </Button>
          )}
        </div>
      </Loading>
      <div className="pop-up">{user ? <MintPlus /> : <Contribute />}</div>
    </Container>
  );
}
