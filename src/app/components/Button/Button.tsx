/**
 *
 * Button
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
import { Button as B } from 'antd';
import { withFormContext } from '../DataEntry/Form/withFormContext';

interface Props {
  className?: string;
  onChange?: (e: any) => void;
  children?: React.ReactNode;
  htmlType?: any;
  // type?: React.ElementType | keyof JSX.IntrinsicElements;
  type?: any;
}

const Button = (props: Props) => {
  return <CustomButton {...props} />;
};

const CustomButton = styled(B)``;
export default withFormContext(Button);
