import * as React from 'react';
import Logo from 'assets/images/logo.svg';
import { Steps } from 'antd';
import url from 'url';
import styled from 'styled-components';

const { Step } = Steps;

const steps = [
  { order: 0, key: 'registered', title: 'Đăng ký tài khoản' },
  { order: 1, key: 'active-user', title: 'Xác thực tài khoản' },
  // { order: 2, key: 'supplier-setting', title: 'Cài đặt nhà cung cấp' },
  // { order: 3, key: 'category-setting', title: 'Ngành hàng' },
  // { order: 4, key: 'completed', title: 'Hoàn tất' },
];

const RegisteredLayout = ({ children }) => {
  const URL = url.parse(window.location.href);
  const paths = URL.pathname?.split('/');
  const currentPath = paths[paths.length - 1];

  const currentOrder = steps.find(step => step.key === currentPath);

  return (
    <ComponentRegistered>
      <div className="registered__header">
        <div className="registered__logo">
          {/* <a href="/dashboard"> */}
          <img src={Logo} alt="" />
          {/* </a> */}
        </div>

        <div className="registered__step">
          <Steps current={currentOrder?.order}>
            {steps.map(step => (
              <Step title={step.title} key={step.key} />
            ))}
          </Steps>
        </div>
      </div>

      <div className="registered__main">{children}</div>
    </ComponentRegistered>
  );
};

export default RegisteredLayout;

const ComponentRegistered = styled.div`
  background: #f4f6fd;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .registered__header {
    border-bottom: solid 1px #ebebf0;
    display: flex;
    align-items: center;
    &::after {
      content: '';
      width: 170px;
      display: inline-block;
    }
  }
  .registered__logo {
    padding: 24px;
    display: flex;
    color: #3d56a6;
    font-weight: 500;
    border-right: solid 1px #ebebf0;
    span {
      margin-left: 12px;
    }
  }
  .registered__step {
    flex: 1;
    max-width: 40%;
    margin: auto;
    padding: 12px 24px;
    // border-left: solid 1px $light-gray;

    .ant-steps {
      &-item {
        font-weight: 500;

        &-process .ant-steps-item-icon {
          background-color: #3d56a6;
          border-color: #3d56a6;
        }

        &-process .ant-steps-item-icon .ant-steps-icon {
          color: #ffffff !important;
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
          line-height: calc(22 / 14);
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
  .registered__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 60px;
  }
  @media (max-width: 1024px) {
    .registered__step {
      display: none;
    }
    .registered__desc {
      padding: 0 24px;
    }
  }
`;
