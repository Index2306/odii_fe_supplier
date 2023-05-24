import React, { useState } from 'react';
import { Input, Button } from 'app/components';
import styled from 'styled-components';

const SecurityCode: React.FC = () => {
  const [value, setValue] = useState('');
  const [check, setCheck] = useState(false);

  const handleChange = e => {
    setValue(e.target.value);
  };

  const onValidCode = () => {
    if (value === process.env.REACT_APP_SECURITY_CODE) {
      setCheck(false);
      localStorage.setItem('securityCode', process.env.REACT_APP_SECURITY_CODE);
      window.location.href = '/auth/signin';
    } else {
      setCheck(true);
    }
  };

  return (
    <CustomModal>
      <div>
        <div className="title">
          Bạn cần nhập mã code bảo mật để dùng thử hệ thống Odii
        </div>
        <Input
          placeholder="Nhập mã bảo mật"
          allowClear
          size="medium"
          color="primary"
          onChange={handleChange}
        />
        {check && <div className="alert">Mã bảo mật không đúng !</div>}
      </div>
      <div className="btn-security">
        <Button className="btn-sm p-0" width="80px" onClick={onValidCode}>
          Xác nhận
        </Button>
      </div>
    </CustomModal>
  );
};

export default SecurityCode;

const CustomModal = styled.div`
  display: flex;
  margin: 0 auto;
  flex-direction: column;
  background: white;
  height: 200px;
  width: 500px;
  padding: 20px;
  border-radius: 20px;
  justify-content: space-around;

  .btn-security {
    display: flex;
    justify-content: end;
  }
  .title {
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 500;
  }
  .alert {
    color: red;
    font-size: 12px;
    margin-top: 7px;
    margin-left: 5px;
  }
`;
