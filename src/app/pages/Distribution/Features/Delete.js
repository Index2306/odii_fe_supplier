import React from 'react';
import { Modal } from 'antd';
import Styled from 'styled-components';
import Button from '@components/Button';

const Wrapper = Styled.div`
text-align: center;
.title {
  color: #172B4D;
  font-weight: 700;
  font-size: 24px;
}
`;

export default function Delete({ data, isModalVisible, handleCancel }) {
  const handleDelete = () => {};

  return (
    <Modal
      title=""
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={null}
    >
      <Wrapper>
        <div className="title">Xác nhận gỡ quyền</div>
        <div className="mb-5 title">{data.ten}</div>
        <div className="text-danger font-weight-bold">
          Nếu gỡ quyền, tài khoản này sẽ không đăng nhập được nữa
        </div>
        <div className="font-weight-bold mb-4">Tiếp tục?</div>
        <div className="row justify-content-center">
          <div className="d-flex justify-content-between col-12 col-xl-6">
            <Button
              // onClick={onMenuClick(null, 2)}
              className="btn-md mr-2"
              context="secondary"
              onClick={handleCancel}
              color="blue"
            >
              <span>Hủy</span>
            </Button>
            <Button
              color="green"
              // type="primary"
              onClick={handleDelete}
              className="btn-md"
            >
              <span>Đồng ý</span>
            </Button>
          </div>
        </div>
      </Wrapper>
    </Modal>
  );
}
