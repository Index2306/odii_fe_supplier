import styled from 'styled-components/macro';
import { Radio as R } from 'antd';
import { withFormContext } from '../Form/withFormContext';

const Radio = withFormContext(styled(R)`
  .ant-radio-checked {
    .ant-radio-inner {
      border-color: ${({ theme }) => theme.primary};
      &::after {
        background-color: ${({ theme }) => theme.primary};
      }
    }
    &::after {
      border-color: ${({ theme }) => theme.primary};
    }
  }
`);

Object.keys(R).map(key => (Radio[key] = R[key]));
export default Radio;
