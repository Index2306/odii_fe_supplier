import React from 'react';
import { useSelector } from 'react-redux';
import { CustomH2, SectionWrapper } from 'styles/commons';
import styled from 'styled-components/macro';
import { Button } from 'app/components';
import { Skeleton, Space } from 'antd';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import constants from 'assets/constants';
import {
  getColorByConfirmStatus,
  getTitleByConfirmStatus,
} from 'utils/helpers';
const { roles } = constants;
const steps = [
  { id: 1, title: 'Kế toán viên' },
  { id: 2, title: 'Đối tác' },
  { id: 3, title: 'Kế toán trưởng' },
  // { id: 3, title: 'Kết thúc' },
];

const getAllStepStatus = deptInfo => {
  return [
    deptInfo?.accountant_confirm,
    deptInfo?.partner_confirm,
    deptInfo?.chief_accountant_confirm,
  ];
};
const getAction = (userRoles, deptInfo) => {
  if (
    !deptInfo?.accountant_confirm ||
    deptInfo?.accountant_confirm === 'pending'
  ) {
    if (
      userRoles.includes(roles.adminAccountant) ||
      userRoles.includes(roles.adminChiefAccountant)
    )
      return {
        allowApprove: true,
        allowReject: false,
        type: 'accountant_confirm',
      };
  } else if (
    !deptInfo?.partner_confirm ||
    deptInfo?.partner_confirm === 'pending'
  ) {
    // supplier site
    return null;
  } else if (
    !deptInfo?.chief_accountant_confirm ||
    deptInfo?.chief_accountant_confirm === 'pending'
  ) {
    return {
      allowApprove: true,
      allowReject: false,
      type: 'chief_accountant_confirm',
    };
  }
  return null;
};
export default function ProcessInfo({ deptInfo, isLoading, handleConfirm }) {
  const progressStatus = getAllStepStatus(deptInfo);
  const currentUser = useSelector(selectCurrentUser);
  const processItems = steps.map((item, index) => {
    const color = getColorByConfirmStatus(progressStatus[index]);
    const confirmTitle = getTitleByConfirmStatus(progressStatus[index]);
    return { ...item, color: color, confirmTitle: confirmTitle };
  });
  const action = getAction(currentUser?.roles || [], deptInfo);

  const pageContent = (
    <>
      <ProgressHandle>
        <CustomH2>Tiến độ xét duyệt</CustomH2>
        <div className="stepbystep">
          {processItems.map(item => (
            <>
              <div className="step">
                <div className="number-circle">{item.id}</div>
                <div className="content">
                  <div className="title">{item.title}</div>
                  <div
                    className="status"
                    style={{
                      color: item.color,
                    }}
                  >
                    {item.confirmTitle}
                  </div>
                </div>
              </div>
              {item.id !== 3 && <div className="divider"></div>}
            </>
          ))}
        </div>
        {action && (
          <div>
            <Space>
              {action.allowReject && (
                <Button
                  context="secondary"
                  color="orange"
                  onClick={() => handleConfirm(false, action.type)}
                  className="btn-sm"
                >
                  <span>Từ chối</span>
                </Button>
              )}
              {action.allowApprove && (
                <Button
                  className="btn-sm"
                  onClick={() => handleConfirm(true, action.type)}
                  width="80px"
                >
                  <span>Duyệt</span>
                </Button>
              )}
            </Space>
          </div>
        )}
        <div></div>
      </ProgressHandle>
    </>
  );

  return (
    <SectionWrapper className="box-df">
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 18 }} className="loading" />
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

export const SectionDiv = styled.div`
  margin-top: 28px;
`;

export const ProgressHandle = styled.div`
  text-align: center;
  border-bottom: 1px solid #ebebf0;
  .stepbystep {
    display: flex;
    justify-content: center;
    margin-bottom: 14px;
    .divider {
      border: 1px solid #6c798f;
      width: 50px;
      height: 1px;
      margin: auto 16px;
    }
    .step {
      display: flex;
    }
    .number-circle {
      width: 20px;
      height: 20px;
      border: 1px solid #6c798f;
      border-radius: 50%;

      font-weight: bold;
      font-size: 12px;
      line-height: 19px;
      text-align: center;
      color: #6c798f;
      margin-top: 6px;
      margin-right: 8px;
    }
    .content {
      text-align: left;
    }
    .title {
      font-weight: 500;
      font-size: 12px;
      line-height: 14px;
      margin-bottom: 2px;
      color: #333333;
    }
    .status {
      color: #828282;
      font-size: 12px;
    }
  }
`;
