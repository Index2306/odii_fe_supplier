import React from 'react';
import { Timeline } from 'antd';
// import { useDispatch } from 'react-redux';
// import { Form } from 'app/components';
import { isEmpty } from 'lodash';
import { CustomH4 } from 'styles/commons';
import styled from 'styled-components/macro';
import { formatDate } from 'utils/helpers';

export default function HistoryStepbyStep({
  data,
  t,
  isLoading,
  dataTimelineFormat,
}) {
  const pageContent = (
    <>
      <DivTimeline>
        <CustomH4 mb={{ xs: 's8' }}>Lịch sử giao dịch</CustomH4>
        {!isEmpty(dataTimelineFormat) ? (
          <Timeline>
            {dataTimelineFormat.map((item, index) => (
              <Timeline.Item key={index} color="green">
                <span className="timeline__title">
                  {item.title ? item.title : item.note}
                </span>
                {(item.note || item.short_description) && (
                  <div className="timeline__desc">
                    <span className="label">Nội dung: </span>
                    {item?.note || item?.short_description}
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
              <span className="timeline__title">Khởi tạo giao dịch </span>
              <div className="timeline__time">
                {formatDate(data?.created_at)}
              </div>
            </Timeline.Item>
          </Timeline>
        )}
      </DivTimeline>
    </>
  );

  return <>{pageContent}</>;
}

const DivTimeline = styled.div`
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
    p {
      margin-bottom: 2px;
    }
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
