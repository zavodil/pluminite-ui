import { useInfiniteQuery, useQuery } from 'react-query';
import { getBlacklistedTokens } from '../apis';
import { QUERY_KEYS } from '../constants';

export const useQueryGemsWithBlackList = (queryKeys, queryFn, options) => {
  const { data: blacklistedTokens } = useQuery([QUERY_KEYS.BLACKLIST], () => getBlacklistedTokens(), {
    staleTime: 1000 * 60 * 10,
  });

  return useQuery(queryKeys, queryFn, {
    ...options,
    enabled: !!(options.enabled && blacklistedTokens),
    select: (dataRaw) => {
      if (dataRaw?.pages?.length) {
        return dataRaw.pages.flat().filter(({ token_id }) => !blacklistedTokens.includes(token_id));
      }

      return [];
    },
  });
};

export const useInfiniteQueryGemsWithBlackList = (queryKeys, queryFn, options) => {
  const { data: blacklistedTokens } = useQuery([QUERY_KEYS.BLACKLIST], () => getBlacklistedTokens(), {
    staleTime: 1000 * 60 * 10,
  });

  return useInfiniteQuery(queryKeys, queryFn, {
    ...options,
    enabled: !!(options.enabled && blacklistedTokens),
    select: (dataRaw) => {
      if (dataRaw?.pages?.length) {
        return dataRaw.pages.flat().filter(({ token_id }) => !blacklistedTokens.includes(token_id));
      }

      return [];
    },
  });
};
