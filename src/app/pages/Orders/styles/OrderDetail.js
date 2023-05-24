import { Row } from 'antd';
import styled from 'styled-components/macro';
import { SectionWrapper } from 'styles/commons';
import { PageWrapper } from 'app/components';

function wrapBasic(wrapper) {
  return styled(wrapper)`
    .px-default {
      padding-left: 22px;
      padding-right: 22px;
    }
    .box-df {
      box-shadow: 0px 4px 10px rgba(30, 70, 117, 0.05);
    }
    .font-df {
      font-size: 14px;
    }
    .font-xs {
      font-size: 12px;
    }
    .font-sm {
      font-size: 16px;
    }
    .font-md {
      font-size: 18px;
    }
    .font-lg {
      font-size: 20px;
    }
    .border-df {
      border: 1px solid #ebebf0;
    }
    .section-title {
      font-weight: bold;
      font-size: 18px;
    }
    .value-empty {
      color: #ccc !important;
    }
  `;
}

export const PageWrapperDefault = styled(wrapBasic(PageWrapper))`
  width: 1000px;
  margin: 0 auto 21px auto;
  position: relative;
  .page-detail-title {
    margin-bottom: 16px;
    font-weight: bold;
  }

  .ant-tabs-nav {
    background: #ffffff;
    margin-bottom: 0px;
    padding: 0 20px;
    border: 1px solid #e6e6e9;
    border-radius: 4px;

    .ant-tabs-tab-btn:hover {
      color: #3d56a6;
    }

    .ant-tabs-tab-active {
      .ant-tabs-tab-btn {
        color: #3d56a6;
        text-shadow: 0 0 0.25px currentColor;
      }
    }

    .ant-tabs-ink-bar {
      background: #3d56a6;
    }
  }
  .button-qr {
    position: absolute;
    right: 28px;
    top: 4px;
  }
  .input-qr {
    position: absolute;
    right: 28px;
    top: 4px;
    outline: none;

    &:hover {
      input {
        border-color: #40a9ff !important;
        border-right-width: 1px !important;
        z-index: 1;
      }
    }

    &:focus-visible {
      input {
        outline: none !important;
      }
    }

    input {
      width: 200px;
      border-radius: 4px;
      border: 1px solid #8c8c8c;
      color: #7c8db5;
      height: 39px;
      outline: none;
    }
  }
`;

export const GeneralStatisticWrapper = styled(Row)`
  display: flex;
  .status-payment {
    padding: 0;
    width: auto;
    position: absolute;
    top: 17px;
    right: 20px;
  }
  .statistic-item {
    display: flex;
    border: 1px solid #ebebf0;
    position: relative;
  }
  & > :last-child .item-info__value {
    color: #65a1c3;
  }
  .statistic-item__icon {
    display: inline-flex;
    width: 50px;
    height: 50px;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
  }
  .statistic-item__info {
    margin-left: 12px;
    .item-info__title {
      color: ${({ theme }) => theme.gray3};
    }
  }
  .item-info__value {
    font-weight: 900;
    line-height: 1;
    margin-top: 4px;
    letter-spacing: 0.02em;
    .info-value__unit {
      font-size: 14px;
    }
  }
`;

export const ListOrderItemWrapper = styled(SectionWrapper)`
  padding: ${({ loading }) => (loading ? null : 0)};
  .top-title {
    display: flex;
    justify-content: space-between;
    height: 60px;
    align-items: center;
    .status-fulfill {
      padding: 0;
      width: auto;
    }
    .top-title__right {
      color: ${({ theme }) => theme.gray3};
      & > span:nth-child(2) {
        font-style: italic;
      }
    }
  }
  .content-items {
    border-left: 0;
    border-right: 0;
    border-bottom: 0;
    .order-thumbnail {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 4px;
      flex-grow: 1;
      flex-shrink: 0;
    }
  }
  .order-item-tbl {
    width: 100%;
  }
  .order-item-tbl thead tr td {
    padding-top: 19px;
    padding-bottom: 11px;
    border-bottom: 1px solid #ebebf0;
    color: ${({ theme }) => theme.gray1};
    font-weight: 500;
  }
  .order-item-tbl tbody tr td {
    padding-top: 17px;
    padding-bottom: 17px;
  }
  .order-item-tbl tbody tr:hover {
    background: #f7f7f9;
  }
  .order-item-tbl tr td {
    padding-left: 12px;
  }
  .order-item-tbl tr td:first-child {
    padding-left: 22px;
  }
  .order-item-tbl tr td:last-child {
    padding-right: 22px;
    position: relative;

    .icon-check {
      position: absolute;
      width: auto;
      height: 20px;
      background: #52c41a;
      top: 0;
      right: 0;
      border-radius: 0px 0px 0px 20px;
      padding: 1px 10px 0px;
      min-width: 35px;

      span {
        color: #fff;
        position: absolute;
        font-size: 17px;
      }
    }

    .number-check {
      text-align: -webkit-center;
      color: #fff;
      font-weight: bold;
    }
  }
  .order-item-tbl tr td:nth-child(2),
  .order-item-tbl tr td:nth-child(3),
  .order-item-tbl tr td:nth-child(4) {
    text-align: right;
  }
  .order-item-tbl thead tr td:first-child {
    width: 320px;
  }
  .order-item-tbl tbody tr td:first-child > div {
    display: flex;
    align-items: center;
    .order-info-text {
      display: flex;
      flex-direction: column;
      margin-left: 15px;
      letter-spacing: 0.02rem;
      span:first-child {
        color: ${({ theme }) => theme.darkBlue1};
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
      }
      span:nth-child(2),
      span:nth-child(3) {
        font-size: 12px;
        color: ${({ theme }) => theme.gray3};
        margin-top: 1px;
      }
    }
  }
`;

export const PaymentInfoWrapper = styled(SectionWrapper)`
  .status-payment {
    padding: 0;
    width: auto;
    font-size: 12px;
    margin-left: 8px;
    padding-left: 10px;
    position: relative;
  }
  .payment-type {
    color: ${({ theme }) => theme.gray3};
    margin-left: 8px;
    padding-left: 10px;
    position: relative;
  }
  .status-payment:after,
  .payment-type:after {
    content: '';
    position: absolute;
    top: 1px;
    left: 0;
    height: calc(100% - 2px);
    width: 1px;
    background: #ebebf0;
  }
  .content-top__item,
  .content-bottom__item {
    display: flex;
    justify-content: space-between;
    padding-top: 11px;
  }
  .content-top__item:last-child {
    padding-bottom: 15px;
    font-weight: bold;
  }
  .content-top__item:last-child > span:nth-child(2) {
    color: #f2994a;
  }
  .payment-content__bottom {
    position: relative;
    padding-top: 5px;
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: -20px;
      right: -20px;
      border-top: 1px solid #ebebf0;
    }
  }
`;

export const OrderCodeWrapper = styled(SectionWrapper)`
  .order-top__name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 5px 0 10px 0;
  }
  .order-code__value {
    color: #f2994a;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 0.4em;
    border: none;
    outline: none;
    width: 100%;
  }
  .order-code__value {
    color: #f2994a;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: normal;
    border: none;
    outline: none;
    width: 100%;
  }
  .copy-icon {
    cursor: pointer;
  }
  .order-code__center {
    .center-item {
      padding: 17px 0 0;
      position: relative;
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: -20px;
        right: -20px;
        border-top: 1px solid #ebebf0;
      }
      & > div {
        display: flex;
        justify-content: space-between;
        padding-bottom: 8px;
        & > div:first-child {
          color: ${({ theme }) => theme.gray3};
          white-space: nowrap;
          word-break: keep-all;
          margin-right: 10px;
        }
      }
      & > div:last-child {
        padding-bottom: 0;
      }
      .center-item__icon {
        margin-right: 9px;
        width: 15px;
      }
    }
  }
  .btn-update-tracking {
    /* background: #ee4d2d; */
    width: 100%;
    margin-top: 15px;
  }
`;

export const CustomerInfoWrapper = styled(SectionWrapper)`
  .customer-top__name {
    margin-top: 2px;
    color: ${({ theme }) => theme.darkBlue1};
  }
  .customer-info__center {
    margin-top: 10px;
    .center-item__one {
      display: flex;
      position: relative;
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: -20px;
        right: -20px;
        border-top: 1px solid #ebebf0;
      }
      & > div {
        width: 50%;
        padding: 13px 0;
      }
      & > div:first-child {
        border-right: 1px solid #ebebf0;
      }
      & > div:last-child {
        padding-left: 20px;
      }
      & > div > div:first-child {
        color: ${({ theme }) => theme.gray3};
      }
      & > div > div:last-child {
        font-weight: 900;
        font-size: 18px;
      }
    }
    .center-item__two {
      padding-top: 11px;
      padding-bottom: 10px;
      position: relative;
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: -20px;
        right: -20px;
        border-top: 1px solid #ebebf0;
      }
      .customer-mail__value {
        color: ${({ theme }) => theme.darkBlue1};
      }
      & > div {
        display: flex;
        justify-content: space-between;
        padding-bottom: 7px;
        & > div:first-child {
          color: ${({ theme }) => theme.gray3};
        }
      }
    }
  }
  .customer-info__bottom {
    position: relative;
    padding-top: 20px;
    padding-bottom: 10px;
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: -20px;
      right: -20px;
      border-top: 1px solid #ebebf0;
    }
  }
  .customer-bottom__content {
    .bottom-content__item {
      margin-top: 10px;
      & > div:first-child {
        font-weight: 700;
      }
      & > div:last-child {
        margin-top: 3px;
        color: ${({ theme }) => theme.gray3};
      }
    }
  }
`;

export const StoreInfoWrapper = styled(SectionWrapper)`
  .store-info__top {
    display: flex;
    justify-content: space-between;
    .store-platform-icon {
      height: 12px;
      width: auto;
    }
    .store-platform__name {
      margin-left: 6px;
      color: ${({ theme }) => theme.primary};
    }
    .box-custom {
      background: rgb(244, 244, 244);
      border-radius: 3px;
      padding: 4px 8px;
      text-align: right;

      .box-text {
        font-size: 12px;
        color: rgb(157, 157, 157);
      }
    }
  }
  .store-info_content {
    display: flex;
    align-items: center;
    border: 1px solid #ebebf0;
    border-radius: 4px;
    padding: 8px 11px;
    margin-top: 12px;
    min-height: 40px;
    .store-icon {
      border-radius: 100%;
      flex-grow: 1;
      flex-shrink: 0;
    }
    .store-name {
      margin-left: 5px;
      line-height: 1.3;
    }
  }
`;

export const OrderHistoryWrapper = styled(SectionWrapper)`
  .order-note {
    display: flex;
    margin-top: 12px;
    .ant-form-item {
      margin-bottom: 0;
      flex-grow: 1;
    }
    .ant-form-item-explain.ant-form-item-explain-error {
      min-height: unset;
      padding-top: 5px;
    }
  }
  .order-note__input {
    height: 40px;
    &.ant-input-affix-wrapper:focus {
      box-shadow: none;
    }
    .ant-input::placeholder {
      color: #bdbdbd;
    }
  }
  .order-note__btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 11px;
    width: 73px;
    height: 40px;
    flex-shrink: 0;
    background: ${({ theme }) => theme.darkBlue3};
    border-radius: 4px;
    color: #fff;
    border: none;
    .note-btn__title {
    }
    .note-submit-icon {
      margin-left: 7px;
    }
  }
  .order-timeline {
    margin-top: 30px;
    letter-spacing: 0.02rem;
    .ant-timeline-item {
      padding-bottom: 12px;
    }
    .ant-timeline-item-head {
      color: #6fcf97;
      border-color: #6fcf97;
      background: #6fcf97;
      width: 20px;
      height: 20px;
      border: 4px solid #fff;
    }
    .ant-timeline-item-tail {
      left: 10px;
      border-left: 1px solid #6fcf97;
    }
    .ant-timeline-item-content {
      margin-left: 34px;
      p {
        margin-bottom: 2px;
      }
      .timeline__desc {
        font-size: 12px;
        padding-bottom: 10px;
        color: ${({ theme }) => theme.gray3};
        border-bottom: 1px dashed #ebebf0;
      }
    }
    .ant-timeline-item:first-child .ant-timeline-item-head {
      border-color: #e4fcee;
    }
    .fulfillment-status {
      padding: 0;
      width: unset;
      &:before {
        display: none;
      }
    }
  }
`;
