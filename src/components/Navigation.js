import React from 'react'
import styled from 'styled-components'
import { Link, useRouteMatch } from 'react-router-dom'

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
    const isSignUpPage = !!useRouteMatch("/sign-up");

    return (
        <Container>
            <div className='left'>
                Pluminite
            </div>
            <div className='right'>
                {isSignUpPage ? (<>
                    <span className='connect-query'>Already have a NEAR account?</span>
                    <Link to='/sign-up' className='button button-connect'>Connect Wallet</Link>
                </>) : (<>
                    <Link to='/sign-up' className='button'>Publish Art</Link>
                    <Link to='/sign-up' className='button'>Buy Art</Link>
                </>)}
            </div>
        </Container>
    )
}
