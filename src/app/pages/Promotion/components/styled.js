import styled from 'styled-components/macro';
import { InputNumber } from 'app/components';
import { SectionWrapper } from 'styles/commons';
import { styledSystem } from 'styles/theme/utils';

export const CustomSectionWrapper = styledSystem(styled(SectionWrapper)`
  width: 100%;
  padding: 16px 20px;
  box-shadow: 0px 4px 10px rgba(30, 70, 117, 0.05);
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
    border-radius: 4px;
  }
  label {
    font-weight: 500;
  }
  .action-wrapper {
    display: none;
    position: absolute;
    padding: 0;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    white-space: nowrap;
    word-break: keep-all;
    > div {
      display: inline-flex;
      > button {
        margin-left: 11px;
      }
    }
    button {
      margin: auto;
    }
  }
  tr:hover {
    .action-wrapper {
      display: inline-flex;
    }
  }
`);

export const WrapperCheckbox = styledSystem(styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid
    ${({ theme, showBorder }) => (showBorder ? theme.stroke : 'transparent')};
`);
