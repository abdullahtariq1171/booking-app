import React from "react";
import { Grid } from "@chakra-ui/react";

import {
  offersQuery,
  offersQueryKey,
} from "modules/offers/infrastructure/query";

import { useInfiniteQuery } from "hooks/useInfiniteQuery";

import { useQueryParams } from "shared/Params";
import { InfinityList } from "shared/InfinityList";
import { Spinner } from "shared/Spinner";
import { NoResultsState } from "shared/States";

import {
  IOfferCollection,
  IOfferCollectionQueryParams,
} from "../../application";
import { OfferItem } from "./OfferItem";

const OffersList = () => {
  const { params } = useQueryParams<IOfferCollectionQueryParams>();
  const limit = 10;

  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery(
    offersQueryKey(params),
    ({ pageParam = 0 }) => {
      return offersQuery({ ...params, limit, offset: pageParam });
    }
  );

  if (isLoading) {
    return <Spinner size="md" />;
  }

  if (!!data?.pages && data.pages[0]?.collection.length === 0) {
    return <NoResultsState />;
  }

  return (
    <Grid templateColumns="100%" w="100%" maxW="1080px" mx="0 auto">
      <InfinityList<IOfferCollection>
        limit={limit}
        data={data?.pages}
        next={() => fetchNextPage()}
        hasMore={hasNextPage ?? true}
      >
        {({ collection }) => (
          <>
            {collection.map((offer, index) => (
              <OfferItem key={offer.offerId} offer={offer} index={index} />
            ))}
          </>
        )}
      </InfinityList>
    </Grid>
  );
};

export { OffersList };
