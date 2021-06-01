import React, { useContext, useEffect, useRef } from 'react';
import { useInfiniteQuery, useQuery as useRQuery } from 'react-query';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import defaultProfilePicture from '../../../assets/default-profile-picture.png';

import Balance from '../../NavigationComponents/Balance';
import Button from '../../common/Button';
import { ArtItem, ArtItemSellable } from '../../common/art';
import { Tabs } from '../../common/tabs';
import { Loading } from '../../common/utils';

import { useQuery } from '../../../hooks';

import { NearContext, NftContractContext, MarketContractContext } from '../../../contexts';

import { getFileData } from '../../../apis';

import { APP, QUERY_KEYS } from '../../../constants';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 767px;
  padding: 100px 28px 120px;

  > * {
    margin: 0 0 25px;
  }

  .summary {
    display: flex;
    flex-direction: row;
    align-items: center;

    > * {
      margin-right: 40px;
    }

    .picture {
      width: 62px;
      height: 62px;
      border-radius: 100%;
    }

    .summary-block {
      display: flex;
      flex-direction: column;
      min-width: 40px;
      white-space: nowrap;

      .summary-block-top {
        font-size: 20px;
        line-height: 25px;
        color: var(--periwinkle);

        .usds {
          font-size: 12px;
        }
      }

      .summary-block-bottom {
        font-size: 11px;
        line-height: 18px;
        color: var(--lavendar);
      }
    }
  }

  .tabs-tab.tabs-tab--active {
    display: flex;
    flex-direction: column;
    align-items: center;

    .items {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
    }

    .load-more {
      margin-top: 25px;
    }
  }

  @media (min-width: 767px) {
    margin: 0 auto;
    align-items: center;

    > * {
      margin: 0 0 50px;
    }

    > .button {
      width: 350px;
    }

    .tabs-tab.tabs-tab--active {
      justify-content: space-evenly;
    }
  }
`;

export default function Profile() {
  const { user } = useContext(NearContext);
  const { getGemsForOwner, getGemsForCreator, getProfile } = useContext(NftContractContext);
  const { marketContract } = useContext(MarketContractContext);

  const ownedGemRef = useRef();

  const query = useQuery();
  const ownedGemId = query.get('gem-id');

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery(
    [QUERY_KEYS.GEMS_FOR_OWNER, user.accountId],
    ({ pageParam = 0 }) => getGemsForOwner(user.accountId, String(pageParam), String(APP.MAX_ITEMS_PER_PAGE_PROFILE)),
    {
      getNextPageParam(lastPage, pages) {
        if (lastPage.length === APP.MAX_ITEMS_PER_PAGE_PROFILE) {
          return pages.length * APP.MAX_ITEMS_PER_PAGE_PROFILE;
        }

        return undefined;
      },
    }
  );

  const {
    data: forCreatorData,
    fetchNextPage: forCreatorFetchNextPage,
    hasNextPage: forCreatorHasNextPage,
    isFetching: forCreatorIsFetching,
    isFetchingNextPage: forCreatorIsFetchingNextPage,
  } = useInfiniteQuery(
    [QUERY_KEYS.GEMS_FOR_CREATOR, user.accountId],
    ({ pageParam = 0 }) => getGemsForCreator(user.accountId, String(pageParam), String(APP.MAX_ITEMS_PER_PAGE_PROFILE)),
    {
      getNextPageParam(lastPage, pages) {
        if (lastPage.length === APP.MAX_ITEMS_PER_PAGE_PROFILE) {
          return pages.length * APP.MAX_ITEMS_PER_PAGE_PROFILE;
        }

        return undefined;
      },
    }
  );

  const { data: profile } = useRQuery([QUERY_KEYS.GET_PROFILE, user.accountId], () => getProfile(user.accountId), {
    enabled: !!user?.accountId,
  });

  useEffect(() => {
    if (ownedGemRef?.current) {
      ownedGemRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data]);

  const { data: imageData } = useRQuery(
    [QUERY_KEYS.GET_IMAGE_DATA, profile?.image],
    () => getFileData(profile?.image),
    {
      retry: 1,
      enabled: !!profile?.image,
    }
  );

  return (
    <Container>
      <div className="summary">
        <img
          className="picture"
          src={imageData || defaultProfilePicture}
          alt="profile picture"
          width="62"
          height="62"
        />
        <div className="summary-block">
          <span className="summary-block-top">0</span>
          <span className="summary-block-bottom">Pieces Sold</span>
        </div>
        <div className="summary-block">
          <Balance className="summary-block-top" precision={2} />
          <span className="summary-block-bottom">Your Funds</span>
        </div>
      </div>
      <p className="profile-description">{profile?.bio || 'You haven’t added a description yet.'} </p>
      <Button isSecondary>
        <Link to="/profile/edit">Edit Profile</Link>
      </Button>
      <Tabs
        tabsArray={[
          {
            title: 'Gems I own',
            content: (
              <Loading waitingFor={data?.pages}>
                <div className="items">
                  {data?.pages &&
                    data.pages.flat().map((nft) => {
                      const ArtItemComponent =
                        marketContract.contractId in nft.approved_account_ids ? ArtItem : ArtItemSellable;

                      return (
                        <ArtItemComponent
                          key={nft.token_id}
                          forwardedRef={ownedGemId === nft.token_id ? ownedGemRef : null}
                          nft={nft}
                          isLink
                          isFromIpfs
                        />
                      );
                    })}
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
              </Loading>
            ),
          },
          {
            title: 'Gems I made',
            content: (
              <Loading waitingFor={forCreatorData?.pages}>
                <div className="items">
                  {forCreatorData?.pages &&
                    forCreatorData.pages.flat().map((nft) => {
                      const ArtItemComponent =
                        !(marketContract.contractId in nft.approved_account_ids) && nft.owner_id === user.accountId
                          ? ArtItemSellable
                          : ArtItem;

                      return (
                        <ArtItemComponent
                          key={nft.token_id}
                          forwardedRef={ownedGemId === nft.token_id ? ownedGemRef : null}
                          nft={nft}
                          isLink
                          isFromIpfs
                        />
                      );
                    })}
                </div>
                {forCreatorHasNextPage && (
                  <Button
                    isPrimary
                    onClick={() => forCreatorFetchNextPage()}
                    isDisabled={forCreatorIsFetching || forCreatorIsFetchingNextPage}
                    className="load-more"
                  >
                    Load more
                  </Button>
                )}
              </Loading>
            ),
          },
        ]}
      />
    </Container>
  );
}
