import React from 'react';
import { CustomH3, SectionWrapper } from 'styles/commons';
import { Button } from 'app/components';
import { formatVND } from 'utils/helpers';
import styled from 'styled-components/macro';
import { Tooltip, Skeleton } from 'antd';
import { tooltip } from 'assets/images/icons';

export default function DetailInfo({
  t,
  data,
  isLoading,
  currentUser,
  RoleAccountant,
  handleAccept,
  handleReject,
  hasRole,
}) {
  const pageContent = (
    <>
      <CustomH3 className="section-title">Chi tiết yêu cầu</CustomH3>
      <Item>
        <div className="label">Mã Giao dịch</div>
        <div>#{data?.long_code}</div>
      </Item>
      <Item>
        <div className="label">Loại YC</div>
        <div
          style={{
            fontWeight: 'bold',
            color: 'green',
          }}
        >
          Nạp tiền
        </div>
      </Item>
      <Item>
        <div className="label">Số tiền</div>
        <div
          style={{
            color: 'green',
          }}
        >
          + {formatVND(Math.abs(data?.amount))} đ
        </div>
      </Item>
      <Item>
        <div className="label">Trạng thái</div>
        <div
          className="dot"
          style={{
            color: '#2f80ed',
          }}
        >
          {t(`accountant.confirmStatus.${data?.confirm_status}`)}
        </div>
      </Item>

      {(data?.confirm_status === 'pending' ||
        data?.confirm_status === 'accountant_confirm' ||
        data?.confirm_status === 'accountant_confirmed') && (
        <>
          <DivTitle>
            <div className="title">
              {currentUser?.roles?.includes('admin_chief_accountant')
                ? 'Kế toán trưởng duyệt'
                : currentUser?.roles?.includes('admin_accountant')
                ? 'Kế toán viên duyệt'
                : ''}
            </div>
            <Tooltip
              placement="right"
              title={
                currentUser?.roles?.includes('admin_chief_accountant')
                  ? 'Kế toán trưởng duyệt yêu cầu nạp tiền. (Nếu kế toán viên chưa duyệt, Kế toán trưởng có thể duyệt cả 2 bước.)'
                  : currentUser?.roles?.includes('admin_accountant')
                  ? 'Kế toán viên duyệt yêu cầu nạp tiền. (Kế toán trưởng cũng có thể duyệt bước này)'
                  : ''
              }
            >
              {/* <img className="tooltip" src={tooltip} alt="" /> */}
            </Tooltip>
          </DivTitle>
          {hasRole && (
            <>
              <CustomButton className="btn-sm" onClick={handleAccept}>
                Duyệt
              </CustomButton>
              <CustomButton
                context="secondary"
                className="btn-sm"
                color="orange"
                onClick={handleReject}
              >
                Từ chối
              </CustomButton>
            </>
          )}
        </>
      )}
    </>
  );

  // const ActionAccountant = (
  //   <>
  //     <DivTitle>
  //       <div className="title">1 - Kế toán viên duyệt</div>
  //       <Tooltip
  //         placement="right"
  //         title="Kế toán viên duyệt yêu cầu nạp tiền. (Kế toán trưởng cũng có thể duyệt bước này)"
  //       >
  //         <img className="tooltip" src={tooltip} alt="" />
  //       </Tooltip>
  //     </DivTitle>
  //     <CustomButton className="btn-sm" onClick={handleAccept}>
  //       Duyệt
  //     </CustomButton>
  //     <CustomButton
  //       context="secondary"
  //       className="btn-sm"
  //       color="orange"
  //       onClick={handleReject}
  //     >
  //       Từ chối
  //     </CustomButton>
  //   </>
  // );

  // const ActionChiefAccountant = (
  //   <>
  //     <DivTitle>
  //       <div className="title">2 - Kế toán trưởng duyệt</div>
  //       <Tooltip
  //         placement="right"
  //         title="Kế toán trưởng duyệt yêu cầu nạp tiền. (Nếu kế toán viên chưa duyệt, Kế toán trưởng có thể duyệt cả 2 bước.)"
  //       >
  //         <img className="tooltip" src={tooltip} alt="" />
  //       </Tooltip>
  //     </DivTitle>

  //     <CustomButton className="btn-sm" onClick={handleAccept}>
  //       Duyệt
  //     </CustomButton>
  //     <CustomButton
  //       context="secondary"
  //       className="btn-sm"
  //       color="orange"
  //       onClick={handleReject}
  //     >
  //       Từ chối
  //     </CustomButton>
  //   </>
  // );

  //   return (
  //     <>
  //       <SectionWrapper className="box-df">{pageContent}</SectionWrapper>

  //       {/* Show Action handle for Accountant if user have role 'admin_accountant' */}
  //       {/* {currentUser?.roles?.find(item => item === 'admin_accountant') &&
  //         data?.confirm_status === 'pending' && (
  //           <SectionWrapper className="box-df">{ActionAccountant}</SectionWrapper>
  //         )} */}

  //       {/* Show Action handle for Chief Accountant if user have role 'admin_chief_accountant' */}
  //       {/* {currentUser?.roles?.find(item => item === 'admin_chief_accountant') &&
  //         (data?.confirm_status === 'pending' ||
  //           data?.confirm_status === 'accountant_confirm') && (
  //           <SectionWrapper className="box-df">
  //             {ActionChiefAccountant}
  //           </SectionWrapper>
  //         )} */}
  //     </>
  //   );
  // }

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
