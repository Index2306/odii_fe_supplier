import React, { useEffect } from 'react';
import 'antd/dist/antd.css';
import { Steps, Row, Col } from 'antd';
import { CustomH3, SectionWrapper } from 'styles/commons';
import styled from 'styled-components/macro';
import { useSelector } from 'react-redux';
import { Button } from 'app/components';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import { Skeleton, Space } from 'antd';
import {
  getColorByConfirmStatus,
  getTitleByConfirmStatus,
} from 'utils/helpers';
import constants from 'assets/constants';
import { formatDate } from 'utils/helpers';
import * as moment from 'moment';
const { Step } = Steps;
const { roles } = constants;
const stepSource = [
  {
    id: 1,
    title: 'Kế toán viên',
    type: 'accountant_confirm',
  },
  {
    id: 2,
    title: 'Đối tác',
    type: 'partner_confirm',
  },
  {
    id: 3,
    title: 'Kế toán trưởng',
    type: 'chief_accountant_confirm',
  },
  // { id: 3, title: 'Kết thúc' },
];
const getAllStepStatus = deptInfo => {
  return [
    deptInfo?.accountant_confirm,
    deptInfo?.partner_confirm,
    deptInfo?.chief_accountant_confirm,
  ];
};

const getAllStepAdditionalInfo = deptInfo => {
  return [
    {
      confirm_at: deptInfo.accountant_confirm_at,
      confirm_by: deptInfo.accountant_confirm_by,
    },
    {
      confirm_at: deptInfo.partner_confirm_at,
      confirm_by: deptInfo.partner_confirm_by,
    },
    {
      confirm_at: deptInfo.chief_accountant_confirm_at,
      confirm_by: deptInfo.chief_accountant_confirm_by,
    },
  ];
};

const getAction = (userRoles, deptInfo) => {
  if (
    moment(deptInfo?.payout_period_start, 'YYYY-MM-DD') <=
    moment(new Date(), 'YYYY-MM-DD')
  ) {
    if (
      !deptInfo?.accountant_confirm ||
      deptInfo?.accountant_confirm === 'pending'
    ) {
      if (
        userRoles.includes(roles.adminAccountant) ||
        userRoles.includes(roles.adminChiefAccountant)
      )
        return null;
    } else if (
      !deptInfo?.partner_confirm ||
      deptInfo?.partner_confirm === 'pending'
    ) {
      return {
        allowApprove: true,
        allowReject: true,
        type: 'partner_confirm',
      };
    } else if (
      !deptInfo?.chief_accountant_confirm ||
      deptInfo?.chief_accountant_confirm === 'pending'
    ) {
      return null;
    }
  }

  return null;
};

export default function ProcessInfoSteps({
  deptInfo,
  isLoading,
  handleConfirm,
}) {
  const [current, setCurrent] = React.useState(0);
  const progressStatus = getAllStepStatus(deptInfo);
  const stepAddionalInfo = getAllStepAdditionalInfo(deptInfo);
  const currentUser = useSelector(selectCurrentUser);
  const processItems = stepSource.map((item, index) => {
    const color = getColorByConfirmStatus(progressStatus[index]);
    const confirmTitle = getTitleByConfirmStatus(progressStatus[index]);
    const stepInfo = stepAddionalInfo[index];
    return {
      ...item,
      color: color,
      confirmTitle: confirmTitle,
      ...stepInfo,
      status: progressStatus[index],
    };
  });
  useEffect(() => {
    const currIndx = processItems.findLastIndex(
      item => item.status === 'confirmed' || item.status === 'rejected',
    );
    setCurrent(currIndx + 1);
  }, [deptInfo]);
  const action = getAction(currentUser?.roles || [], deptInfo);
  const subTitle = item => (
    <>
      {item.status === 'confirmed' ||
      item.status === 'rejected' ||
      item.status === 'reconfirm' ? (
        <div className="nameSigned">
          <span>{item?.confirm_by}</span>
          <span>{formatDate(item?.confirm_at)}</span>
        </div>
      ) : (
        <>
          {action && action.type === item.type && (
            <>
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
                {(action.allowApprove || action.allowReApprove) && (
                  <Button
                    className="btn-sm"
                    onClick={() => handleConfirm(true, action.type)}
                    width="80px"
                  >
                    <span>{action.allowReApprove ? 'Duyệt lại' : 'Duyệt'}</span>
                  </Button>
                )}
              </Space>
            </>
          )}
        </>
      )}
    </>
  );
  const pageContent = (
    <>
      <ProgressHandle>
        <CustomH3
          className="title"
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          Tiến độ xét duyệt
          <span
            style={{
              fontSize: '14px',
              color:
                moment(deptInfo?.payout_period_start, 'YYYY-MM-DD') >=
                moment(new Date(), 'YYYY-MM-DD')
                  ? 'red'
                  : 'green',
            }}
          >
            {moment(deptInfo?.payout_period_start, 'YYYY-MM-DD') >=
            moment(new Date(), 'YYYY-MM-DD')
              ? '(Chưa đến kỳ thanh toán)'
              : '(Đã đến kỳ thanh toán)'}
          </span>
        </CustomH3>
        <Row gutter="24">
          <Col span={24}>
            <div className="stepbystep">
              <Steps
                direction="vertical"
                size="small"
                color
                current={current || 0}
              >
                {processItems.map(item => (
                  <Step
                    title={item.title}
                    description={item.confirmTitle}
                    status={
                      item.status === 'confirmed'
                        ? 'finish'
                        : item.status === 'rejected'
                        ? 'error'
                        : ''
                    }
                    disabled="true"
                    subTitle={subTitle(item)}
                  />
                ))}
              </Steps>
            </div>
          </Col>
        </Row>
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

export const ProgressHandle = styled.div`
  text-align: center;
  border-bottom: 1px solid #ebebf0;
  .title {
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    color: #333333;
    // margin-bottom: 20px;
  }
  .ant-steps-item-icon {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .ant-steps-item-finish
    > .ant-steps-item-container
    > .ant-steps-item-content
    > .ant-steps-item-description {
    color: rgb(126, 168, 2);
  }
  .ant-steps-item-process
    > .ant-steps-item-container
    > .ant-steps-item-content
    > .ant-steps-item-description {
    color: rgb(47, 128, 237);
  }
  .ant-steps-item-title {
    position: relative;
    display: flex;
    font-weight: 500;
    line-height: 14px;
    margin-bottom: 2px;
    .ant-steps-item-subtitle {
      position: absolute;
      right: 0;
      .nameSigned {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  }
  .ant-steps-item-description {
    padding-bottom: 11px !important;
    font-size: 12px;
  }
  .ant-steps-item-subtitle {
    padding: 5px 0;
    font-size: 12px;
  }
  .stepbystep {
    display: flex;
    justify-content: center;
    margin-bottom: 4px;
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
      // margin-bottom: 2px;
      color: #333333;
    }
    .status {
      color: #828282;
      font-size: 12px;
    }
  }
`;
