import styled from 'styled-components/macro';
import { bgWarehousing } from 'assets/images';
import { CustomStyle, SectionWrapper } from 'styles/commons';
import { InputNumber } from 'antd';
import { styledSystem } from 'styles/theme/utils';

export const CustomSectionWrapper = styledSystem(styled(SectionWrapper)`
  padding: 16px;
  padding-bottom: 0;
  border-radius: 4px;
  .title {
    color: #000;
    font-weight: 500;
    font-size: 14px;
    margin-bottom: 1rem;
  }
  input,
  .ant-tag,
  .ant-select-selector {
    border-radius: 2px;
  }
  label {
    font-weight: 500;
  }
`);

export const CustomInputNumber = styled(InputNumber)`
  width: 100% !important;
  height: 40px;
  padding: 4px 0px;
  border-color: #ebebf0;
  color: #333333;
  .ant-input-number-handler-wrap {
    display: none;
  }
`;

export const IncludeImage = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-image: url(${bgWarehousing});
  border-radius: 4px 0px 0px 4px;
  background-size: cover;
  border: 1px solid #e6e6e9;
  border-right: none;
  background-repeat: no-repeat;
  padding: ${({ theme }) => theme.space.s5}px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  .ant-image-img {
    margin-bottom: 12px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
`;

export const RightBox = styled(CustomStyle)`
  height: 100%;
  background: ${({ theme }) => theme.whitePrimary};
  border-radius: 0px 4px 4px 0px;
  border: 1px solid #e6e6e9;
  padding: ${({ theme }) => theme.space.s6}px ${({ theme }) => theme.space.s7}px;
`;
