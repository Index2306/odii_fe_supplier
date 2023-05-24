import React, { useImperativeHandle, forwardRef, useState } from 'react';
import Modal from './index';
import Styled from 'styled-components';
import Button from 'app/components/Button';
import { useGlobalSlice } from 'app/pages/AppPrivate/slice';
import { useDispatch } from 'react-redux';

export default forwardRef(function AlertDialog({}, ref) {
  const [visible, setVisible] = useState(false);
  const [dialogData, setDialogData] = useState({});
  const { actions } = useGlobalSlice();
  const dispatch = useDispatch();

  const CustomCancel = () => {
    setVisible(false);
    dispatch(actions.hideModal());
  };

  useImperativeHandle(ref, () => ({
    show: (title, message, color = '') => {
      setDialogData({
        title,
        message,
        color,
      });
      setVisible(true);
    },
  }));

  return (
    <Modal title="" visible={visible} onCancel={CustomCancel} footer={null}>
      <Wrapper>
        <div className="title">{dialogData.title}</div>
        <div className="font-weight-bold mb-4">{dialogData.message}</div>
        <div className="row justify-content-center">
          <div className="d-flex justify-content-center">
            <Button
              color={dialogData.color || 'green'}
              // type="primary"
              needWait
              onClick={CustomCancel}
              className="btn-md"
            >
              <span>Đồng ý</span>
            </Button>
          </div>
        </div>
      </Wrapper>
    </Modal>
  );
});

const Wrapper = Styled.div`
text-align: center;
.title {
  color: #172B4D;
  font-weight: 700;
  font-size: 24px;
}
`;
