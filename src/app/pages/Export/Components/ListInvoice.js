import React, { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CustomH3 } from 'styles/commons';
import { Row, Col, Spin, Dropdown, Menu } from 'antd';
import { Table, BoxColor, Button } from 'app/components';
import FilterBar from '../Features/FilterBar';
import { useWarehouseExportSlice } from '../slice';
import { selectData, selectPagination } from '../slice/selectors';
import moment from 'moment';
import {
  COMBINE_STATUS,
  ORDER_SUPPLIER_FULFILLMENT_STATUS,
} from '../constants';
import { sum } from 'lodash';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import { Link } from 'react-router-dom';
import { MoreOutlined } from '@ant-design/icons';
import { formatMoney } from 'utils/helpers';
import { CustomStyle } from 'styles/commons';

const { Item } = Menu;
const DEFAULT_STATUS = 'Đã thu hồi';

export default function ListInvoice({ isLoading, history }) {
  const dispatch = useDispatch();
  const { actions } = useWarehouseExportSlice();
  const data = useSelector(selectData);
  const pagination = useSelector(selectPagination);
  const userSup = useSelector(selectCurrentUser);

  const gotoPage = (data = '') => {
    dispatch(actions.getData(data));
  };

  const ActionMenu = record => {
    return (
      <Menu style={{ width: 150 }}>
        <Item onClick={() => history.push(`/export/detail/${record.id}`)}>
          Chi tiết
        </Item>
        <Item>
          {record.order_id ? (
            <Link to={`/orders/update/${record.order_id}`}>
              Chi tiết đơn hàng
            </Link>
          ) : (
            <Link to={`/logistics/import/detail/${record.warehouse_import_id}`}>
              Chi tiết phiếu nhập
            </Link>
          )}
        </Item>
      </Menu>
    );
  };

  const onCancelProduct = record => {
    let id = record.id;
    dispatch(
      actions.cancelWarehouseImport({
        id,
        onSuccess: () => gotoPage(history.location.search),
      }),
    );
    // gotoPage(history.location.search);
  };

  const columns = useMemo(
    () => [
      {
        title: (
          <div className="custom-header">
            <div className="title-box">Mã phiếu</div>
          </div>
        ),
        dataIndex: 'code',
        width: 120,
        key: 'code',
        render: (_text, record, index) => {
          return (
            <Link
              style={{ fontWeight: 'bold' }}
              to={`/export/detail/${record.id}`}
            >
              {_text}
            </Link>
          );
        },
      },
      {
        title: (
          <div className="custom-header">
            <div className="title-box">Lý do</div>
          </div>
        ),
        dataIndex: 'reason',
        width: 250,
        key: 'reason',
        render: (_text, record) => <>{_text}</>,
      },
      {
        title: (
          <div className="custom-header">
            <div className="title-box">Người duyệt</div>
          </div>
        ),
        dataIndex: 'user_export_name',
        width: 200,
        key: 'user_export_name',
        align: 'center',
        render: (_text, record) => (
          <>
            <div>{_text}</div>
            <div>
              {record.time_export &&
                moment(record.time_export).format('HH:mm DD/MM/YYYY')}
            </div>
          </>
        ),
      },
      // {
      //   title: (
      //     <div className="custom-header">
      //       <div className="title-box">Người tạo</div>
      //     </div>
      //   ),
      //   dataIndex: 'user_created_name',
      //   width: 200,
      //   key: 'user_created_name',
      //   align: 'center',
      //   render: (_text, record) => (
      //     <>
      //       <div>{_text}</div>
      //       <div>
      //         {record.created_at &&
      //           moment(record.created_at).format('HH:mm DD/MM/YYYY')}
      //       </div>
      //     </>
      //   ),
      // },
      {
        title: (
          <div className="custom-header">
            <div className="title-box">Sô lượng sản phẩm</div>
          </div>
        ),
        dataIndex: 'created_at',
        width: 200,
        key: 'created_at',
        align: 'center',
        render: (_text, record) =>
          sum(record.products?.map(item => item.total_quantity)),
      },
      {
        title: (
          <div className="custom-header">
            <div className="title-box">Giá trị hàng hóa</div>
          </div>
        ),
        dataIndex: 'total_price',
        width: 150,
        key: 'total_price',
        align: 'center',
        render: (_text, record) => formatMoney(_text),
      },
      {
        title: (
          <div className="custom-header">
            <div className="title-box">Trạng thái</div>
          </div>
        ),
        dataIndex: 'order_fulfillment_status',
        width: 200,
        key: 'order_fulfillment_status',
        align: 'center',
        render: (_text, record) => (
          <div
            className="d-flex"
            style={{
              alignItems: 'center',
              justifyContent: 'end',
              paddingLeft: 14,
            }}
          >
            {_text ? (
              <div
                className="d-flex"
                style={{
                  textTransform: 'uppercase',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                <CustomStyle
                  ml={{ xs: 's2' }}
                  fontSize={14}
                  fontWeight={600}
                  color={
                    ORDER_SUPPLIER_FULFILLMENT_STATUS[_text?.toUpperCase()]
                      .color
                  }
                >
                  {ORDER_SUPPLIER_FULFILLMENT_STATUS[_text?.toUpperCase()].name}
                </CustomStyle>
              </div>
            ) : (
              <div
                className="d-flex"
                style={{
                  textTransform: 'uppercase',
                  justifyContent: 'center',
                  width: '100%',
                  fontWeight: 600,
                  color: '#27AE60',
                }}
              >
                {DEFAULT_STATUS.toUpperCase()}
              </div>
            )}
            <Dropdown
              overlay={() => ActionMenu(record)}
              trigger={['hover']}
              placement="bottomRight"
              style={{ cursor: 'pointer' }}
            >
              <MoreOutlined style={{ cursor: 'pointer' }} />
            </Dropdown>
            {}
          </div>
        ),
      },
    ],
    [data],
  );

  return (
    <>
      <CustomH3 className="title text-left" mb={{ xs: 's5' }}>
        <FilterBar isLoading={isLoading} gotoPage={gotoPage} />
      </CustomH3>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <Row guiter={24}>
          <Col span={24}>
            <Table
              className="costom"
              columns={columns}
              data={{ data, pagination }}
              searchSchema={{
                keyword: {
                  required: false,
                },
                status_validate: {
                  required: false,
                },
              }}
              scroll={{ x: 1100 }}
              rowKey={record => record?.id}
              actions={gotoPage}
            />
          </Col>
        </Row>
      </Spin>
    </>
  );
}
