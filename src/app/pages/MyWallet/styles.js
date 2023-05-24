import styled from 'styled-components';
import { Modal, Menu, Row, Tabs } from 'antd';
import { SectionWrapper } from 'styles/commons';

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
  .text-bold {
    font-weight: 500;
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
          color: #2f80ed;
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

export const CustomBelanceAvailable = styled.div`
  width: 100%;
  height: 85px;
  display: flex;
  border: 1px solid #ebebf0;
  box-sizing: border-box;
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 20px;
  .box-icon {
    width: 45px;
    height: 45px;
    margin-right: 14px;
    padding: 4px;
    text-align: center;
    border: 1px solid #ebebf0;
    box-sizing: border-box;
    border-radius: 6px;
    img {
      width: 24px;
      height: 24px;
      margin-top: 6px;
      border-radius: 2px;
    }
  }
  .title {
    font-size: 14px;
    line-height: 16px;
    color: #6c798f;
    margin-bottom: 8px;
  }
  .belance {
    font-weight: 900;
    font-size: 20px;
    line-height: 23px;
    display: flex;
    align-items: center;
    letter-spacing: 0.02em;
    color: #3d56a6;
  }
`;

export const CustomBank = styled(Row)`
  width: 100%;
  min-height: 85px;
  border: 1px solid #ebebf0;
  box-sizing: border-box;
  border-radius: 6px;
  padding: 20px 20px 20px 12px;
  margin-bottom: 20px;
  .info-bank {
    min-width: 440px;
    display: flex;
  }
  .bank-default {
    margin-left: 12px;

    background: #e3dede;
    border-radius: 8px;
    padding: 0 8px;

    height: max-content;
    font-weight: 500;
    font-size: 12px;
    line-height: 20px;
    color: gray;
  }
  .set-bank-default {
    margin-left: 12px;

    font-weight: 500;
    font-size: 12px;
    line-height: 20px;
    color: #2f80ed;
    text-decoration: underline;
    cursor: pointer;
  }
  .ml {
    margin-left: auto;
  }
  .mt-6 {
    margin-top: 6px !important;
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
      width: 100%;
      /* height: auto; */
      height: 32px;
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
  .bank-title:hover {
    text-decoration: underline;
    color: #1890ff;
    cursor: pointer;
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
    padding: 9px 8px 8px;
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
    .guide {
      margin-top: 16px;
      /* color: red; */
      .bold {
        font-weight: 500;
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

export const SectionWrapperHistoryTransaction = styled(SectionWrapper)`
  min-height: 630px;
  p {
    margin-top: 14px;
  }
  .hide {
    visibility: hidden;
  }
  .action-wrapper {
    display: none;
    position: absolute;
    padding: 0;
    top: 50%;
    right: 0px;
    transform: translateY(-50%);
    white-space: nowrap;
    word-break: keep-all;
    > div {
      display: inline-flex;
      > button {
        margin-left: 11px;
      }
    }
    .btn-cancel {
      background: #fff;
      &:hover {
        color: #fff;
        background: red;
      }
    }
  }
  tr:hover {
    .action-wrapper {
      display: inline-flex;
    }
  }
`;

export const SectionWrapperOverViewMyWallet = styled(SectionWrapper)`
  padding: 0;
  .mb-8 {
    margin-bottom: 8px;
  }
  .hide {
    visibility: hidden;
  }
  .section-balance__available {
    padding: 18px 25px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ebebf0;
    .left {
      display: flex;
      .box-icon {
        width: 50px;
        height: 50px;
        padding: 14px;
        background: #ffffff;
        border: 1px solid #ebebf0;
        border-radius: 10px;
        margin-right: 12px;
        img {
          width: 20px;
          height: 20px;
        }
      }
      .text {
        font-size: 14px;
        line-height: 16px;
        color: #6c798f;
      }
      .belance {
        font-weight: 900;
        font-size: 20px;
        line-height: 23px;
        display: flex;
        align-items: center;
        letter-spacing: 0.02em;
        color: #3d56a6;
      }
    }
    .right {
      display: flex;
      align-items: center;
      button {
        min-width: 132px;
        font-weight: bold !important;
        color: #4f5a73;
        background-color: #ced7eb;
        border: none;
        &:first-child {
          margin-right: 20px;
        }
        .anticon {
          margin-right: 6px;
        }
      }
    }
  }
  .section-balance__history {
    padding: 30px 25px;
    border-bottom: 1px solid #ebebf0;
    .box-icon {
      width: 50px;
      height: 50px;
      padding: 14px;
      background: #ffffff;
      border: 1px solid #ebebf0;
      border-radius: 10px;
      margin-right: 12px;
      img {
        width: 20px;
        height: 20px;
      }
    }
  }
  .section-balance__bank {
    .empty-bank {
      padding: 18px 25px;
      display: flex;
      justify-content: center;
    }
    .item-bank {
      display: flex;
      justify-content: space-between;
      padding: 18px 25px;
      .action {
        display: flex;
        .btn-detail-bank {
          align-self: center;
          &:first-child {
            margin-right: 8px;
          }
        }
        img {
          width: 16px;
          height: 16px;
          align-self: center;
          &:hover {
            cursor: pointer;
          }
        }
      }
      .bank-logo {
        width: 75px;
        height: 45px;
        background: #ffffff;
        padding: 4px;
        border: 1px solid #ebebf0;
        border-radius: 6px;
        margin-right: 12px;
        img {
          width: 100%;
          height: 32px;
          border-radius: 6px;
        }
      }
      .bank-account__number {
        font-weight: 500;
        line-height: 18px;
        margin-top: 4px;
        margin-bottom: 2px;
        letter-spacing: 1px;
      }
      .verified {
        font-weight: 500;
        font-size: 12px;
        line-height: 18px;
        color: #27ae60;
        height: fit-content;
        margin-top: 3px;
      }
      .bank-default {
        margin-top: 3px;
        margin-left: 12px;
        height: fit-content;
        background: #e3dede;
        border-radius: 8px;
        padding: 0 8px;

        font-weight: 500;
        font-size: 12px;
        line-height: 18px;
        color: gray;
      }
      .bank-title {
        font-weight: 500;
        font-size: 12px;
        line-height: 18px;
        color: #828282;
      }
    }
  }
`;
