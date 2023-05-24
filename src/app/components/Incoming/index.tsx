import * as React from 'react';
import styled from 'styled-components/macro';
import { incoming } from 'assets/images';
import {} from 'styles/commons';
import { Helmet } from 'react-helmet-async';

export function Incoming() {
  return (
    <>
      <Helmet>
        <title>Page Coming Soon</title>
        <meta name="description" content="Page Coming Soon" />
      </Helmet>
      <Wrapper>
        <Title>{/* <img src={incoming} alt="" /> */}</Title>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Title = styled.div`
  margin-top: -8vh;
  font-weight: bold;
  color: black;
  font-size: 3.375rem;
  width: 400px;
  height: 420px;
  background: no-repeat url(${incoming});
  background-size: cover;
  background-position: center;
  span {
    font-size: 3.125rem;
  }
`;
