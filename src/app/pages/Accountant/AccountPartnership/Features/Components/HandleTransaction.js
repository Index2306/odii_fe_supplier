import React, { memo, useState, useEffect } from 'react';
import { Row, Col, Modal, Checkbox, Skeleton } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { BoxColor, Button, Form, Input } from 'app/components';
import { CustomH3, CustomStyle, SectionWrapper } from 'styles/commons';
import '../Components/Style/handletransaction.css';
import { useSelector, useDispatch } from 'react-redux';
import { useAffiliateSlice } from '../../slice/index';
import constants from 'assets/constants';

const { TextArea } = Input;
const Item = Form.Item;

const Reasons = [
  {
    id: 2,
    label: 'Thông tin tên và số tài khoản không khớp',
    value: 'Thông tin tên và số tài khoản không khớp',
  },
  {
    id: 3,
    label: 'Số tiền chưa được đối soát',
    value: 'Số tiền chưa được đối soát',
  },
  { id: 1, label: 'Lí do khác', value: 'Lí do khác' },
];

export default memo(function HandleTransaction({ data, id, isLoading }) {
  const [form] = Form.useForm();
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModalReject, setVisibleModalReject] = useState('');
  const dispatch = useDispatch();
  const { actions } = useAffiliateSlice();
  const [reasonReject, setReasonReject] = useState('');
  const { setFieldsValue, getFieldsValue } = form;

  const handleApprovePayment = () => {
    setVisibleModal(true);
  };

  const handleTransactionNeedCheck = () => {
    setVisibleModalReject(true);
  };
  const onClose = () => {
    setVisibleModal(false);
    setVisibleModalReject(false);
  };

  const handleAppraiseAccountantPartner = async type => {
    dispatch(
      actions.TransferStatusAffilliateDetail({
        id,
        data: {
          ...data,
          // status: 'active',
          payment_status: type === 'active' ? 'active' : 'reject',
          note:
            type === 'active'
              ? getFieldsValue().note
                ? ' ,' + getFieldsValue().note
                : ''
              : type === 'reject'
              ? reasonReject +
                (getFieldsValue().note ? ' ,' + getFieldsValue().note : '')
              : '',
        },
      }),
    );
    onClose();
  };

  const onChangeReason = reasons => {
    setReasonReject(reasons);
  };

  return (
    <CustomSectionWrapper mt={{ xs: 's4' }}>
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 3 }} className="loading" />
      ) : (
        <div>
          <CustomH3>Xử lí giao dịch</CustomH3>
          <DivStyle>
            <div className="handle-transaction__status-payment">
              <span>Trạng thái</span>
              {data?.isPaid ? (
                <BoxColor
                  notBackground
                  style={{ width: '130px' }}
                  colorValue={'#52c41a'}
                >
                  Đã thanh toán
                </BoxColor>
              ) : (
                <BoxColor notBackground style={{ width: '130px' }}>
                  Chờ thanh toán
                </BoxColor>
              )}
            </div>
            <div className="handle-transaction__btn-wrapper">
              <Button
                type="primary"
                //   onClick={handleReject}
                className="btn-md"
                size="middle"
                onClick={handleApprovePayment}
              >
                Xác nhận đã thanh toán
              </Button>
              <Button
                context="secondary"
                color="orange"
                className="btn-md mt-3 btn-cancel"
                onClick={handleTransactionNeedCheck}
              >
                <span>Giao dịch cần kiểm tra</span>
              </Button>
            </div>
          </DivStyle>
        </div>
      )}
      {/* Modal */}

      <Modal
        name="modal-approve"
        visible={visibleModal}
        footer={null}
        onCancel={onClose}
      >
        <Form
          form={form}
          name="form-approve"
          onFinish={() => handleAppraiseAccountantPartner('active')}
        >
          <CustomDiv>
            <CheckCircleOutlined className="icon icon-check" />
            <div>
              <div className="title-modal">Xác nhận đã thanh toán</div>
              <div className="desc-modal">
                Hành động này không thể thu hồi. Bạn chắc chắn vẫn xác nhận?
              </div>
            </div>
          </CustomDiv>
          <CustomItemModal
            name="note"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập ghi chú',
              },
            ]}
          >
            <TextArea
              className="textArea"
              style={{ minHeight: '120px' }}
              placeholder="Thêm nội dung ghi chú"
            />
          </CustomItemModal>

          <CustomItemModal>
            <Button
              type="primary"
              className="btn-sm btn-action"
              color="blue"
              htmlType="submit"
            >
              Xác nhận thanh toán
            </Button>
          </CustomItemModal>
        </Form>
      </Modal>

      {/* Modal check transaction */}
      <Modal
        name="modal-reject"
        visible={visibleModalReject}
        footer={null}
        onCancel={onClose}
      >
        <Form
          form={form}
          name="form-reject"
          onFinish={() => handleAppraiseAccountantPartner('reject')}
        >
          <CustomDiv>
            <CloseCircleOutlined className="icon icon-close" />
            <div>
              <div className="title-modal">Xác nhận GD cần kiểm tra</div>
              <div className="desc-modal">
                Hành động này không thể thu hồi. Bạn chắc chắn từ chối giao
                dịch?
              </div>
            </div>
          </CustomDiv>
          <CustomItemModal
            name="reason"
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <div className="title-reason">Lý do từ chối ?</div>
            <Checkbox.Group options={Reasons} onChange={onChangeReason} />
          </CustomItemModal>
          <CustomItemModal
            name="note"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập ghi chú',
              },
            ]}
          >
            <TextArea
              className="textArea"
              style={{ minHeight: '120px' }}
              placeholder="Nhập ghi chú hoặc lí do từ chối vào đây"
            />
          </CustomItemModal>

          <CustomItemModal>
            <Button
              type="primary"
              className="btn-sm btn-action"
              color="red"
              htmlType="submit"
              // onClick={onClose}
            >
              Xác nhận từ chối !
            </Button>
          </CustomItemModal>
        </Form>
      </Modal>
    </CustomSectionWrapper>
  );
});

const CustomSectionWrapper = styled(SectionWrapper)`
  //   .ant-modal-content {
  //     border-radius: 20px;
  //   }

  //   .ant-modal-header {
  //     border-radius: 20px;
  //   }
`;
const DivStyle = styled(CustomStyle)`
  .handle-transaction__status-payment {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    & span {
      color: #333333;
    }
    & li {
      color: red !important;
    }
  }
  .handle-transaction__btn-wrapper {
    padding: 8px 0;
    margin-top: 10px;
    & button {
      width: 100%;
    }
    .btn-cancel {
      & span {
        color: red;
      }
      &:hover {
        & span {
          color: white;
        }
      }
    }
  }
`;

const CustomDiv = styled.div`
  display: flex;
  margin-bottom: 12px;
  .icon {
    margin-right: 8px;
    svg {
      width: 20px;
      height: 20px;
    }
  }
  .icon-check {
    color: #27ae60;
  }
  .icon-close {
    color: #eb5757;
  }
  .title-modal {
    font-weight: bold;
    font-size: 18px;
    line-height: 21px;
    margin-bottom: 6px;
  }
  .desc-modal {
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
  }
`;

const CustomItemModal = styled(Item)`
  // display: flex;
  // justify-content: flex-end;
  // .item-modal__btn-cancel {
  //   margin-right: 17px;
  //   background-color: #6c798f;
  //   // color: #ffffff;
  // }
  margin-top: 24px;
  .title-reason {
    margin-bottom: 10px;
  }
  .ant-checkbox-group {
    .ant-checkbox-group-item {
      margin-bottom: 8px;
      &:last-child {
        margin-bottom: 20px;
      }
    }
    .ant-checkbox-inner {
      border-radius: 4px;
    }
    .ant-checkbox-checked .ant-checkbox-inner {
      background-color: #3d56a6;
      border-color: #3d56a6;
    }
    .ant-checkbox-group-item + .ant-checkbox-group-item {
      width: 100%;
    }
  }
  textarea {
    min-height: 120px;
    border-radius: 6px;
    border: 1px solid #ebebf0;
  }
  .btn-action {
    margin-left: auto;
  }
`;
