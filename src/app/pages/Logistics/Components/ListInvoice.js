import React, { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CustomH3 } from 'styles/commons';
import { Row, Col, Spin, Dropdown, Menu } from 'antd';
import { Table, BoxColor, Button } from 'app/components';
import FilterBar from '../Features/FilterBar';
import { useWarehouseImportSlice } from '../slice';
import { selectData, selectPagination } from '../slice/selectors';
import moment from 'moment';
import { COMBINE_STATUS, RECALL_TIME } from '../constants';
import { MoreOutlined } from '@ant-design/icons';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import { Link } from 'react-router-dom';
import { WarningRecall } from './styled';
import { sum } from 'lodash';
import { formatMoney } from 'utils/helpers';

const { Item } = Menu;

export default function ListInvoice({ isLoading, history }) {
  const dispatch = useDispatch();
  const { actions } = useWarehouseImportSlice();
  const data = useSelector(selectData);
  const pagination = useSelector(selectPagination);
  const userSup = useSelector(selectCurrentUser);

  const gotoPage = (data = '') => {
    dispatch(actions.getData(data));
  };

  const ActionMenu = record => {
    return (
      <Menu style={{ width: 150 }}>
        <Item
          onClick={() => history.push(`/logistics/import/detail/${record.id}`)}
        >
          Chi tiết
        </Item>
        {((record?.status === 'inactive' &&
          record?.publish_status === 'inactive') ||
          (record?.status === 'inactive' &&
            record?.publish_status === 'draft')) &&
          userSup.id === record.user_created_id && (
            <Item onClick={() => onCancelProduct(record)}>Xóa</Item>
          )}
        {record.time_recall &&
          record.status === 'active' &&
          record.publish_status === 'active' &&
          checkRecallTime(record.time_recall) === 0 &&
          !record.user_recall_id && (
            <Item
              onClick={() =>
                history.push({
                  pathname: '/export/detail',
                  search: '?page=1&page_size=10',
                  state: { warehouse_import_id: record.id },
                })
              }
            >
              Tạo phiếu thu hồi
            </Item>
          )}
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

  const checkRecallTime = tỉme => {
    if (new Date(tỉme) < new Date()) {
      return 0;
    }
    return Math.abs(new Date(tỉme) - new Date()) / 1000 / 60 / 60 / 24;
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
              to={`/logistics/import/detail/${record.id}`}
            >
              {_text}
            </Link>
          );
        },
      },
      {
        title: (
          <div className="custom-header">
            <div className="title-box">Lý do nhập</div>
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
            <div className="title-box">Người nhập</div>
          </div>
        ),
        dataIndex: 'user_import_name',
        width: 150,
        key: 'user_import_name',
        align: 'center',
        render: (_text, record) => (
          <>
            <div>{_text}</div>
            <div>{moment(record.time_import).format('HH:mm DD/MM/YYYY')}</div>
          </>
        ),
      },
      {
        title: (
          <div className="custom-header">
            <div className="title-box">Kho nhập</div>
          </div>
        ),
        dataIndex: 'supplier_warehousing_name',
        width: 200,
        key: 'supplier_warehousing_name',
        align: 'center',
        render: _text => _text,
      },
      {
        title: (
          <div className="custom-header">
            <div className="title-box">Sô lượng sản phẩm</div>
          </div>
        ),
        dataIndex: 'approved_by',
        width: 150,
        key: 'approved_by',
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
        dataIndex: 'approved_by',
        width: 150,
        key: 'approved_by',
        align: 'center',
        render: (_text, record) =>
          formatMoney(
            sum(
              record.products?.map(
                item => item.total_price * item.total_quantity,
              ),
            ),
          ),
      },
      {
        title: (
          <div className="custom-header">
            <div className="title-box">Trạng thái</div>
          </div>
        ),
        dataIndex: 'status',
        width: 200,
        key: 'status',
        align: 'center',
        render: (_text, record) =>
          checkRecallTime(record.time_recall) <= RECALL_TIME &&
          record.status === 'active' &&
          record.publish_status === 'active' &&
          record.time_recall ? (
            record.user_recall_id ? (
              'Đã thu hồi'
            ) : (
              <>
                {checkRecallTime(record.time_recall) === 0
                  ? 'Đã hết thời gian lưu kho'
                  : 'Sắp hết thời gian lưu kho'}
              </>
            )
          ) : (
            <>
              {
                COMBINE_STATUS[`${record.status}/${record.publish_status}`]
                  ?.label
              }
            </>
          ),
      },
      {
        title: (
          <div className="custom-header">
            <div className="title-box">Người duyệt</div>
          </div>
        ),
        dataIndex: 'time_approved',
        width: 140,
        key: 'time_approved',
        align: 'center',
        render: (_text, record) => (
          <div
            className="d-flex"
            style={{ alignItems: 'center', justifyContent: 'end' }}
          >
            {_text && (
              <BoxColor
                width="100%"
                background="none"
                colorValue={
                  COMBINE_STATUS[`${record.status}/${record.publish_status}`]
                    ?.colorLabel
                }
              >
                {moment(_text).format('HH:mm DD/MM/YYYY')}
              </BoxColor>
            )}
            {record.approved_by && (
              <WarningRecall>{record.approved_by}</WarningRecall>
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
