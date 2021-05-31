import React, { useContext, useEffect, useRef } from 'react';
import { useInfiniteQuery, useQuery as useRQuery } from 'react-query';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import defaultProfilePicture from '../../../assets/default-profile-picture.png';
import placeholderDataUrl from '../../../assets/art.png';

import Balance from '../../NavigationComponents/Balance';
import Button from '../../common/Button';
import { ArtItem } from '../../common/art';
import { Tabs } from '../../common/tabs';
import { Loading } from '../../common/utils';

import { useQuery } from '../../../hooks';

import { NearContext, NftContractContext } from '../../../contexts';

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
  const { getGemsForOwner, getProfile } = useContext(NftContractContext);

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

  const { data: profileBio } = useRQuery([QUERY_KEYS.GET_PROFILE, user.accountId], () => getProfile(user.accountId), {
    enabled: !!user?.accountId,
  });

  useEffect(() => {
    if (ownedGemRef?.current) {
      ownedGemRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data]);

  return (
    <Container>
      <div className="summary">
        <img className="picture" src={defaultProfilePicture} alt="profile picture" width="62" height="62" />
        <div className="summary-block">
          <span className="summary-block-top">0</span>
          <span className="summary-block-bottom">Pieces Sold</span>
        </div>
        <div className="summary-block">
          <Balance className="summary-block-top" precision={2} />
          <span className="summary-block-bottom">Your Funds</span>
        </div>
      </div>
      <p className="profile-description">{profileBio || 'You haven’t added a description yet.'} </p>
      <Button isSecondary>
        <Link
          to={{
            pathname: '/profile/edit',
            profileBio,
          }}
        >
          Edit Profile
        </Link>
      </Button>
      <Tabs
        tabsArray={[
          {
            title: 'Gems I own',
            content: (
              <Loading waitingFor={data?.pages}>
                <div className="items">
                  {data?.pages &&
                    data.pages
                      .flat()
                      .map(({ token_id, metadata: { media } = {} }) => (
                        <ArtItem
                          dataUrl={media}
                          forwardedRef={ownedGemId === token_id ? ownedGemRef : null}
                          key={token_id}
                          gemId={token_id}
                          isLink
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
              </Loading>
            ),
          },
          {
            title: 'Gems I made',
            // todo: after integration with NFT contract set ArtItem id to gemId (can't get nft-s created by a specific
            // user on the current version of the contract)
            // todo: remove `placeholderDataUrl` once we get real data from the contract
            content: Array.from({ length: 2 }).map((_, i) => (
              <ArtItem key={`art-item-made-${i}`} dataUrl={placeholderDataUrl} />
            )),
          },
        ]}
      />
    </Container>
  );
}
