import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useAutoComplete } from 'hooks';
import { OptionType, RequestStatus } from 'types';

import { SelectField, SelectFieldProps } from 'shared/Form/SelectField';
import { useQueryParams } from 'shared/Params';

import { IOffer, IOfferCollection } from '../../types';
import { getOffersKey } from '../../infrastructure/query';

type SelectedOfferOption = OptionType<string> & { offer: IOffer };

type IProps = Omit<SelectFieldProps, 'options' | 'onMenuScrollToBottom' | 'isLoading' | 'isClearable' | 'label' | 'onChangeEffect'> & {
  facilityId: string;
  onChangeEffect?: (option: SelectedOfferOption | null) => void;
};

const OfferSelectFieldAsync = ({ facilityId, onChangeEffect, ...props }: IProps) => {
  const { params } = useQueryParams();
  const { data, search, nextPage, status } = useAutoComplete<SelectedOfferOption, IOfferCollection>({
    url: getOffersKey(facilityId)[0],
    params,
    map: ({ collection }) => {
      return collection.map(offer => ({
        label: offer.name,
        value: offer.offerId,
        offer,
      }));
    },
  });

  return (
    <SelectField
      label={<FormattedMessage id='offer' defaultMessage='Offer' />}
      options={data}
      onMenuScrollToBottom={nextPage}
      onInputChange={value => search(value)}
      isLoading={status === RequestStatus.InProgress}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChangeEffect={onChangeEffect as any}
      isClearable
      {...props}
    />
  );
};

export { OfferSelectFieldAsync };