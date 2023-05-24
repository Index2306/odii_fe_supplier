import React from 'react';
import {
  useSelector,
  // useDispatch
} from 'react-redux';
import { CustomH3, CustomH2, SectionWrapper } from 'styles/commons';
import styled from 'styled-components/macro';
import { Button, Input } from 'app/components';
import { Skeleton } from 'antd';
import { selectTimeline } from '../slice/selectors';
import {
  getColorByConfirmStatus,
  getTitleByConfirmStatus,
} from 'utils/helpers';
const steps = [
  { id: 1, title: 'Kế toán viên' },
  { id: 2, title: 'Kế toán trưởng' },
  // { id: 3, title: 'Kết thúc' },
];

const getAllStepStatus = (status, timelines) => {
  if (status === 'pending') return ['pending', 'pending'];
  if (status === 'accountant_confirm' || status === 'accountant_confirmed')
    return ['accountant_confirm', 'pending'];
  if (status === 'accountant_rejected') return ['accountant_rejected', 'NA'];
  if (
    status === 'chief_accountant_confirmed' ||
    status === 'chief_accountant_rejected'
  ) {
    let firstStatus = 'NA';
    const existedFirst = timelines?.find(
      item =>
        item?.action === 'update' &&
        (item?.metadata.confirm_status === 'accountant_confirmed' ||
          item?.metadata.confirm_status === 'accountant_confirm'),
    );
    if (existedFirst) firstStatus = 'accountant_confirmed';
    return [firstStatus, status];
  }
  return ['pending', 'pending'];
};

export default function PaymentInfo({ data, isLoading }) {
  const dataTimeline = useSelector(selectTimeline);

  const progressStatus = getAllStepStatus(
    data?.confirm_status,
    dataTimeline || [],
  );

  const processItems = steps.map((item, index) => {
    const color = getColorByConfirmStatus(progressStatus[index]);
    const confirmTitle = getTitleByConfirmStatus(progressStatus[index]);
    return { ...item, color: color, confirmTitle: confirmTitle };
  });
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
              {item.id !== 2 && <div className="divider"></div>}
            </>
          ))}
        </div>
      </ProgressHandle>
      <SectionDiv>
        <CustomH3>Thông tin khách hàng</CustomH3>
        <Item>
          <div className="label">Khách hàng</div>
          <div>
            {data?.from_user?.full_name ? data?.from_user?.full_name : 'N/A'}
          </div>
        </Item>
        <Item>
          <div className="label">Email</div>
          <div>{data?.from_user?.email ? data?.from_user?.email : 'N/A'}</div>
        </Item>
        <Item>
          <div className="label">Số điện thoại</div>
          <div
            style={{
              fontWeight: 'bold',
            }}
          >
            {data?.from_user?.phone ? '+84' + data?.from_user?.phone : ''}
          </div>
        </Item>
        <Item>
          <div className="label">Mã khách hàng</div>
          <div
            style={{
              fontWeight: 'bold',
            }}
          >
            #{data?.from_user?.id}
          </div>
        </Item>
        <Item>
          <div className="label">Loại tài khoản</div>
          <div
            style={{
              fontWeight: 'bold',
              color:
                data?.source === 'supplier'
                  ? 'green'
                  : data?.source === 'seller'
                  ? 'blue'
                  : '',
            }}
          >
            {data?.source}
          </div>
        </Item>
        {/* <Item>
          <div className="label">Cửa hàng</div>
          <div>Odii Shop</div>
        </Item> */}
      </SectionDiv>

      <SectionDiv>
        <CustomH3>Thông tin ngân hàng</CustomH3>
        <Item>
          <div className="label">Tên ngân hàng</div>
          <div>{data?.to_bank?.bank_info?.title}</div>
        </Item>
        <Item>
          <div className="label">Chi nhánh</div>
          <div>{data?.to_bank?.sub_title}</div>
        </Item>
        <Item>
          <div className="label">Số tài khoản</div>
          <div
            style={{
              fontWeight: 'bold',
            }}
          >
            {data?.to_bank?.account_number}
          </div>
        </Item>
        <Item>
          <div className="label">Chủ tài khoản</div>
          <div> {data?.to_bank?.account_name}</div>
        </Item>
      </SectionDiv>

      <SectionDiv>
        <CustomH3>Nội dung</CustomH3>
        <Input value={data?.note} disabled></Input>
      </SectionDiv>
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
