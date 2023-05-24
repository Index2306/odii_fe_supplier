import styled from 'styled-components/macro';

export const P = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  color: ${p => p.theme.textSecondary};
  margin: 0.625rem 0 1.5rem 0;
`;

export const SubTitle = styled.h3`
  font-size: 1.25rem;
  margin: 0;
  color: ${p => p.theme.text};
`;

export const Title = styled.h2`
  font-size: 32px;
  font-weight: bold;
  color: ${p => p.theme.text};
  margin: 1rem 0;
`;
