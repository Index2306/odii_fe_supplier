import styled from 'styled-components/macro';
import { InputNumber } from 'app/components';
import { SectionWrapper } from 'styles/commons';
import { styledSystem } from 'styles/theme/utils';

export const CustomSectionWrapper = styledSystem(styled(SectionWrapper)`
  width: 100%;
  padding: 16px 20px 10px;
  box-shadow: 0px 4px 10px rgba(30, 70, 117, 0.05);
  border-radius: 4px;
  .title {
    color: #000;
    font-weight: 500;
    font-size: 14px;
    margin-bottom: 1rem;
  }
  .title-head {
    color: #000;
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 1rem;
    display: inline-block;
  }
  .total_quantity_info {
    display: inline-block;
    border: 1px solid #e8f8ee;
    background-color: #e8f8ee;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    font-weight: 500;
    color: #027a48;
    border-radius: 16px;
    margin-left: 20px;
    font-style: normal;
    font-family: 'Roboto', sans-serif;
    padding: 2px 8px;
  }
  input,
  .ant-tag,
  .ant-select-selector {
    border-radius: 4px;
  }
  label {
    font-weight: 500;
  }
`);

export const WrapperCheckbox = styledSystem(styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 16px;
  margin-bottom: 18px;
  border-bottom: 1px solid
    ${({ theme, showBorder }) => (showBorder ? theme.stroke : 'transparent')};
`);
