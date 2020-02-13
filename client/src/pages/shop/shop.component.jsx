import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { CollectionsOverviewContainer } from '../../components';
import { CollectionPageContainer } from '../collection/collection.container';

import { fetchCollectionsStart } from '../../redux/shop/shop.actions';

const ShopPageComponent = ({ fetchCollectionsStart, match: { path } }) => {

  useEffect(() => {
    fetchCollectionsStart();
  }, [fetchCollectionsStart]);

  return (
    <div className="shop-page">
      <Route
        exact
        path={path}
        component={CollectionsOverviewContainer}
      />
      <Route
        path={`${path}/:collectionId`}
        component={CollectionPageContainer}
      />
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  fetchCollectionsStart: () => dispatch(fetchCollectionsStart())
});

export const ShopPage = connect(null, mapDispatchToProps)(ShopPageComponent);