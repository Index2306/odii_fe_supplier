/**
 *
 * Select
 *
 */
import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { Select as S } from 'antd';
import { withFormContext } from '../Form/withFormContext';

const CustomSelect = styled(S)`
  width: 100%;
  color: ${({ theme, color }) => theme[color] || theme.text};
  .ant-select-selector {
    border-color: ${({ theme }) => theme.stroke} !important;
    /* box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05); */
    border-radius: 4px !important;
  }
`;

const Select = withFormContext(
  memo(props => {
    return <CustomSelect size="large" {...props} />;
  }),
);
Object.keys(S).map(key => (Select[key] = S[key]));
export default Select;
