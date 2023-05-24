import * as React from 'react';
import styled from 'styled-components/macro';
import { CustomStyle } from 'styles/commons';
import { notSupportMobile, logoSmall } from 'assets/images';

export default function NotSupportMobile() {
  return (
    <Wrapper>
      <WrapperBody>
        <CustomStyle mb={{ xs: 's7' }}>
          <img src={notSupportMobile} alt="notSupportMobile" />
        </CustomStyle>
        <CustomStyle mb={{ xs: 's5' }}>
          <img src={logoSmall} alt="logoSmall" className="small-image" />
        </CustomStyle>
        <CustomStyle
          color="primary"
          fontSize={{ xs: 'f6' }}
          mb={{ xs: 's5' }}
          fontWeight="bold"
        >
          Chưa hỗ trợ giao diện di động
        </CustomStyle>
        <CustomStyle fontSize={{ xs: 'f3' }} mb={{ xs: 's3' }}>
          Rất tiếc vì sự bất tiện này. Chúng tôi đang trong quá trình hoàn thiện
          giao diện cho phiên bản di động.
          <br />
          Bạn hãy sử dụng sản phẩm trên giao diện máy tính, laptop - đã được
          chúng tôi hoàn thiện rất tuyệt vời.
        </CustomStyle>
      </WrapperBody>
      <Footer>© 2022, Odii - Dropshipping</Footer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  text-align: center;
  flex-direction: column;
  min-height: 320px;
`;

const WrapperBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  margin: 0 27px;
  .small-image {
    width: 82px;
  }
`;

const Footer = styled.div`
  color: ${({ theme }) => theme.grayBlue};
  padding: 20px 0 13px;
  border-top: 1px solid ${({ theme }) => theme.stroke};
`;
