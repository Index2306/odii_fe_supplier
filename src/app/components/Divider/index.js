import styled from 'styled-components/macro';
import { styledSystem } from 'styles/theme/utils';
import { Divider } from 'antd';

export default styledSystem(styled(Divider)`
  border-top-color: ${({ theme }) => theme.stroke};
`);
