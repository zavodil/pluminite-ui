import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import { Page } from '../../../router';
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

export default function ProfileEdit() {
  const match = useRouteMatch();

  const processSave = () => {
    toast.success('Success! Your profile was saved!');
  };

  return (
    <Container>
      <Switch>
        <Route path={`${match.path}/upload-photo`}>
          <ProfileEditPhoto processSave={processSave} />
        </Route>
        <Route exact path={`${match.path}`}>
          <ProfileEditBio uploadPhotoLink={`${match.path}/upload-photo`} processSave={processSave} />
        </Route>
        <Page component={NotFound404} />
      </Switch>
    </Container>
  );
}
