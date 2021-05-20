import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';

import { ProfileEditBio } from './ProfileEditSteps';

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

  return (
    <Container>
      <Switch>
        <Route path={`${match.path}/upload-profile-photo`}>
          <div>Upload a profile photo</div>
        </Route>
        <Route path={match.path}>
          <ProfileEditBio />
        </Route>
      </Switch>
    </Container>
  );
}
