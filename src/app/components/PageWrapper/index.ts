import styled from 'styled-components/macro';
import { StyleConstants } from 'styles/StyleConstants';

export const PageWrapper = styled.div`
  max-width: ${({ fixWidth }: any) =>
    fixWidth ? `${StyleConstants.bodyWidth}px` : '1600px'};
  margin: 1.5rem auto 2.5rem;
  /* background-color: ${p => p.theme.background}; */
  padding: 0 1.5rem;
  box-sizing: content-box;

  .custom-table-box {
    padding: 0;
    border: none;

    .title {
      padding: 0px 20px 0;
      margin-bottom: 0 !important;
      padding-bottom: 16px;
    }

    .noTab {
      padding: 20px 20px 0;
      margin-bottom: 0 !important;
      padding-bottom: 16px;
    }

    .ant-table-tbody > tr.ant-table-row:hover > td {
      background: #fff;
    }
  }
`;

export default PageWrapper;
