/**
 *
 * Form
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { Form as F } from 'antd';
import { FormContext } from './context';

interface Props {
  name?: string;
  className?: string;
  initialValues: object;
  form?: any;
  onFinish?: (v: any) => void;
  children?: JSX.Element | JSX.Element[];
}
export const Form = (props: Props) => {
  return <CustomForm {...props} />;
};

const FormWithContext = ({ disabled, ...rest }) => {
  return (
    <FormContext.Provider value={{ disabled: !!disabled }}>
      <F {...rest} />
    </FormContext.Provider>
  );
};
Object.keys(F).map(key => (FormWithContext[key] = F[key]));
const CustomForm = styled(FormWithContext)``;
export default CustomForm;
