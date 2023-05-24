/**
 *
 * Select
 *
 */
import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { Tabs as T } from 'antd';
import { withFormContext } from '../DataEntry/Form/withFormContext';

const CustomTabs = styled(T)`
  .ant-tabs-nav::before {
    border-color: ${({ theme }) => theme.gray4};
  }
  .ant-tabs-ink-bar {
    background: ${({ theme }) => theme.primary};
    height: 4px !important;
    border-radius: 4px 4px 0 0;
  }
  .ant-tabs-tab {
    color: ${({ theme }) => theme.grayBlue};
    &.ant-tabs-tab-active {
      .ant-tabs-tab-btn {
        color: ${({ theme }) => theme.primary};
      }
    }
  }
`;
const Tabs = withFormContext(
  memo(props => {
    return <CustomTabs {...props} />;
  }),
);
Object.keys(T).map(key => (Tabs[key] = styled(T[key])``));
export default Tabs;
