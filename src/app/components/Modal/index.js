/* eslint-disable no-unused-expressions */

import React, { useState, useEffect } from 'react';
import { Modal, Space } from 'antd';
import { Button } from 'app/components';
import { useDispatch } from 'react-redux';
import Styled from 'styled-components';
import { useGlobalSlice } from 'app/pages/AppPrivate/slice';
import { CustomStyle } from 'styles/commons';
import Wrapper from './Wrapper';

const CustomModal = ({
  children,
  title = '',
  callBackOk = () => null,
  callBackCancel = () => null,
  isOpen,
  needWait = false,
  disableOk,
  ...res
}) => {
  const [isModalVisible, setIsModalVisible] = useState(isOpen ?? true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof isOpen === 'boolean') setIsModalVisible(isOpen);
  }, [isOpen]);

  const { actions } = useGlobalSlice();
  const dispatch = useDispatch();
  const handleOk = e => {
    if (needWait) {
      setLoading(true);
      async () => {
        try {
          callBackOk(e);
          setLoading(true);
          setTimeout(() => {
            setIsModalVisible(false);
          }, 500);
        } catch (err) {
          setLoading(false);
        }
      };
    } else {
      callBackOk(e);
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    callBackCancel();
    setIsModalVisible(false);
    dispatch(actions.hideModal());
  };

  return (
    <>
      <CustomStyleModal
        title={title || ''}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <CustomStyle my={{ xs: 's4' }}>
            <Space>
              <Button
                key="back"
                className="btn-sm"
                onClick={handleCancel}
                color="grayBlue"
              >
                Hủy
              </Button>
              <Button
                loading={loading}
                disabled={disableOk}
                className="btn-sm"
                onClick={handleOk}
              >
                Xác nhận
              </Button>
            </Space>
          </CustomStyle>,
        ]}
        {...res}
      >
        {children}
      </CustomStyleModal>
    </>
  );
};

const CustomStyleModal = Styled(Modal)`
&.modal-1 {
  ..ant-modal-content {
    border-radius: 6px;
  }
  .ant-modal-body {
    padding: 0 24px;
  }
  .ant-modal-body, .ant-modal-header, .ant-modal-footer {
    border: none;
    background: ${({ theme }) => theme.background};
  }
  .ant-modal-header {
    border-radius: 6px 6px 0 0;
  }
  .ant-modal-footer {
    border-radius: 0 0 6px 6px;
  }
}
`;

export default Wrapper(CustomModal);
