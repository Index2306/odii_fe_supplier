import styled from 'styled-components';
import { Modal, Menu, Row, Col, Tabs } from 'antd';

export const CustomModalAddBank = styled(Modal)`
  .modal-header {
    margin-bottom: 34px;
    .title {
      font-weight: bold;
      font-size: 18px;
      line-height: 21px;
    }
    .desc {
    }
  }
  .ant-modal {
    &-content {
      min-width: 640px;
      border-radius: 6px;
    }
    &-body {
      padding: 35px 44px;
    }
  }
  .ant-form-item {
    &-label {
      margin-bottom: 6px;
      label {
        &::after {
          content: '';
        }
      }
      font-weight: 500;
      margin-bottom: $spacer/2;
    }
  }
  label.ant-form-item-required {
    height: unset;
    &::before {
      content: '' !important;
    }
    &::after {
      display: inline-block;
      margin-left: 4px;
      color: #ff4d4f;
      font-size: 18px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: '*';
    }
  }
  .ant-select-item-option-content {
    .logo-bank {
      margin-bottom: 6px;
      height: 30px;
      width: 60px;
    }
  }
  .logo-bank {
    img {
      height: 30px;
      width: 60px;
    }
    margin-bottom: 6px;
    height: 30px;
    width: 60px;
  }
`;
export const CustomModalWithdrawal = styled(Modal)`
  .hide {
    visibility: hidden;
  }
  .alert-err {
    margin-top: -22px;
    text-align: center;
    color: #ff4d4f;
  }
  .modal-withdrawal__header {
    margin-bottom: 34px;
    text-align: center;

    .title {
      font-weight: bold;
      font-size: 30px;
      line-height: 35px;
      color: #3d56a6;
      margin-bottom: 4px;
    }
    .desc {
      font-size: 14px;
      line-height: 22px;
      letter-spacing: 0.03em;
    }
  }
  .ant-modal {
    &-content {
      min-width: 540px;
      border-radius: 6px;
    }
    &-body {
      padding: 30px 44px 40px;
    }
  }
  .withdrawal-done {
    &__header {
      text-align: center;
      margin-bottom: 22px;
      .logo {
        margin-bottom: 14px;
      }
      .title {
        font-weight: bold;
        font-size: 22px;
        line-height: 26px;
        text-align: center;
        color: #50bf4e;
        margin-bottom: 6px;
      }
      .desc {
      }
    }
    &__info {
      padding: 16px 22px 20px;
      background: #ffffff;
      border: 1px solid #ebebf0;
      box-sizing: border-box;
      box-shadow: 0px 4px 10px rgba(30, 70, 117, 0.05);
      border-radius: 4px;
      margin-bottom: 20px;
      .item {
        display: flex;
        justify-content: space-between;
        line-height: 30px;
        .label {
          color: #828282;
        }
        &-amount {
          color: #50bf4e;
        }
      }
    }
  }
`;

export const CustomUl = styled.ul`
  display: flex;
  flex-wrap: wrap;
  li {
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    list-style: none;
    padding: 9px 13px;
    background: #f7f7f9;
    border: 1px solid #ebebf0;
    box-sizing: border-box;
    border-radius: 6px;
    min-width: 102px;
    margin-right: 13px;
    margin-bottom: 14px;
    &:nth-child(4) {
      margin-right: 0px;
    }
    &.selected {
      color: #3d56a6;
      border: 1px solid #3d56a6;
      cursor: pointer;
    }
    &:hover {
      color: #3d56a6;
      border: 1px solid #3d56a6;
      cursor: pointer;
    }
    &:active {
      color: #3d56a6;
      border: 1px solid #3d56a6;
      cursor: pointer;
    }
  }
  input {
    /* max-width: 203px; */
    height: 36px;
    /* border: 1px solid #ebebf0;
    border-radius: 6px; */
    &::placeholder {
      color: #828282;
    }
  }
`;

export const CustomMenu = styled(Menu)`
  width: 204px;
  border-radius: 8px;
  .options-suggest {
    display: flex;
    flex-wrap: wrap;
    padding: 6px 36px 6px 12px;
  }
  .option-suggest {
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    padding: 4px 12px;
    background: #f7f7f9;
    border: 1px solid #ebebf0;
    box-sizing: border-box;
    border-radius: 6px;
    &:not(:first-child) {
      margin-top: 8px;
    }
    &.selected {
      color: #3d56a6;
      border: 1px solid #3d56a6;
      cursor: pointer;
    }
    &:hover {
      color: #3d56a6;
      border: 1px solid #3d56a6;
      cursor: pointer;
    }
    &:active {
      color: #3d56a6;
      border: 1px solid #3d56a6;
      cursor: pointer;
    }
  }
`;

export const CustomBank = styled(Row)`
  width: 100%;
  height: 85px;
  display: flex;
  /* justify-content: space-between; */
  border: 1px solid #ebebf0;
  box-sizing: border-box;
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 20px;
  .minwidth {
    min-width: 380px;
  }
  .ml {
    margin-left: auto;
  }
  & .bank-logo {
    width: 70px;
    height: 45px;
    margin-right: 14px;
    padding: 4px;
    text-align: center;
    border: 1px solid #ebebf0;
    box-sizing: border-box;
    border-radius: 6px;
    .logo {
      height: 100%;
      border-radius: 6px;
    }
  }
  .bank-title,
  .bank-account__name {
    font-weight: 500;
    font-size: 14px;
    color: #333333;
  }
  .bank-sub_title,
  .bank-account__number {
    font-weight: 500;
    font-size: 12px;
    color: #828282;
  }
`;

export const CustomTabs = styled(Tabs)`
  .number-circle {
    width: 24px;
    height: 22px;
    font-weight: 600;
    font-size: 12px;
    line-height: 15px;
    display: flex;
    align-items: center;
    text-align: center;
    border-radius: 50%;
    color: #3d56a6;
    border: 1px solid #3d56a6;
    margin-right: 6px;
    padding: 7px;
    &.disabled {
      color: #828282;
      border: 1px solid #828282;
    }
    &.done {
      color: white;
      background: #3d56a6;
    }
  }
  .ant-tabs-nav {
    margin-bottom: 27px;
    &-wrap {
      border-radius: 6px;
      border: 1px solid #ebebf0;
    }
    &-list {
      width: 100%;
    }
  }
  .ant-tabs-ink-bar-animated {
    display: none;
  }
  .ant-tabs-tab {
    width: 50%;
    text-align: center;
    box-sizing: border-box;
    margin: 0;
    color: #29418e !important;
    &:first-child {
      border-right: 1px solid #ebebf0;
    }
    &-btn {
      margin: auto;
      font-weight: 500;
    }
    &.ant-tabs-tab-active {
      .ant-tabs-tab-btn {
        color: #29418e !important;
      }
    }
    &-disabled {
      color: #828282 !important;
      background: #f7f7f9;
    }
  }
  .title-confirm {
    color: #000000;
    font-weight: 500;
    font-size: 14px;
    margin-top: 11px;
    margin-bottom: 13px;
  }
  .right {
    .amount-title {
      font-size: 12px;
    }
    .amount {
      font-weight: bold;
      font-size: 16px;
      line-height: 19px;
      color: #f2994a;
    }
  }
  .CustomBankConfirm {
    box-shadow: 0px 4px 10px rgba(30, 70, 117, 0.15);
    border: none;
    margin-bottom: 28px;
  }
  .info-bank {
    margin-bottom: 20px;
    .title {
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      margin-bottom: 10px;
    }
    .bank {
      display: flex;
      justify-content: space-between;
      height: 40px;
      font-size: 14px;
      line-height: 16px;
      background: #f7f7f9;
      border: 1px solid #ebebf0;
      box-sizing: border-box;
      border-radius: 4px;
      color: #333333;

      &-number {
        .content {
          color: #828282;
          padding: 12px;
        }
      }
      &-text {
        .content {
          padding: 12px;
          color: #333333;
        }
      }
    }
  }
  .note {
    .title {
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      margin-bottom: 10px;
    }
    .bank {
      display: flex;
      justify-content: space-between;
      height: 40px;
      font-size: 14px;
      line-height: 16px;
      background: #f7f7f9;
      border: 1px solid #ebebf0;
      box-sizing: border-box;
      border-radius: 4px;
      color: #333333;
      &-text {
        margin-bottom: 6px;
        .content {
          color: #333333;
          padding: 12px;
        }
      }
    }
  }

  .btn-copy {
    width: 40px;
    background: white;
    padding: 12px;
    border-radius: 0px 4px 4px 0px;
    outline: none;
    border: none;
    border-left: 1px solid #ebebf0;
    :hover {
      cursor: pointer;
    }
    .anticon-copy {
      vertical-align: 0;
    }
  }
`;
