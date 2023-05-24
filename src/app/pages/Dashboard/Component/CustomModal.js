import React, { memo } from 'react';
import { Modal } from 'antd';
import { Button } from 'app/components';
import styled from 'styled-components/macro';

export default memo(function CustomModal({
  key,
  onCancel,
  dataImg,
  title,
  desc,
  action,
  btnAction,
  handleCancel,
  btnCancel,
  ...rest
}) {
  return (
    <>
      <CustomModalWrapper
        name={key}
        onCancel={onCancel ? onCancel : () => {}}
        title={null}
        footer={null}
        {...rest}
      >
        {dataImg && (
          <div className="modal__img-flower">
            <img src={dataImg} alt="" />
          </div>
        )}
        {title && <div className="modal__title">{title}</div>}
        {desc && <div className="modal__desc">{desc}</div>}
        {action && (
          <Button type="primary" className="btn-md modal__btn" onClick={action}>
            {btnAction}
          </Button>
        )}
        {handleCancel && (
          <div className="modal__btn-cancel" onClick={handleCancel}>
            {btnCancel}
          </div>
        )}
      </CustomModalWrapper>
    </>
  );
});

export const CustomModalWrapper = styled(Modal)`
  text-align: center;
  .ant-modal-close-x {
    display: none;
  }
  .ant-modal-content {
    width: 480px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.07);
    border-radius: 8px;
  }
  .ant-modal-body {
    padding: 36px 48px;
  }
  .modal {
    &__img-flower {
      width: 40px;
      height: 40px;
      margin: auto;
      img {
        width: 100%;
        height: auto;
      }
    }
    &__title {
      font-weight: bold;
      font-size: 20px;
      line-height: 24px;
      margin-top: 26px;
    }
    &__desc {
      font-size: 14px;
      line-height: 18px;
      font-weight: 400;
      color: #767676;
      margin-top: 12px;
    }
    &__btn {
      margin: auto;
      margin-top: 40px;
    }
    &__btn-cancel {
      margin: auto;
      margin-top: 20px;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: #3d56a6;
      cursor: pointer;
    }
  }
`;
