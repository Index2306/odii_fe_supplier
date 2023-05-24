import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Timeline, Skeleton, Form, Button } from 'antd';
import { Input } from 'app/components';
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

const Item = Form.Item;

export default function HistoryStepbyStep({ data, isLoading }) {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const dataTimeline = useSelector(selectTimeline);
  const [dataTimelineFormat, setDataTimelineFormat] = useState([]);

  const inputNoteName = 'input-note';

  useEffect(() => {
    if (!isEmpty(dataTimeline)) {
      const temp = dataTimeline.map(item => {
        return {
          ...item,
          title: item.metadata?.confirm_status
            ? t(
                `accountant.titleHistoryTransaction.deposit.${item.metadata?.confirm_status}`,
              )
            : item.metadata?.status
            ? t(
                `accountant.titleHistoryTransaction.deposit.${item.metadata?.status}`,
              )
            : '',
        };
      });
      setDataTimelineFormat(temp);
    }
  }, [dataTimeline]);

  const submitNote = async () => {
    var note = form.getFieldsValue()[inputNoteName].trim();
    // const response = await request(`oms/seller/order/${data.id}/comment`, {
    //   method: 'post',
    //   data: {
    //     note: note,
    //   },
    // });
    // if (response.is_success) {
    //   fetchOrderTimeLine();
    //   form.resetFields();
    // }
  };

  const pageContent = (
    <>
      <div>
        <CustomH3 className="section-title">Lịch sử</CustomH3>
        <Form
          form={form}
          name="profile"
          scrollToFirstError
          onFinish={submitNote}
        >
          <div className="order-note">
            <Item
              name={inputNoteName}
              rules={[
                {
                  required: true,
                  message: 'Nội dung ghi chú không được để trống',
                },
                { min: 8, message: 'Nội dung ghi chú ít nhất 8 kí tự' },
              ]}
            >
              <Input
                placeholder="Thêm nội dung ghi chú"
                className="order-note__input"
                allowClear
                size="medium"
              />
            </Item>
            <Button
              type="primary"
              className="order-note__btn"
              htmlType="submit"
            >
              <span className="note-btn__title font-df">Gửi</span>
              <svg
                className="note-submit-icon"
                width="12"
                height="13"
                viewBox="0 0 12 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.1211 6.48522C11.121 6.32891 11.0793 6.17543 11.0003 6.04058C10.9212 5.90573 10.8077 5.79436 10.6713 5.71794L1.38724 0.51883C1.23103 0.43135 1.05184 0.393631 0.873628 0.410717C0.695411 0.427803 0.526654 0.498878 0.389914 0.614444C0.253174 0.730009 0.154965 0.884559 0.108413 1.05744C0.0618623 1.23031 0.0691868 1.41328 0.129408 1.58188L1.72355 6.04549L5.86515 6.04549C5.98178 6.04549 6.09363 6.09181 6.17609 6.17428C6.25856 6.25675 6.30489 6.36859 6.30489 6.48522C6.30489 6.60184 6.25856 6.71369 6.17609 6.79616C6.09363 6.87862 5.98178 6.92495 5.86515 6.92495L1.72355 6.92495L0.129408 11.3886C0.0725379 11.5448 0.0615734 11.7141 0.0978092 11.8764C0.134045 12.0387 0.215969 12.1872 0.333904 12.3045C0.351704 12.3223 0.370377 12.3394 0.389923 12.356C0.526187 12.4725 0.695034 12.5442 0.873486 12.5613C1.05194 12.5784 1.23133 12.5401 1.38724 12.4516L10.6713 7.2525C10.8077 7.17604 10.9212 7.06467 11.0002 6.92983C11.0793 6.79498 11.121 6.64152 11.1211 6.48522Z"
                  fill="white"
                />
              </svg>
            </Button>
          </div>
        </Form>
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
              <span className="timeline__title">
                Khởi tạo yêu cầu nạp tiền{' '}
              </span>
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
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} className="loading" />
      ) : (
        pageContent
      )}
    </HistoryStepbyStepWrapper>
  );
}

export const HistoryStepbyStepWrapper = styled(SectionWrapper)`
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
      color: ${({ theme }) => theme.gray3};
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
