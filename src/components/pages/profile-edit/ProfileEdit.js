import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';

import { Page } from '~/router';
import { ProfileEditBio, ProfileEditPhoto } from './steps';

import NotFound404 from '../not-found-404';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  min-height: calc(100% - 90px);
  max-width: 767px;
  padding: 100px 28px 120px;

  @media (min-width: 767px) {
    margin: 0 auto;
    align-items: center;
  }
`;

const ProfileEdit = () => {
  const match = useRouteMatch();

  return (
    <Container>
      <Switch>
        <Route path={`${match.path}/upload-photo`}>
          <ProfileEditPhoto />
        </Route>
        <Route exact path={`${match.path}`}>
          <ProfileEditBio uploadPhotoLink={`${match.path}/upload-photo`} />
        </Route>
        <Page component={NotFound404} />
      </Switch>
    </Container>
  );
};

export default ProfileEdit;
