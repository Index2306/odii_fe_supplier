import React, { useMemo, useEffect } from 'react';
import { Row, Col, Spin } from 'antd';
import { Table, BoxColor, Button } from 'app/components';
import { CustomH3 } from 'styles/commons';
import FilterBar from '../features/FilterBar';
import { formatDateRange, formatMoney } from 'utils/helpers';
import { getDebtPeriodByKey } from 'utils/debt-period';
import { selectData, selectPaginationListPromotion } from '../slice/selectors';
import { useSelector, useDispatch } from 'react-redux';
import { usePromotionSlice } from '../slice';
import constants from 'assets/constants';

export default function ListPromotion({ isLoading, history }) {
  const { actions } = usePromotionSlice();
  const dispatch = useDispatch();
  const data = useSelector(selectData);
  const pagination = useSelector(selectPaginationListPromotion);

  const gotoPage = (data = '', isReload) => {
    let payload = isReload ? history?.location?.search : data;
    if (!payload) {
      payload = '?page=1&page_size=10';
    }
    dispatch(actions.getData(payload));
  };

  useEffect(() => {
    return () => {
      dispatch(actions.getDone({}));
    };
  }, []);

  const getVadidateStatus = (record, titleAppend) => {
    const currentStatus = constants.PROMOTION_STATUS.find(
      item => item.id === record,
    );
    return (
      <BoxColor colorValue={currentStatus.color} width="100%">
        {currentStatus.name}
      </BoxColor>
    );
  };

  const getRowAction = id => {
    return (
      <Button
        className="btn-sm"
        onClick={() => {
          history.push(`/promotion/detail/${id}`);
        }}
      >
        Chi tiết
      </Button>
    );
  };

  const getTimeApply = record => {
    const key = `${record.from_time}_${record.to_time}`;
    const debtPeriod = getDebtPeriodByKey(key);
    return (
      <>
        {formatDateRange(
          debtPeriod?.debt_period_start,
          debtPeriod?.debt_period_end,
        )}
      </>
    );
  };

  const columns = useMemo(
    () => [
      {
        title: (
          <div className="custom-header">
            <div className="title-box">STT</div>
          </div>
        ),
        dataIndex: 'name',
        width: 50,
        align: 'center',
        key: 'name',
        render: (_text, record, index) => {
          return <>{index + 1}</>;
        },
      },
      {
        title: (
          <div className="custom-header">
            <div className="title-box">Tên chương trình</div>
          </div>
        ),
        dataIndex: 'name',
        width: 250,
        key: 'name',
        render: (_text, record) => {
          return <>{record?.name}</>;
        },
      },
      {
        title: (
          <div className="custom-header">
            <div className="title-box">Thời gian áp dụng</div>
          </div>
        ),
        dataIndex: 'key',
        width: 200,
        key: 'key',
        align: 'center',
        render: (_text, record) => {
          return <>{getTimeApply(record)}</>;
        },
      },
      {
        title: (
          <div className="custom-header">
            <div className="title-box">Tổng tiền thực tế</div>
          </div>
        ),
        dataIndex: 'total_amount',
        width: 200,
        key: 'total_amount',
        align: 'center',
        render: (_text, record) => {
          return <>{formatMoney(_text || 0)}</>;
        },
      },
      {
        title: (
          <div className="custom-header">
            <div className="title-box">Phương thức khuyến mại</div>
          </div>
        ),
        dataIndex: 'type',
        width: 200,
        key: 'type',
        align: 'center',
        render: (_text, record) => {
          return (
            <>
              {_text.includes('product_by')
                ? 'Giảm giá trên từng sản phẩm'
                : 'Chiết khấu theo số lượng bán'}
            </>
          );
        },
      },
      {
        title: (
          <div className="custom-header">
            <div className="title-box">Trạng thái duyệt</div>
          </div>
        ),
        dataIndex: 'is_approve',
        width: 130,
        key: 'is_approve',
        align: 'center',
        render: (_text, record) => (
          <>
            <BoxColor
              width="100%"
              background="none"
              colorValue={_text ? 'green' : ''}
            >
              {_text ? 'Đã duyệt' : 'Chờ duyệt'}
            </BoxColor>
          </>
        ),
      },
      {
        title: (
          <div className="custom-header">
            <div className="title-box">Trạng thái hiệu lực</div>
          </div>
        ),
        dataIndex: 'status_validate',
        width: 130,
        key: 'name',
        align: 'center',
        render: (_text, record) => (
          <>
            <span>{getVadidateStatus(_text, 'hiệu lực')}</span>
            <div className="action-wrapper">{getRowAction(record?.id)}</div>
          </>
        ),
      },
    ],
    [data],
  );

  const pageContent = (
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
              actions={gotoPage}
              rowKey={record => record?.id}
            />
          </Col>
        </Row>
      </Spin>
    </>
  );

  return <>{pageContent}</>;
}
