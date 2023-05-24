import React, { useState, useEffect } from 'react';
import { Timeline, Skeleton } from 'antd';
import { CustomH3, SectionWrapper } from 'styles/commons';
import { isEmpty } from 'lodash';
import {
  useSelector,
  // useDispatch
} from 'react-redux';
// import constants from 'assets/constants';
// import request from 'utils/request';
import { formatDate } from 'utils/helpers';
import styled from 'styled-components/macro';
import { selectTimeline } from '../slice/selectors';

export default function History({ data, isLoading }) {
  const dataTimeline = useSelector(selectTimeline);
  const [dataTimelineFormat, setDataTimelineFormat] = useState([]);

  useEffect(() => {
    if (!isEmpty(dataTimeline)) {
      const temp = dataTimeline.map(item => {
        return {
          ...item,
          title:
            item.metadata?.confirm_status === 'accountant_confirm'
              ? 'Giao dịch đã được Kế toán viên duyệt'
              : item.metadata?.confirm_status === 'accountant_rejected'
              ? 'Giao dịch đã bị Kế toán viên từ chối'
              : item.metadata?.confirm_status === 'chief_accountant_confirm'
              ? 'Giao dịch đã được Kế toán trưởng duyệt'
              : item.metadata?.confirm_status === 'chief_accountant_rejected'
              ? 'Giao dịch đã bị Kế toán trưởng từ chối'
              : item.metadata?.status === 'created'
              ? 'Khởi tạo giao dịch'
              : item.metadata?.status === 'pending'
              ? 'Giao dịch đang chờ xử lý'
              : item.metadata?.status === 'succeeded'
              ? 'Giao dịch đã được phê duyệt thành công'
              : item.metadata?.status === 'failed'
              ? 'Giao dịch đã bị từ chối'
              : '',
        };
      });
      setDataTimelineFormat(temp);
    }
  }, [dataTimeline]);

  const pageContent = (
    <>
      <div>
        <CustomH3 className="section-title">Lịch sử</CustomH3>
      </div>
      <DivTimeline>
        {!isEmpty(dataTimelineFormat) ? (
          <Timeline>
            {dataTimelineFormat.map((item, index) => (
              <Timeline.Item key={index} color="green">
                <span className="timeline__title">
                  {item.title ? item.title : item.note}
                </span>
                {item.note && (
                  <div className="timeline__desc">
                    <span className="label">Nội dung: </span>
                    {item?.note}
                  </div>
                )}
                <div className="timeline__time">
                  {formatDate(item.created_at)}
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        ) : (
          <Timeline>
            <Timeline.Item color="green">
              <span className="timeline__title">Khởi tạo Giao dịch </span>
              <div className="timeline__time">
                {formatDate(data?.created_at)}
              </div>
            </Timeline.Item>
          </Timeline>
        )}
      </DivTimeline>
    </>
  );

  return (
    <HistoryStepbyStepWrapper className="box-df">
      {isLoading ? <Skeleton active paragraph={{ rows: 6 }} /> : pageContent}
    </HistoryStepbyStepWrapper>
  );
}

export const HistoryStepbyStepWrapper = styled(SectionWrapper)`
  width: 660px;
  margin-left: auto;
  margin-right: auto;
  .order-note {
    display: flex;
    margin-top: 12px;
    .ant-form-item {
      margin-bottom: 0;
      flex-grow: 1;
    }
    .ant-form-item-explain.ant-form-item-explain-error {
      min-height: unset;
      padding-top: 5px;
    }
  }
  .order-note__input {
    height: 40px;
    &.ant-input-affix-wrapper:focus {
      box-shadow: none;
    }
    .ant-input::placeholder {
      color: #bdbdbd;
    }
  }
  .order-note__btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 11px;
    width: 73px;
    height: 40px;
    flex-shrink: 0;
    background: ${({ theme }) => theme.darkBlue3};
    border-radius: 4px;
    color: #fff;
    border: none;
    .note-btn__title {
    }
    .note-submit-icon {
      margin-left: 7px;
    }
  }
`;

export const DivTimeline = styled.div`
  margin-top: 30px;
  .timeline__title {
    font-size: 14px;
    font-weight: 500;
  }
  .timeline__desc {
    font-size: 12px;
    .label {
      font-weight: bold;
      color: #333333;
    }
  }
  .timeline__time {
    font-size: 12px;
    color: ${({ theme }) => theme.gray3};
    padding-bottom: 10px;
    border-bottom: 1px dashed #ebebf0;
  }

  letter-spacing: 0.02rem;
  .ant-timeline-item {
    /* margin-top: 28px; */
    padding-bottom: 12px;
  }
  .ant-timeline-item-head {
    color: #6fcf97;
    border-color: #6fcf97;
    background: #6fcf97;
    width: 20px;
    height: 20px;
    border: 4px solid #fff;
  }
  .ant-timeline-item-tail {
    left: 10px;
    border-left: 1px solid #6fcf97;
  }
  .ant-timeline-item-content {
    margin-left: 34px;
  }
  .ant-timeline-item:first-child .ant-timeline-item-head {
    border-color: #e4fcee;
  }
  .fulfillment-status {
    padding: 0;
    width: unset;
    &:before {
      display: none;
    }
  }
`;
