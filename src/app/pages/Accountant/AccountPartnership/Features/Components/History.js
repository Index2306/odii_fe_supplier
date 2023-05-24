import React, { memo } from 'react';
import {
  Row,
  Col,
  Input,
  Form as F,
  Timeline,
  Upload,
  message,
  Skeleton,
} from 'antd';
import {
  PaperClipOutlined,
  SmileOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { SectionWrapper, CustomStyle, CustomH3 } from 'styles/commons';
import styled from 'styled-components';
import CustomInput from 'app/components/commons/Input/styles';
import { Button } from 'app/components';
// import { ReactComponent as VectorIcon } from 'assets/images/icons/vector.svg';
import { PicturesWall, UploadFile } from 'app/components/Uploads';
import Form from 'antd/lib/form/Form';

const Item = F.Item;

export default function History({ data, isLoading, dataTimelineFormat }) {
  const [form] = F.useForm();
  const props = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded thành công`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload thất bại.`);
      }
    },
  };
  const suffix = props => (
    <>
      <div className="suffix">
        <div role="button">
          <Upload listType="picture" {...props}>
            <PaperClipOutlined />
          </Upload>
        </div>
      </div>
    </>
  );

  return (
    <SectionWrapper>
      <CustomH3>Lịch sử</CustomH3>
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 10 }} className="loading" />
      ) : (
        <CustomRow>
          <Col xs={24} md={24}>
            <Form form={form} name="profile" scrollToFirstError>
              <div className="note-wrapper">
                <CustomInput
                  placeholder="Thêm nội dung ghi chú"
                  suffix={suffix({ ...props })}
                />
                <div style={{ width: '100px' }}>
                  <CustomButton>
                    {/* Gửi <VectorIcon style={{ marginLeft: '9px' }} /> */}
                  </CustomButton>
                </div>
              </div>
            </Form>
            <CustomStyle>
              <DivTimeline>
                <Timeline>
                  <Timeline.Item color="green">
                    <span className="timeline__title">Đã thanh toán</span>
                    <div className="timeline__time">
                      <span>19:46, Thứ năm 01-07-2021</span>
                    </div>
                  </Timeline.Item>
                </Timeline>
                <Timeline>
                  <Timeline.Item color="green">
                    <span className="timeline__title">
                      Kế toán - Thùy Trang đã thêm ghi chú{' '}
                    </span>
                    <div className="timeline__time">
                      <span>19:46, Thứ năm 01-07-2021</span>
                    </div>
                    <div className="timeline__desc">
                      <span className="label">Nội dung:</span>
                      kế toán trường vui lòng kiểm tra lại thông tin KH giúp em!
                    </div>
                  </Timeline.Item>
                </Timeline>
              </DivTimeline>
            </CustomStyle>
          </Col>
        </CustomRow>
      )}
    </SectionWrapper>
  );
}

const CustomRow = styled(Row)`
  .note-wrapper {
    display: flex;
    .ant-input-suffix {
      .suffix {
          width: 100%;
          display: flex;
          justify-content: space-between;
          & span {
            cursor: pointer;
          }
          .ant-upload {
            display: flex;
            justify-content: end;
          }
          .ant-upload-list {
            display: flex;
            justify-content: space-evenly;
            margin-top: 14px;
            .ant-upload-list-item-name {
              display: none;
            }
          }
          // .ant-upload-list-item {
          //   display: flex;
          //   right: 37rem;
          //   margin-top: 16px;
          //   top: 4px;
          // }
           .ant-popover-inner-content {
              border-radius: 6px;
           }
        }
        & svg {
          font-size: 20px;
        }
        .emoji {
          .clear-fix {
            display: flex;
            flex-wrapper: wrap;
          }
        }
      }
    }
  }
`;

const CustomButton = styled(Button)`
  margin-left: 16px;
  width: 90%;
  height: 40px;
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
