import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link, useRouteMatch } from 'react-router-dom';

import { NearContext } from '../contexts';

const Container = styled('div')`
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30px;

    .left {
        font-size: 30px;
        font-weight: 300;
    }

    .button {
        :first-of-type {
            margin-right: 20px;
        }
    }

    .connect-query {
        margin-right: 40px;
        color: var(--lavendar);
        font-size: 18px;
        text-decoration: none;
    }

    .button-connect {
        padding: 16px 20px;
        border: var(--lavendar) 1px solid;
        background-color: var(--plum);
        color: var(--lavendar);
    }
    
    .account-id {
        cursor: pointer;
    }

    @media (max-width: 767px) {
        padding: 0 15px;
        height: 62px;

        .left {
            font-size: 24px
        }

        .right {
            .button {
                font-size: 13px;

                :first-of-type {
                    margin-right: 10px;
                }
            }
        }
    }
`

export default function Navigation () {
    const { nearContent, user, signIn, signOut } = useContext(NearContext);

    const signInAction = () => {
        signIn();
    };

    const signOutAction = () => {
        signOut();
    };

    const isSignUpPage = !!useRouteMatch("/sign-up");

    return (
        <Container>
            <div className='left'>
                Pluminite
            </div>
            <div className='right'>
                {user
                    ? (<span className='account-id'>Hi, {user.accountId} :)</span>)
                    : isSignUpPage
                        ? (<>
                            <span className='connect-query'>Already have a NEAR account?</span>
                            <button className='button button-connect' onClick={signInAction}>Connect Wallet</button>
                        </>)
                        : (<>
                            <Link to='/sign-up' className='button'>Publish Art</Link>
                            <Link to='/sign-up' className='button'>Buy Art</Link>
                        </>)
                }
            </div>
        </Container>
    )
}
