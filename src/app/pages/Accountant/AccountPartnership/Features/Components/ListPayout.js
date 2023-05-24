import React, { useMemo, useState } from 'react';
import { Row, Col, Spin } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Table,
  EmptyPage,
  BoxColor,
  Link,
  Avatar,
} from 'app/components';
import { CustomTitle, CustomStyle } from 'styles/commons';
// import { isEmpty } from 'lodash';
import styled from 'styled-components/macro';
import { UserOutlined } from '@ant-design/icons';
import {
  selectDataListPayout,
  selectPaginationListPayout,
  selectListSelected,
  selectShowEmptyPageListPayout,
} from '../../slice/selectors';
import { useAffiliateSlice } from '../../slice';
import { formatDate, formatVND } from 'utils/helpers';
import constants from 'assets/constants';
import { isEmpty } from 'lodash';
import { FilterBarListPayout } from '..';
// import { transaction } from 'assets/images/empty';

export default function ListPayout({ t, layout, isLoading }) {
  const dispatch = useDispatch();
  const { actions } = useAffiliateSlice();
  const pagination = useSelector(selectPaginationListPayout);
  const data = useSelector(selectDataListPayout);
  const listSelected = useSelector(selectListSelected);
  const showEmptyPage = useSelector(selectShowEmptyPageListPayout);
  const history = useHistory();
  const gotoPage = (data = '', isReload) => {
    dispatch(
      actions.getDataListPayout(isReload ? history.location.search : data),
    );
  };

  const rowSelection = {
    onChange: selectedRowKeys => {
      dispatch(actions.setListSelected(selectedRowKeys));
    },
  };

  const columns = [
    {
      title: 'Đối tác',
      width: 220,
      render: (_, record) => (
        <>
          <CustomAvatar
            src={record?.from_user?.avatar?.origin}
            icon={<UserOutlined />}
          />
          &emsp;
          <Link to={`/admins/detail/${record.id}/profile`}>
            {record?.from_user?.full_name || 'N/A'}
          </Link>
        </>
      ),
    },
    {
      title: 'Email',
      width: 180,
      render: (_, record) => <>{record?.from_user?.email}</>,
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 200,
      render: text => !!text && formatDate(text),
    },
    {
      title: 'Tổng đơn hàng',
      dataIndex: 'total_orders',
      key: 'total_orders',
      width: 100,
      render: text => text && <div className="referral">{text}</div>,
    },
    // {
    //   title: (
    //     <div className="custome-header">
    //       <div className="title-box">Tổng doanh số</div>
    //     </div>
    //   ),
    //   dataIndex: 'total_sale',
    //   key: 'total_sale',
    //   width: 100,
    //   render: text =>
    //     text && (
    //       <CustomStyle className="text-left">{formatVND(text)}đ</CustomStyle>
    //     ),
    // },
    {
      title: 'Hoa hồng thực nhận',
      dataIndex: 'commission',
      key: 'commission',
      width: 180,
      align: 'end',
      render: (text, record) => {
        return (
          <div
            style={{
              color: 'green',
            }}
          >
            &nbsp;
            {formatVND(Math.abs(text))} đ
          </div>
        );
      },
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'isPaid',
      key: 'isPaid',
      width: 200,
      align: 'center',
      render: (text, record) => {
        const currentStatus = constants.ACCOUNTANT_PARTNERSHIP_FULFILLMENT_STATUS.find(
          v => v.id === text,
        );
        return (
          <>
            {isEmpty(currentStatus) || (
              <BoxColor
                colorValue={currentStatus?.color}
                width="140px"
                notBackground
              >
                {currentStatus?.name}
              </BoxColor>
            )}
            {/* <div className="action-wrapper">{getRowActionHandle(record)}</div> */}
          </>
        );
      },
    },
    // {
    //   title: 'Trạng thái tài khoản',
    //   width: 160,
    //   align: 'center',
    //   render: (_, record) => {
    //     const currentStatus = constants.USER_STATUS.find(
    //       v => v.id === record.from_user.status,
    //     );
    //     return (
    //       <>
    //         {isEmpty(currentStatus) || (
    //           <BoxColor colorValue={currentStatus?.color} width="140px">
    //             {currentStatus?.name}
    //           </BoxColor>
    //         )}
    //         <div className="action-wrapper">{getRowAction(record)}</div>
    //       </>
    //     );
    //   },
    // },
    {
      title: 'Hành động',
      align: 'center',
      width: 340,
      render: (_, record) => {
        return (
          <>
            <div className="action-wrapper">{getRowActionHandle(record)}</div>
          </>
        );
      },
    },
  ];

  const getRowActionHandle = record => {
    return (
      <>
        <Button
          className="btn-sm"
          context="secondary"
          onClick={() => {
            history.push(
              `/accountant/partnership/${record.id}/${record.payout_affiliate_key}/listorder`,
            );
          }}
        >
          Danh sách đơn hàng
        </Button>
        <Button
          className="btn-sm"
          onClick={() => {
            history.push(`/accountant/partnership/${record.id}/detail`);
          }}
        >
          Xử lý thanh toán
        </Button>
      </>
    );
  };

  const pageContent = (
    <>
      <CustomStyle mb={{ xs: 's5' }}>
        <FilterBarListPayout isLoading={isLoading} gotoPage={gotoPage} />
      </CustomStyle>
      <Spin tip="Đang tải..." spinning={isLoading}>
        {/* {showEmptyPage ? (
          <>
            <div className="text-center">
              <img src={transaction} alt=""></img>
            </div>
            <div className="text-center">
              Chưa có đơn hàng phát sinh từ đối tác hoa hồng
            </div>
          </>
        ) : ( */}
        <Row gutter={24}>
          <Col span={24}>
            <Table
              className="table-custom"
              actions={gotoPage}
              columns={columns}
              rowSelection={{
                selectedRowKeys: listSelected,
                type: 'checkbox',
                ...rowSelection,
              }}
              searchSchema={{
                keyword: {
                  required: false,
                },
                from_date: {
                  required: false,
                },
                to_date: {
                  required: false,
                },
                isPaid: {
                  required: false,
                },
                payout_affiliate_key: {
                  required: false,
                },
              }}
              data={{ data, pagination }}
              scroll={{ x: 1100, y: 5000 }}
              rowKey={record => record.id}
            />
          </Col>
        </Row>
        {/* )} */}
      </Spin>
    </>
  );

  // if (showEmptyPage) {
  //   return (
  //     <>
  //       <CustomTitle
  //         height="calc(100vh - 120px)"
  //         className="d-flex flex-column"
  //       >
  //         <EmptyPage />
  //       </CustomTitle>
  //     </>
  //   );
  // }

  return <>{pageContent}</>;
}
const CustomAvatar = styled(Avatar)`
  width: 45px;
  height: 45px;
`;
