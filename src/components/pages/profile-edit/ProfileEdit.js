import React, {useContext, useState} from 'react';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import { useQuery } from 'react-query';
import {toast} from 'react-toastify';
import styled from 'styled-components';

import {Page} from '../../../router';
import {ProfileEditBio, ProfileEditPhoto} from './steps';

import NotFound404 from '../not-found-404';
import {NftContractContext} from "../../../contexts/nftContract";
import {NearContext} from "../../../contexts/near";
import {MarketContractContext} from "../../../contexts/marketContract";
import QUERY_KEYS from "../../../constants/queryKeys";

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
    const { user } = useContext(NearContext);
    const currentAccountId = user?.accountId ? user?.accountId : '';

    const {setProfile, getProfile } = useContext(NftContractContext);

    let {data: profileBio} = useQuery(QUERY_KEYS.GET_PROFILE, () => getProfile(currentAccountId));

    if(profileBio)
        console.log("BIO: " + profileBio);

    const match = useRouteMatch();

    const processSaveBio = async () => {
        await setProfile(profileBio);
        toast.success('Success! Your profile was saved!');
    };

    const processSavePhoto = () => {
        toast.success('Success! Your profile was saved!');
    };

    return (
        <Container>
            <Switch>
                <Route path={`${match.path}/upload-photo`}>
                    <ProfileEditPhoto processSave={processSavePhoto}/>
                </Route>
                <Route exact path={`${match.path}`}>
                    <ProfileEditBio uploadPhotoLink={`${match.path}/upload-photo`} processSave={processSaveBio} />
                </Route>
                <Page component={NotFound404}/>
            </Switch>
        </Container>
    );
}
