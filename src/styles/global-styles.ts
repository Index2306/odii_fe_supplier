import { createGlobalStyle } from 'styled-components';
import { StyleConstants } from './StyleConstants';
/* istanbul ignore next */
export const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
    line-height: 1.5;
  }

  ::-webkit-scrollbar{
    width: 6px;
    height: 6px;
    background-color: #fff;
  }
  ::-webkit-scrollbar-track {
    background-color: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background-color: rgba(115, 183, 242, 0.3);
    border-radius: 5px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #3999ec;
    cursor: pointer;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    /* padding-top: ${StyleConstants.headerHeight}; */
    /* background-color: ${p => p.theme.background}; */
    color: ${p => p.theme.text};
  }

  body.fontLoaded {
    font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
  
  p,
  label {
    line-height: 1.5em;
  }

  input, select, button {
    font-family: inherit;
    font-size: inherit;
  }
  .odii-input {
    font-size: 14px;
    line-height: 22 / 14;
    padding: 8px 12px;
    border-radius: 4px;
    border: solid 1px #EBEBF0;
    .ant-input {
      &-prefix,
      &-suffix {
        height: 22px;
        width: 22px;
        justify-content: center;
        color: #6C798F;
      }}
  }
  .text-white {
    color: #fff !important;
  }
  .text-primary {
    color: ${p => p.theme.primary} !important;
  }
  .text-secondary {
    color: ${p => p.theme.textSecondary} !important;
  }
  .text-blue1 {
    color: ${p => p.theme.darkBlue1} !important;
  }

  .text-center {
    text-align: center !important;
  }

  .icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  .pointer {
    cursor: pointer !important;
  }

  /* .m-0 {
    margin: 0 !important;
  } */
  .w-100 {
    width: 100% !important;
  }
  .h-100 {
    height: 100% !important;
  }
  .popover-notify--global {
    top: 64px !important;
    position: fixed;
    padding-top: 0px !important;
    .ant-popover-arrow {
       visibility: hidden;
    }
    .ant-popover-placement-bottom, .ant-popover-placement-bottomLeft, .ant-popover-placement-bottomRight {
      padding-top: 0px !important;
    }
    .ant-popover-inner-content {
       /* padding: 21px 25px; */
       padding: 21px 0;
       max-height: 1000px;
    }
  }
  .popover-action--global {
    position: fixed;
    padding-top: 9px !important;
    .ant-popover-inner {
      border-radius: 4px;
    }
    .ant-popover-inner-content {
      padding: 4px 4px;
    }
    .anticon {
      vertical-align: 0;
      margin-top: 8px;
      margin-right: 2px;
    }
  }

  //print
  @media all {
    .print-preview-page {
      display: none;
    }
  }
  @media print {
    .print-preview-wrapper {
      .print-preview-page {
        width: 100%;
        page-break-after: always;
        &.print-preview--top {
          margin-top: 1rem;
          display: block;
        }
        &.print-preview--center {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
      }
    }
  }
  //end print
`;
