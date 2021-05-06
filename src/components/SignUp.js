import React from 'react';
import styled from 'styled-components';

import bgSignup from '../assets/bg-signup.png';

const Container = styled('div')`
    height: 100%;
  
    background: url(${bgSignup}) no-repeat bottom left fixed;
`

export default function SignUp () {
    return (
        <Container>
            <div>
                Choose Username
            </div>
            <form>

            </form>
            <div>
                This username will be your account name across the NEAR network, provided it gets funded from a sale. Choose carefully. :)
            </div>
            <button>
                Create Guest Account
            </button>
        </Container>
    )
}
