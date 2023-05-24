import React, { useContext } from 'react';
import { FormContext } from './context';

export function withFormContext(component) {
  const Component = component;
  return function _Component(props) {
    const { disabled: isDisabled } = useContext(FormContext);
    return <Component disabled={!!isDisabled} {...props} />;
  };
}
