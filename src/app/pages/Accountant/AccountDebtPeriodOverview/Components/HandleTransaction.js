import React from 'react';
import { CustomH3, SectionWrapper } from 'styles/commons';
import { Button } from 'app/components';
import styled from 'styled-components/macro';
import { Tooltip, Skeleton } from 'antd';
import { tooltip } from 'assets/images/icons';
// import request from 'utils/request';
import { BoxColor } from 'app/components';

export default function HandleTransaction({
  t,
  data,
  isLoading,
  currentUser,
  RoleAccountant,
  handleAccept,
  handleReject,
}) {
  const getPeriodStatus = (status, titleAppend) => {
    let color;
    let title;
    if (status === 'succeeded') {
      title = 'Đã';
      color = 'greenMedium1';
    } else if (status === 'confirmed') {
      title = 'Chờ';
      color = 'primary';
    } else {
      title = 'Đang';
      color = 'darkBlue1';
    }

    return (
      <BoxColor
        className="payout-status"
        notBackground
        colorValue={color}
        width="130px"
        fontSize="14px"
      >
        {title} {titleAppend}
      </BoxColor>
    );
  };
  const pageContent = (
    <>
      <DivTitle>
        <CustomH3 className="section-title">Xử lý giao dịch</CustomH3>
        <Tooltip
          placement="right"
          title={
            currentUser?.roles?.includes('admin_chief_accountant')
              ? 'Kế toán trưởng duyệt yêu cầu thanh toán công nợ. (Nếu kế toán viên chưa duyệt, Kế toán trưởng có thể duyệt cả 2 bước.)'
              : currentUser?.roles?.includes('admin_accountant')
              ? 'Kế toán viên duyệt yêu cầu thanh toán công nợ. (Kế toán trưởng cũng có thể duyệt bước này)'
              : ''
          }
        >
          {/* <img className="tooltip" src={tooltip} alt="" /> */}
        </Tooltip>
      </DivTitle>
      <Item>
        <div className="label">Trạng thái</div>
        <span>{getPeriodStatus(data?.status, 'thanh toán')}</span>
      </Item>

      {(data?.confirm_status === 'pending' ||
        data?.confirm_status === 'accountant_confirm' ||
        data?.confirm_status === 'accountant_confirmed' ||
        data?.confirm_status === 'accountant_rejected') && (
        <>
          <CustomButton className="btn-sm" onClick={handleAccept}>
            Xác nhận đã thanh toán
          </CustomButton>
          <CustomButton
            context="secondary"
            className="btn-sm"
            color="orange"
            onClick={handleReject}
          >
            Giao dịch cần kiểm tra
          </CustomButton>
        </>
      )}
    </>
  );

  return (
    <SectionWrapper className="box-df">
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 10 }} className="loading" />
      ) : (
        pageContent
      )}
    </SectionWrapper>
  );
}

export const Item = styled.div`
  display: flex;
  justify-content: space-between;
  line-height: 38px;
  border-bottom: 1px solid #f0f0f0;
  line-height: 36px;
  .label {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.4);
  }
  &.end {
    border-bottom: none;
  }
  .dot {
    &::before {
      content: '';
      width: 7px;
      height: 7px;
      margin-right: 6px;
      margin-bottom: 1px;
      border-radius: 50%;
      background-color: #2f80ed;
      display: inline-block;
    }
  }
`;

export const CustomButton = styled(Button)`
  width: 100%;
  margin-top: 16px;
  border-radius: 4px;
`;

export const DivTitle = styled.div`
  display: flex;
  margin-top: 24px;
  .title {
    color: #333333;
    font-weight: bold;
    font-size: 16px;
    line-height: 16px;
    margin-right: 6px;
  }
  .tooltip {
    width: 12px;
    height: 12px;
  }
`;
