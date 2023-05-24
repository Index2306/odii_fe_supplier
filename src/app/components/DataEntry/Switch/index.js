import styled from 'styled-components/macro';
import { Switch as S } from 'antd';
import { withFormContext } from '../Form/withFormContext';

export default withFormContext(styled(S)`
  &.ant-switch-checked {
    background-color: ${({ theme }) => theme.primary};
  }
`);
