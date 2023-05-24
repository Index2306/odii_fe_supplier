/**
 *
 * Select
 *
 */
import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { DatePicker as D } from 'antd';
import { withFormContext } from '../Form/withFormContext';

const DatePicker = withFormContext(
  memo(props => {
    return <D size="large" {...props} />;
  }),
);
Object.keys(D).map(
  key =>
    (DatePicker[key] = styled(D[key])`
      width: 100%;
      border-color: ${({ theme }) => theme.stroke} !important;
      /* box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05); */
      border-radius: 4px !important;
      .ant-picker-input > input {
        color: ${({ theme, color }) => theme[color] || theme.text};
        &::placeholder {
          color: ${({ theme, color }) => theme[color] || theme.text};
          opacity: 1;
        }
      }
    `),
);
export default DatePicker;
