import React, { memo } from 'react';
import { CustomSectionWrapper, WrapOrder } from '../styles';
import { CustomStyle } from 'styles/commons';
import { Row, Col, Tooltip } from 'antd';
import request from 'utils/request';
// import { useSelector, useDispatch } from 'react-redux';
import {
  newOrder,
  processOrder,
  doneOrder,
  failOrder,
} from 'assets/images/dashboards';
import { FilterBar } from '../Component';
import { tooltip } from 'assets/images/dashboards';
// import { selectListStores } from '../slice/selectors';

const dataOrder = [
  {
    icon: newOrder,
    title: 'Đơn mới',
    total: 'order_new',
    hint: 'Số lượng đơn hàng mới',
    // percent: '+7%',
  },
  {
    icon: processOrder,
    title: 'Đang tiến hành',
    total: 'order_pending',
    hint: 'Số lượng đơn hàng đang được tiến hành',
    // percent: '+7%',
  },
  {
    icon: doneOrder,
    title: 'Đã hoàn tất',
    total: 'order_success',
    hint: 'Số lượng đơn hàng đã hoàn thành',
    // percent: '+9%',
  },
  {
    icon: failOrder,
    title: 'Đã hủy',
    total: 'order_cancelled',
    hint: 'Số lượng đơn hàng đã bị hủy',
    // percent: '-3%',
    colorBox: '#EB5757',
  },
];

export default memo(function Order() {
  const [order, setOrder] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);

  const getData = params => {
    setIsLoading(true);
    request(`oms/supplier/order-stats-by-time`, { params })
      .then(result => {
        setIsLoading(false);
        setOrder(result?.data ?? {});
      })
      .catch(err => {
        setIsLoading(false);
      });
  };

  return (
    <CustomSectionWrapper>
      <CustomStyle
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={{ xs: 's8' }}
      >
        <CustomStyle className="title">
          Đơn hàng
          <Tooltip
            placement="right"
            title={'Thống kê số lượng đơn hàng theo từng giai đoạn'}
          >
            <img className="tooltip" src={tooltip} alt="" />
          </Tooltip>
        </CustomStyle>
        <CustomStyle>
          <FilterBar isLoading={isLoading} getData={getData} />
        </CustomStyle>
      </CustomStyle>
      <Row>
        {dataOrder.map(item => (
          <Col span={6}>
            <WrapOrder colorBox={item.colorBox}>
              <CustomStyle marginRight={{ xs: 's4' }}>
                <img src={item.icon} alt="" />
              </CustomStyle>
              <CustomStyle
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
              >
                <CustomStyle color="#828282" fontWeight={400}>
                  {item.title}
                  <Tooltip placement="right" title={item.hint}>
                    <img className="tooltip" src={tooltip} alt="" />
                  </Tooltip>
                </CustomStyle>
                <CustomStyle display="flex">
                  <span className="number">{order[item.total] || 0}</span>
                  {/* <span className="box">{item.percent}</span> */}
                </CustomStyle>
              </CustomStyle>
            </WrapOrder>
          </Col>
        ))}
      </Row>
    </CustomSectionWrapper>
  );
});
