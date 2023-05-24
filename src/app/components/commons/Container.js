import React from 'react';
import styled from 'styled-components/macro';

export default function Container({ children }) {
  return <ContainerWrapper>{children}</ContainerWrapper>;
}

const ContainerWrapper = styled.div`
  width: 999px;
  margin: 0 auto;

  @media screen and (min-width: 1600px) {
    width: 1257px;
  }
`;
