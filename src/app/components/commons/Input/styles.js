import styled from 'styled-components/macro';
import { Input } from 'antd';

const CustomInput = styled(Input)`
  padding: ${({ theme }) => theme.space.s4 / 1.5}px
    ${({ theme }) => theme.space.s4}px;
  border-radius: ${({ theme }) => theme.radius}px;
`;

export default CustomInput;
