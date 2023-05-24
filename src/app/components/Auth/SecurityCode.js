import * as React from 'react';
import { logo } from 'assets/images';
import styled from 'styled-components';

const SecurityCodeLayout = ({ children }) => {
  return (
    <ComponentRegistered>
      <div className="registered__header">
        <div className="registered__logo">
          <img src={logo} alt="" />
        </div>
      </div>

      <div className="registered__main">{children}</div>
    </ComponentRegistered>
  );
};

export default SecurityCodeLayout;

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
