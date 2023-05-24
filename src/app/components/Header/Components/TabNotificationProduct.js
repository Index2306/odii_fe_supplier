import React, { memo, useState, useEffect } from 'react';
import { bell } from 'assets/images/icons';
import { Link } from 'react-router-dom';
import { formatDate } from 'utils/helpers';
import { Spin } from 'antd';
import { isEmpty } from 'lodash';
import request from 'utils/request';

export default memo(function TabNotificationProduct({
  SectionEmptyNotify,
  updateStatusReadAll,
  onlyShowUnRead,
  updateStatusReadAndRedirect,
  SectionEmptyNotifyUnread,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pageSize, setPageSize] = useState(8);
  const [notifyProduct, setNotifyProduct] = useState(null);
  const [idsNotify, setIdsNotify] = useState([]);

  const fetchNotifyProduct = async () => {
    const url = `common-service/notifications?page=1&page_size=${pageSize}&type=product`;
    const response = await request(url, {
      method: 'get',
    })
      .then(response => {
        if (response?.data) setNotifyProduct(response?.data);
      })
      .catch(error => setIsError(true));
  };

  useEffect(() => {
    fetchNotifyProduct();
  }, []);

  useEffect(() => {
    const filterIds = () => {
      let temp = [];
      if (!isEmpty(notifyProduct)) {
        notifyProduct.map((item, index) => {
          if (item.read_status === 'unread') temp.push(item.id);
        });
      }
      setIdsNotify(temp);
    };
    filterIds();
  }, [notifyProduct]);

  useEffect(() => {
    fetchNotifyProduct();
  }, [pageSize]);

  // useEffect(() => {
  //   const delaySecond = 2000;
  //   let reloadPageInterval;
  //   let reloadPageTimeout;
  //   reloadPageTimeout = setTimeout(() => {
  //     reloadPageInterval = setInterval(() => {
  //       fetchNotifyProduct();
  //     }, delaySecond);
  //   }, delaySecond);
  //   return () => {
  //     clearInterval(reloadPageInterval);
  //     clearTimeout(reloadPageTimeout);
  //   };
  // }, []);

  const handleUpdateStatus = async () => {
    await updateStatusReadAll(idsNotify);
    await fetchNotifyProduct();
  };

  const handleShowMore = () => {
    setIsLoading(true);
    const delaySecond = 1000;
    let loadingTimeout;
    loadingTimeout = setTimeout(() => {
      setPageSize(pageSize + 8);
      setIsLoading(false);
    }, delaySecond);
    return () => {
      clearTimeout(loadingTimeout);
    };
  };
  const pageContent = !isEmpty(notifyProduct) ? (
    <>
      <div className="action">
        <div className="notify-new">Mới nhất</div>
        <div className="mark-as-read" onClick={handleUpdateStatus}>
          Đánh dấu đã đọc
        </div>
      </div>
      <div className="list-notification">
        {onlyShowUnRead
          ? notifyProduct.filter(temp => temp.read_status === 'unread')
              .length >= 1
            ? notifyProduct
                .filter(temp => temp.read_status === 'unread')
                .map((item, index) => (
                  <div
                    key={index}
                    className="item-notification unread"
                    onClick={() => updateStatusReadAndRedirect(item, {})}
                  >
                    <div className="notify-img">
                      <img src={item.img ? item.img : bell} alt="" />
                    </div>
                    <div className="notify-content">
                      <div className="mb-8">
                        Bạn có sản phẩm
                        <Link to=""> #{item?.data_id} </Link>
                        {item?.metadata?.status === 'failed'
                          ? 'đã bị'
                          : 'đã được'}{' '}
                        <span
                          className={
                            item?.metadata?.status === 'failed'
                              ? 'txt-highline--red'
                              : 'txt-highline--green'
                          }
                        >
                          {item?.metadata?.status === 'failed'
                            ? 'từ chối.'
                            : 'duyệt.'}
                        </span>
                      </div>
                      <div className="notify-time">
                        {formatDate(item?.created_at)}
                      </div>
                    </div>
                    <div
                      className={
                        item?.read_status === 'unread'
                          ? 'dot-unread'
                          : 'dot-unread hide'
                      }
                    ></div>
                  </div>
                ))
            : SectionEmptyNotifyUnread()
          : notifyProduct.map((item, index) => (
              <div
                key={index}
                className={
                  item?.read_status === 'unread'
                    ? 'item-notification unread'
                    : 'item-notification'
                }
                onClick={() => updateStatusReadAndRedirect(item, {})}
              >
                <div className="notify-img">
                  <img src={item.img ? item.img : bell} alt="" />
                </div>
                <div className="notify-content">
                  <div className="mb-8">
                    Bạn có sản phẩm
                    <Link to=""> #{item?.data_id} </Link>
                    {item?.metadata?.status === 'failed'
                      ? 'đã bị'
                      : 'đã được'}{' '}
                    <span
                      className={
                        item?.metadata?.status === 'failed'
                          ? 'txt-highline--red'
                          : 'txt-highline--green'
                      }
                    >
                      {item?.metadata?.status === 'failed'
                        ? 'từ chối.'
                        : 'duyệt.'}
                    </span>
                  </div>
                  <div className="notify-time">
                    {formatDate(item?.created_at)}
                  </div>
                </div>
                <div
                  className={
                    item?.read_status === 'unread' ? 'dot-unread' : 'hide'
                  }
                ></div>
              </div>
            ))}
      </div>
      {notifyProduct.length < 8 || (
        <div className="show-more" onClick={handleShowMore}>
          Xem thêm
        </div>
      )}
      {isLoading && (
        <div className="loading-show-more">
          <Spin />
        </div>
      )}
    </>
  ) : (
    SectionEmptyNotify()
  );

  return (
    <>
      {notifyProduct ? (
        pageContent
      ) : (
        <div className="loading">
          {!isError ? (
            <Spin tip="Đang tải..." />
          ) : (
            <>
              Lỗi không xác định !
              <br /> Mong khách hàng thông cảm{' '}
            </>
          )}
        </div>
        //   <div className="loading">
        //     <Spin tip="Đang tải..." />
        // </div>
      )}
    </>
  );
});
