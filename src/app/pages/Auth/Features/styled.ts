import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { Modal } from 'antd';

export const P = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  color: ${p => p.theme.textSecondary};
  margin: 0.625rem 0 1.5rem 0;
`;

export const SubTitle = styled.h3`
  font-size: 1.25rem;
  margin: 0;
  color: ${p => p.theme.text};
`;

export const Title = styled.h2`
  font-size: 32px;
  font-weight: bold;
  color: ${p => p.theme.text};
  margin: 1rem 0;
`;

export const Icon = styled.span`
  .anticon {
    vertical-align: 0;
  }
`;

export const CustomDivButton = styled.div`
  margin-left: auto;
  margin-right: auto;
  .anticon {
    margin-top: 4px;
  }
  .form-button {
    display: flex;
    margin: auto;
  }
`;
export const CustomDiv = styled.div`
  margin-left: auto;
  margin-right: auto;
  .anticon {
    vertical-align: 2px;
  }
`;

export const CustomLink = styled(Link)`
  &:hover {
    text-decoration: underline;
  }
`;

export const ComponentAuthMain = styled.div`
  .main-body-page {
    font-size: 16px;
    font-weight: 500;
    color: #333333;
    text-align: center;
    margin-bottom: 36px;
  }

  .form {
    &-button {
      line-height: calc(22 / 14);
      font-size: 16px !important;
      font-weight: 700 !important;
      height: 40px !important;
      text-transform: uppercase;
      padding: 6px 12px;
      background-color: #3d56a6;
      color: #ffffff;
      border: solid 1px #3d56a6;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
      &-icon {
        margin-right: 6px;
      }

      &:disabled,
      &[disabled] {
        background-color: #ebebf0;
        border-color: #ebebf0;
      }

      &:hover {
        background-color: darken(#3d56a6, 5%);
      }
    }
    &-divider {
      color: #3d56a6;
      margin: 18px 0;
      display: flex;
      align-items: center;

      span {
        margin: 0 12px;
      }

      &::before,
      &::after {
        content: '';
        display: block;
        height: 1px;
        flex: 1;
        background-color: #ebebf0;
      }
    }
    &-action {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 18px 0;

      &:not(:last-child) {
        margin-top: 0;
      }
    }
    &-social {
      display: flex;
      justify-content: space-between;
      padding-bottom: 24px;
      border-bottom: solid 1px #ebebf0;

      &-btn {
        padding: 12px 0;
        flex: 1;
        vertical-align: middle;
        color: #6c798f;
        background-color: #ffffff;
        border: solid 1px #ebebf0;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          background-color: darken(#ffffff, 5%);
        }

        img {
          margin-right: 6px;
          margin-top: -2px;
        }

        &:not(:last-child) {
          margin-right: 12px;
        }
      }
    }
  }
`;

export const ComponentAuthRegister = styled.div`
  background: #f4f6fd;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  .registered {
    &__header {
      border-bottom: solid 1px #ebebf0;
      display: flex;
      align-items: center;
      &::after {
        content: '';
        width: 170px;
        display: inline-block;
      }
    }

    &__step {
      flex: 1;
      max-width: 40%;
      margin: auto;
      padding: 12px 24px;
      border-left: solid 1px $light-gray;

      .ant-steps {
        &-item {
          font-weight: 500;

          &-process .ant-steps-item-icon {
            background-color: #3d56a6;
            border-color: #3d56a6;
          }

          &-process .ant-steps-item-icon .ant-steps-icon {
            color: $white !important;
          }

          &-icon {
            width: 24px;
            height: 24px;
            line-height: 24px;
            margin-top: 1px;
            border-color: rgba(61, 86, 166, 0.5) !important;

            .ant-steps-icon {
              color: rgba(61, 86, 166, 0.5) !important;

              .anticon {
                transform: translate(0, -3px);
              }
            }
          }

          &-title {
            /* line-height: calc(22 / 14);
            color: rgba(#3d56a6, 0.5) !important; */
            line-height: 1.5714285714;
            color: rgba(61, 86, 166, 0.5) !important;
            &::after {
              background-color: #3d56a6 !important;
              margin-top: -2px;
            }
          }

          &-process .ant-steps-item-title {
            color: #3d56a6 !important;
          }
        }
      }
    }

    &__main {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 60px;
    }

    &__title {
      text-align: center;
      font-size: 30px;
      color: #3d56a6;
      font-weight: 700;
      margin-bottom: 12px;
    }

    &__desc {
      text-align: center;
    }

    &__form {
      width: 100%;
      max-width: 300px;
      margin-top: 24px;

      button {
        width: 100%;
      }
    }
  }
`;

export const CustomModal = styled(Modal)`
  text-align: center;
  .ant-modal-close-x {
    width: 42px;
  }
  .ant-modal-body {
    padding-top: 48px;
  }
  .modal {
    &__title {
      font-weight: bold;
      font-size: 22px;
      line-height: 35px;
      color: #3d56a6;
    }
    &__desc {
      font-size: 16px;
      line-height: 22px;
      margin: 24px 8px;
      color: #6c798f;
    }
    &__btn {
      width: 100%;
      font-weight: 500;
      &:not(:last-child) {
        margin-bottom: 12px;
      }
      &-back {
        font-size: 16px;
      }
    }
  }
`;

export const FormAlert = styled.div`
  margin-bottom: 12px;
`;
