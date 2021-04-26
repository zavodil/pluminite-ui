import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const Container = styled('div')`
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

export default function Navigation() {
    return (
        <Container>
            <div className='left'>
                Pluminite
            </div>
            <div className='right'>
                <Link to='/sign-up' className='button'>Publish Art</Link>
                <Link to='/sign-up' className='button'>Buy Art</Link>
            </div>
        </Container>
    )
}