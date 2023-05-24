/**
 *
 * Input
 *
 */
import React, { memo } from 'react';
import { InputNumber as I } from 'antd';
import { formatInputMoney } from 'utils/helpers';
import styled from 'styled-components/macro';
import { withFormContext } from '../Form/withFormContext';

const CustomInput = styled(I)`
  width: 100% !important;
  border-color: ${({ theme }) => theme.stroke};
  border-radius: 4px;
  .ant-input-number-handler-wrap {
    display: none;
  }
  /* height: 40px; */
`;
const InputNumber = withFormContext(
  memo(props => {
    return <CustomInput {...props} />;
  }),
);

export const InputMoney = props => {
  return (
    <InputNumber
      formatter={value => {
        return formatInputMoney(value);
      }}
      // stringMode
      decimalSeparator=","
      parser={value => {
        return value.replace(/(\.)/g, '');
      }}
      {...props}
    />
  );
};

Object.assign(InputNumber, I);
export default InputNumber;
