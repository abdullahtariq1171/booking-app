import React, { lazy, Suspense } from 'react';
import { VStack } from '@chakra-ui/react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { withErrorBoundary } from 'shared/ErrorBoundary';
import { PageWrapper } from 'shared/Layout';
import { Spinner } from 'shared/Spinner';

import { Header } from './Header';

const FacilitiesTab = lazy(() => import('./FacilitiesTab'));
const FacilityTab = lazy(() => import('./FacilityTab'));
const EditFacilityTab = lazy(() => import('./EditFacilityTab'));
const CreateFacilityTab = lazy(() => import('./CreateFacilityTab'));
const ReadEnterpriseTab = lazy(() => import('./EnterpriseTab'));
const EditEnterpriseTab = lazy(() => import('./EditEnterpriseTab'));

const Dashboard = () => {
  return (
    <PageWrapper spacing={{ base: 6, md: 10 }}>
      <Header />
      <VStack w='100%' maxW='1200px' pb={{ base: 4, md: 10 }}>
        <Suspense fallback={<Spinner />}>
          <Switch>
            <Route path='/dashboard/enterprise/edit' component={EditEnterpriseTab} />
            <Route path='/dashboard/facilities-register' component={CreateFacilityTab} />
            <Route path='/dashboard/facilities/:facilitySlug/edit' component={EditFacilityTab} />
            <Route path='/dashboard/facilities/:facilitySlug' component={FacilityTab} />
            <Route path='/dashboard/enterprise' component={ReadEnterpriseTab} />
            <Route path='/dashboard/facilities' component={FacilitiesTab} exact />
            <Route render={() => <Redirect to='/dashboard/enterprise' />} />
          </Switch>
        </Suspense>
      </VStack>
    </PageWrapper>
  );
};

export default withErrorBoundary(Dashboard);
