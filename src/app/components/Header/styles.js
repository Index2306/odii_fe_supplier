import styled from 'styled-components';

export const CustomHeader = styled.div`
  display: inline;
  background: #fff;
  height: 100%;
  padding: 0 16px;
  /* z-index: 1; */
  /* box-shadow: 0 1px 4px rgb(0 21 41 / 8%); */
  .ant-avatar {
    color: #fff;
    margin-left: 20px;
    background: purple;
  }
  .ant-badge:hover {
    cursor: pointer;
  }
  .ant-badge-count {
    background: #3d56a6;
    padding: 0 7px;
    .ant-scroll-number-only-unit {
      font-weight: bold;
    }
  }
`;

export const DivNotify = styled.div`
  min-width: 430px;
  .mb-8 {
    margin-bottom: 8px;
  }
  .mb-20 {
    margin-bottom: 20px;
  }
  .mb-28 {
    margin-bottom: 28px;
  }

  .top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 28px;
    padding: 0 24px;
  }

  .title {
    font-weight: 900;
    font-size: 18px;
    line-height: 21px;
  }
  .title-switch {
    color: #6c798f;
    font-size: 12px;
    line-height: 22px;
    margin-right: 6px;
  }
  .ant-switch {
    background: #6c798f;
    &-checked {
      background: #435ebe;
    }
  }
  .ant-switch-handle {
    top: 3px;
    width: 16px;
    height: 16px;
  }
  .ant-badge-count {
    background: #eb5757;
    min-width: 16px;
    height: 16px;
    font-size: 8px;
    line-height: 17px;
    .ant-scroll-number-only-unit {
      font-weight: bold;
    }
  }
  .ant-tabs-nav {
    padding: 0 24px;
  }
  .ant-tabs-tab {
    .ant-badge {
      color: #6c798f;
      font-weight: 500;
    }
  }
  .ant-tabs-tab-active {
    .ant-badge {
      color: #435ebe;
    }
  }
  .ant-tabs-tabpane-active {
    height: 78vh;
  }
  .notify-new {
    font-weight: bold;
  }
  .mark-as-read {
    font-weight: 500;
    color: #6c798f;
    cursor: pointer;
    &:hover {
      /* font-size: 16px; */
      color: #5483f3;
    }
  }
  .not-show-full {
    .item-notification:nth-child(n + 8) {
      display: none;
    }
  }

  .show-more {
    font-weight: bold;
    color: #7c8db5;
    cursor: pointer;
    position: absolute;
    bottom: 36px;
    margin-left: 28px;
    &:hover {
      /* font-size: 16px; */
      color: #5483f3;
    }
  }
  .loading {
    text-align: center;
    position: absolute;
    top: 340px;
    /* bottom: 0; */
    left: 0;
    right: 0;
    /* margin-top: 10px; */
  }
  .loading-show-more {
    text-align: center;
    position: absolute;
    bottom: 36px;
    left: 0;
    right: 0;
    /* margin-top: 10px; */
  }
  .action {
    display: flex;
    justify-content: space-between;
    padding: 0 24px;
  }
  .list-notification {
    height: 68vh;
    overflow-y: scroll;
    margin-top: 12px;

    .unread {
      background-color: #eaeffd;
    }
    .item-notification {
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      padding: 16px 24px;
      &:hover {
        background-color: #d0d5e3;
      }
      .avatar {
      }
      .hide {
        visibility: hidden;
        width: 9px;
      }
      .dot-unread {
        width: 9px;
        height: 9px;
        background: #435ebe;
        border-radius: 50%;
        margin-top: 16px;
      }
      .notify-img {
        width: 45px;
        height: 45px;
        border-radius: 4px;
        border: 1px solid #e6e6e9;
        text-align: center;
        .image {
          width: 100%;
          border-radius: 4px;
          height: 100%;
        }
        .bell {
          width: 18px;
          height: 20px;
          margin-top: 12px;
        }
      }
      .notify-content {
        width: 290px;
        text-align: start;
        line-height: 16px;
        .title {
          font-size: 14px;
          line-height: 14px;
        }
        .content {
          font-size: 12px;
          color: #828282;
          margin-top: 2px;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .txt-highline--green {
          color: #27ae60;
        }
        .txt-highline--red {
          color: red;
        }
      }
      .notify-time {
        font-size: 12px;
        color: #828282;
      }
      &:not(:first-child) {
        /* margin-top: 26px; */
      }
    }
  }
  .notify-empty {
    min-height: 100vh;
    height: 100vh;
    text-align: center;
    margin-top: 120px;
    .empty-title {
      margin-top: 6px;
      font-weight: bold;
      font-size: 18px;
      line-height: 21px;
    }
    .empty-desc {
      margin-top: 8px;
      font-size: 14px;
      line-height: 16px;
      color: #828282;
    }
  }
`;

export const WrapperBadge = styled.div`
  padding-right: 22px;
  margin-right: 22px;
  display: flex;
  height: 100%;
  align-items: center;
  border-right: 1px solid ${({ theme }) => theme.stroke};
  .ant-badge {
    width: 36px;
    height: 34px;
    color: ${({ theme }) => theme.grayBlue};
    font-size: 22px;
    text-align: center;
    .ant-badge-count {
      top: 2px;
      right: 6px;
    }
    &:hover {
      background-color: #dfe1e4;
      border-radius: 50%;
    }
  }
`;

export const WrapperUserInfo = styled.div`
  display: flex;
  background: #fff;
  cursor: pointer;
  justify-content: space-between;
  align-items: center;
  padding: 4px 5px 4px 11px;
  border-radius: 20px;
  > :first-child {
    display: flex;
    margin-right: 10px;
  }
  &:hover {
    background-color: #f0f1f3;
  }
  .default-image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    color: ${({ theme }) => theme.whitePrimary};
    background-color: ${({ theme }) => theme.grayBlue};
  }
  border: 1px solid ${({ theme }) => theme.stroke};

  .ant-image-img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
  }
`;

export const CustomDiv = styled.div`
  width: 156px;
  .ant-divider-horizontal {
    margin: 0;
  }

  .item {
    button {
      padding: unset;
      color: #3d56a6;
    }
    &:hover {
      background-color: #f0f1f3;
      border-radius: 4px;
      button {
        color: #2f458b;
      }
    }
    margin-top: 4px;
    margin-bottom: 4px;
    &:first-child {
      margin-top: 0px;
    }

    &:last-child {
      margin-bottom: 0px;
    }
    .item-icon {
      border-radius: 50%;
      width: 24px;
      height: 24px;
    }
  }
  .logout {
    button {
      color: #eb5757;
    }
    &:hover {
      button {
        color: red;
      }
    }
  }
`;
