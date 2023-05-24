import React, { useState, useEffect } from 'react';
import { Timeline, Skeleton } from 'antd';
import { OrderHistoryWrapper } from '../../styles/OrderDetail';
import { isEmpty } from 'lodash';
import { Input, BoxColor } from 'app/components';
import constants from 'assets/constants';
import request from 'utils/request';
import * as moment from 'moment';

export default function OrderHistory({ orderData, orderId }) {
  const [isLoadingInternal, setLoadingInternal] = useState(false);
  const [orderTimeline, setOrderTimeline] = useState([]);

  const isLoadingPage = isLoadingInternal || isEmpty(orderData);
  useEffect(() => {
    fetchOrderTimeLine();
  }, []);

  const getFirstOrderTime = () => {
    if (isEmpty(orderData)) {
      return [];
    }
    return {
      short_description: 'Tiếp nhận đơn hàng',
      created_at: orderData.created_at,
    };
  };

  const fetchOrderTimeLine = async () => {
    setLoadingInternal(true);
    const response = await request(`oms/seller/order/${orderId}/timeline`, {
      method: 'get',
    });
    if (response.is_success) {
      setOrderTimeline(response.data);
    }
    setLoadingInternal(false);
  };

  const getAllOrderTimeLine = () => {
    return [...(orderTimeline || []), getFirstOrderTime()];
  };

  const getFulfillmentStatus = fulfillmentStatusId => {
    return constants.ORDER_FULFILLMENT_STATUS[
      fulfillmentStatusId?.toUpperCase()
    ];
  };

  const getTimelineTitle = timeline => {
    let title;
    switch (timeline?.action) {
      case 'comment':
        title = timeline.note;
        break;
      default:
        const fulfillmentStatusId = timeline?.metadata?.fulfillment_status;
        const fulfillmentStatus =
          fulfillmentStatusId && getFulfillmentStatus(fulfillmentStatusId);
        const fulfillmentStatusDesc = fulfillmentStatus && (
          <>
            . Trạng thái:&nbsp;
            <BoxColor
              className="fulfillment-status font-df"
              notBackground
              colorValue={fulfillmentStatus?.color}
            >
              {fulfillmentStatus?.name || ''}
            </BoxColor>
          </>
        );
        title = (
          <>
            {timeline.short_description}
            {fulfillmentStatusDesc || ''}
          </>
        );
        break;
    }
    // return timeline.action === 'comment'
    //   ? 'Ghi chú: ' + timeline.note
    //   : timeline.short_description ;
    return title;
  };

  const formatDate = dateStr => {
    const date = moment(dateStr);
    const dateFormatted = date.format('HH:mm DD/MM/YYYY');
    const dayNumber = date.weekday();
    const days = [
      'Chủ nhật',
      'Thứ hai',
      'Thứ ba',
      'Thứ tư',
      'Thứ năm',
      'Thứ sáu',
      'Thứ bảy',
    ];
    const sliceIndex = 5;
    return (
      dateFormatted.slice(0, sliceIndex) +
      ', ' +
      days[dayNumber] +
      dateFormatted.slice(sliceIndex)
    );
  };

  const pageContent = isLoadingPage ? (
    <Skeleton active paragraph={{ rows: 4 }} />
  ) : (
    <>
      <div className="order-history__top">
        <div>
          <span className="section-title">Lịch sử đơn hàng</span>
        </div>
      </div>
      <div className="store-info_content">
        <div className="order-timeline">
          <Timeline>
            {getAllOrderTimeLine().map((item, index) => (
              <Timeline.Item key={index} color="green">
                <p className="timeline__title">{getTimelineTitle(item)}</p>
                <p className="timeline__desc">{formatDate(item.created_at)}</p>
              </Timeline.Item>
            ))}
          </Timeline>
        </div>
      </div>
    </>
  );

  return (
    <OrderHistoryWrapper className="box-df">{pageContent}</OrderHistoryWrapper>
  );
}
