import * as React from 'react';
import Logo from 'assets/images/logo.svg';
import LogoWhite from 'assets/images/logo-white.svg';
// import AuthIMG from 'assets/images/auth/auth-1.svg';
import styled from 'styled-components';
import { AuthIMGBackGround1, AuthIMGBackGround } from 'assets/images/auth';
// import { Link } from 'react-router-dom';

const VerifyLayout = ({ children }) => {
  return (
    <ComponentVerify>
      <div className="main">
        <div className="main-logo">
          <img src={Logo} alt="" />
        </div>

        <div className="main-body">
          <div className="main-body-title">Odii Dropshipping</div>

          {children}
        </div>

        <div className="main-footer">
          <div className="main-copyright">© 2020, Odii - Dropshipping</div>
        </div>
      </div>

      <div className="intro">
        <div className="intro-image">
          <img src={AuthIMGBackGround1} alt="" />
        </div>

        <div className="intro-logo">
          <img src={LogoWhite} alt="" />
        </div>

        <div className="intro-title">
          <span>Supplier</span>
        </div>

        <div className="intro-desc">
          Xây dựng doanh nghiệp Dropshipping trên Shopee, Lazada, Tiktok
        </div>
      </div>
    </ComponentVerify>
  );
};

export default VerifyLayout;

const ComponentVerify = styled.div`
  display: flex;
  height: 100vh;
  align-items: center;
  .main {
      width: 37.5%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      background-color: #ffffff;

      &-logo {
        padding: 24px;
        display: flex;
        color: #3d56a6;
        font-weight: 500;
        border-right: solid 1px #ebebf0;
        span {
          margin-left: 12px;
        }
      }

      &-body {
        padding: 0 96px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;

        &-title {
          font-size: 30px;
          font-weight: 700;
          color: 12px;
          margin-bottom: 8px;
          text-align: center;
        }

        &-page {
          font-size: 16px;
          font-weight: 500;
          color: #333333;
          text-align: center;
          margin-bottom: 36px;
        }
      }

      &-footer {
        border-top: solid 1px #ebebf0;
        padding: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #6C798F;
      }

      &-link {
        padding: 6px 12px;
        border: solid 1px #ebebf0;
        border-radius: 4px;
      }
    }

    &__form {
      &-action {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 18px 0;

        &:not(:last-child) {
          margin-top: 0;
        }
      }

      &-button {
        line-height: $line-height;
        font-size: 16px !important;
        font-weight: 700 !important;
        height: 40px !important;
        text-transform: uppercase;
        padding: 6px 12px;
        margin-top: 24px;
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

      &-alert {
        margin-bottom: 12px;
      }
    }

    .intro {
    background-image: url(${AuthIMGBackGround}),
      linear-gradient(153.43deg, #5c77cd 16.67%, #364ea3 100%);

      background-repeat: no-repeat;
      background-position: bottom center;
      height: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding-bottom: 10%;

      &-image {
        width: 46.6666667%;
        margin-bottom: 36px;

        img {
          width: 100%;
        }
      }

      &-title {
        display: flex;
        align-items: center;
        margin: 18px 0;

        span {
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
          padding: 6px 12px;
          border-radius: 20px;
          border: solid 1px #ffffff;
          margin: 0 12px;
        }

        &::before,
        &::after {
          content: '';
          display: block;
          height: 1px;
          width: 120px;
          background-color: hsla(0, 0%, 100%, 0.3);
        }
      }

      &-desc {
        color: #ffffff;
        font-size: 18px;
        width: 46.66666667%;
        text-align: center;
      }
    }
  }

  .verify-invite {
    background: #f4f6fd;
    min-height: 100vh;
    display: flex;
    flex-direction: column;

    &__header {
      border-bottom: solid 1px #ebebf0;
      display: flex;
      align-items: center;
    }

    &__main {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 60px;
    }

    &__title {
      font-size: 30px;
      color: #3d56a6;
      font-weight: 700;
      text-align: center;
      margin-bottom: 12px;
    }

    &__desc {
      text-align: center;
    }

    &__img {
      display: flex;
      margin: 0 auto;
    }

    &__form {
      width: 100%;
      max-width: 300px;
      margin-top: 24px;

      button {
        width: 100%;
      }
  }
`;
