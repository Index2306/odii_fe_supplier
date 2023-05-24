import styled from 'styled-components/macro';
import { Checkbox } from 'antd';

export const CustomCheckbox = styled(Checkbox)`
  .ant-checkbox-checked {
    .ant-checkbox-inner {
      background-color: ${({ theme }) => theme.primary};
      border-color: ${({ theme }) => theme.primary};
    }
  }
`;

export const CustomCheckboxGroup = styled(Checkbox.Group)`
  .ant-checkbox-checked {
    .ant-checkbox-inner {
      background-color: ${({ theme }) => theme.primary};
      border-color: ${({ theme }) => theme.primary};
    }
  }
`;
