import React, { memo, useRef, useState } from 'react';
import { Row, Col } from 'antd';
import { Input, Button } from 'app/components';
import {
  SearchOutlined,
  DeleteOutlined,
  LockOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import Filter from 'app/hooks/Filter';
import { useSelector, useDispatch } from 'react-redux';
import { selectListSelected } from '../slice/selectors';
import { useEmployeesSlice } from '../slice';
import Confirm from 'app/components/Modal/Confirm';

const initState = {
  keyword: '',
  // status: '',
  // dateString: '',
};

const CONFIRM_MODAL_DELETE_PARTNER = 'CONFIRM_MODAL_DELETE_PARTNER';
const CONFIRM_MODAL_LOCKUP_PARTNER = 'CONFIRM_MODAL_LOCKUP_PARTNER';

const FilterBar = memo(function FilterBar({ isLoading, showAction }) {
  const dispatch = useDispatch();
  const { actions } = useEmployeesSlice();
  const listSelected = useSelector(selectListSelected);

  const [filter, setFilter] = useState(initState);
  const [currModalKey, setCurrModalKey] = useState(null);

  const ref = useRef(null);

  const dataModals = [
    {
      key: CONFIRM_MODAL_DELETE_PARTNER,
      getContent: () => (
        <Confirm
          key={CONFIRM_MODAL_DELETE_PARTNER}
          isFullWidthBtn
          isModalVisible={true}
          color="blue"
          title="Xác nhận xóa nhân viên"
          data={{
            message: getConfirmMessageDelete(),
          }}
          handleConfirm={handleDelete}
          handleCancel={() => toggleConfirmModal(CONFIRM_MODAL_DELETE_PARTNER)}
        />
      ),
    },
    {
      key: CONFIRM_MODAL_LOCKUP_PARTNER,
      getContent: () => (
        <Confirm
          key={CONFIRM_MODAL_LOCKUP_PARTNER}
          isFullWidthBtn
          isModalVisible={true}
          color="blue"
          title="Xác nhận tạm khóa nhân viên"
          data={{
            message: getConfirmMessageLockUp(),
          }}
          handleConfirm={handleLockup}
          handleCancel={() => toggleConfirmModal(CONFIRM_MODAL_LOCKUP_PARTNER)}
        />
      ),
    },
  ];

  const toggleConfirmModal = modalKey => {
    if (currModalKey) {
      setCurrModalKey(null);
    } else {
      setCurrModalKey(modalKey);
    }
  };

  const getConfirmMessageDelete = () => {
    return (
      <>
        <span>
          Nếu xóa các tài khoản nhân viên này, các tài khoản này sẽ không đăng
          nhập được nữa. Tiếp tục ?
        </span>
      </>
    );
  };

  const getConfirmMessageLockUp = () => {
    return (
      <>
        <span>
          Nếu khóa các tài khoản nhân viên này, các tài khoản này sẽ không có
          quyền hạn trong hệ thống nữa. Tiếp tục ?
        </span>
      </>
    );
  };

  const handleFilter = (type, needRefresh) => e => {
    const value = (e?.target?.value ?? e) || '';
    const values = { ...filter, [type]: value };
    if (e.type === 'click' || needRefresh) {
      if (ref.current) {
        ref.current.callBack(values);
      }
    }
    setFilter(values);
  };

  const handleDelete = () => {
    dispatch(
      actions.deleteEmployee({
        data: {
          user_ids: listSelected,
        },
      }),
    );
    toggleConfirmModal(CONFIRM_MODAL_DELETE_PARTNER);
  };

  const handleLockup = () => {
    dispatch(
      actions.updateStatusUser({
        data: {
          user_ids: listSelected,
          status: 'inactive',
        },
      }),
    );
    toggleConfirmModal(CONFIRM_MODAL_LOCKUP_PARTNER);
  };

  return (
    <>
      <Filter
        initState={initState}
        filter={filter}
        setFilter={setFilter}
        ref={ref}
      >
        <CustomRow gutter={8}>
          <Col xs={24} lg={6}>
            <Input
              allowClear
              size="medium"
              className="input-keyword"
              style={{ width: '100%' }}
              placeholder="Tìm nhân viên"
              disabled={isLoading}
              prefix={<SearchOutlined />}
              value={filter.keyword}
              onChange={handleFilter('keyword')}
            />
          </Col>
          <CustomCol>
            {showAction && (
              <Button
                className="btn btn-lockup"
                onClick={() => toggleConfirmModal(CONFIRM_MODAL_LOCKUP_PARTNER)}
                color="white"
                width="68"
                disabled={isLoading}
              >
                <LockOutlined /> <span>Khóa nhân viên</span>
              </Button>
            )}
          </CustomCol>
          <CustomCol>
            {showAction && (
              <Button
                className="btn btn-delete"
                onClick={() => toggleConfirmModal(CONFIRM_MODAL_DELETE_PARTNER)}
                color="white"
                width="68"
                disabled={isLoading}
              >
                <DeleteOutlined /> <span>Xóa</span>
              </Button>
            )}
          </CustomCol>
        </CustomRow>
      </Filter>
      {dataModals.map(
        modal => currModalKey === modal.key && modal.getContent({}),
      )}
    </>
  );
});

const CustomRow = styled(Row)`
  .anticon-search {
    vertical-align: 0;
  }
  .input-keyword {
    border: 1px solid #ebebf0;
  }
`;

const CustomCol = styled(Col)`
  margin-left: 16px;
  padding-left: 0;
  .btn {
    height: 36px;
    border: 1px solid #ebebf0;
    box-sizing: border-box;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    span {
      font-weight: 500;
      margin-left: 6px;
    }
    &-delete {
      color: #eb5757;
    }
    &-lockup {
      color: #3d56a6;
    }
  }
`;
export default FilterBar;
