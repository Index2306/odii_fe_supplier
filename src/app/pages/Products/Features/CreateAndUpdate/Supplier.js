import React, { memo } from 'react';
import { Avatar, Image } from 'app/components';
import styled from 'styled-components';
import Color from 'color';
import { InboxOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { CustomStyle } from 'styles/commons';
import { CustomSectionWrapper } from './styled';

export default memo(function Supplier({ supplier }) {
  return (
    <CustomSectionWrapper>
      <div className="title">Nhà cung cấp</div>
      <div className="">
        <CustomStyle mb={{ xs: 's5' }} className="d-flex align-items-center">
          <Avatar
            shape="square"
            size={24}
            src={
              <Image src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            }
          />
          <CustomStyle ml={{ xs: 's4' }}>{supplier?.name}</CustomStyle>
        </CustomStyle>
        <CustomStyle mb={{ xs: 's5' }} className="d-flex align-items-center">
          <CustomAvatar
            shape="square"
            size={24}
            // style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
            icon={<PhoneOutlined />}
          />
          <CustomStyle ml={{ xs: 's4' }}>{supplier?.phone}</CustomStyle>
        </CustomStyle>
        <CustomStyle mb={{ xs: 's5' }} className="d-flex align-items-center">
          <CustomAvatar
            shape="square"
            size={24}
            // style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
            icon={<InboxOutlined />}
          />
          <CustomStyle ml={{ xs: 's4' }}>{supplier?.mail}</CustomStyle>
        </CustomStyle>
        <CustomStyle mb={{ xs: 's5' }} className="d-flex align-items-center">
          <CustomAvatar
            shape="square"
            size={24}
            // style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
            icon={<HomeOutlined />}
          />
          <CustomStyle ml={{ xs: 's4' }}>{supplier?.address}</CustomStyle>
        </CustomStyle>
      </div>
    </CustomSectionWrapper>
  );
});

const CustomAvatar = styled(Avatar)`
  color: ${({ theme }) => theme.primary};
  background-color: ${({ theme }) => Color(theme.primary).alpha(0.07)};
`;
