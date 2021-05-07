import React, { useContext } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';

import { NearContext } from '../contexts';

import Dropdown from './common/Dropdown';

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

    .account-display {
        color: var(--bubble-gum);
    }

    .account-display-id {
        text-decoration: underline;
    }
    
    .nav__link--dropdown {
        display: block;
        padding: 10px;
        color: var(--lavendar);
        text-decoration: none;
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

const AccountDisplay = ({ text, handleOnClick, className }) =>
    (
        <span className={`account-display ${className}`} onClick={handleOnClick}>
            Hi, <span className='account-display-id'>{text}</span> :)
        </span>
    );

export default function Navigation () {
    const { user, signIn, signOut } = useContext(NearContext);

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
                    ? (<Dropdown dropdownBase={AccountDisplay} title={`${user.accountId}`} stretchable>
                        <Link className='nav__link nav__link--dropdown' to='#' onClick={() => signOutAction()}>
                            Log out
                        </Link>
                    </Dropdown>)
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
