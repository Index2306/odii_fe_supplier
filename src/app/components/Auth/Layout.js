import * as React from 'react';
import { logo, logoWhite } from 'assets/images';
import { AuthIMGBackGround1, AuthIMGBackGround } from 'assets/images/auth';
import styled from 'styled-components';

const AuthLayout = ({ children }) => {
  return (
    <ComponentAuth>
      <div className="main">
        <div className="main-logo">
          <img src={logo} alt="" />
        </div>

        <div className="main-body">
          <div className="main-body-title">Odii Dropshipping</div>

          {children}
        </div>

        <div className="main-footer">
          <div className="main-copyright">© 2022, Odii - Dropshipping</div>

          {/* <div className="main-link">
            Đến trang{' '}
            <a href={process.env.REACT_APP_SELLER_URL}>
              Nhà Bán Lẻ <i className="fas fa-long-arrow-alt-right" />
            </a>
          </div> */}
        </div>
      </div>

      <div className="intro">
        <div className="intro-image">
          <img src={AuthIMGBackGround1} alt="" />
        </div>

        <div className="intro-logo">
          <img src={logoWhite} alt="" />
        </div>

        <div className="intro-title">
          <span>Supplier</span>
        </div>

        <div className="intro-desc">
          Xây dựng doanh nghiệp Dropshipping trên
          <br />
          nền tảng Shopee, Lazada, Tiktok
        </div>
      </div>
    </ComponentAuth>
  );
};

export default AuthLayout;

const ComponentAuth = styled.div`
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
        color: #3d56a6;
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
      justify-content: space-between;
      align-items: center;
      color: #6c798f;
    }

    &-link {
      padding: 6px 12px;
      border: solid 1px #ebebf0;
      border-radius: 4px;
      &:hover {
        background: #bfc8d8;
      }
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
      width: 46.6666666%;
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

  @media (max-width: 1024px) {
    .main {
      &-body {
        padding: 0 24px;
      }
      &-footer {
        padding: 24px 12px;
      }
    }
  }
  @media (max-width: 768px) {
    display: block;
    .main {
      width: 100%;
      height: auto;
      &-body {
        padding: 0 24px;
      }
      &-footer {
        padding: 24px;
      }
    }
  }
  @media (max-width: 414px) {
    .main {
      height: unset;
    }
  }
`;
