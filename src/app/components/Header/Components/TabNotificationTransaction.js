import React, { useState, useEffect } from 'react';
import { bell } from 'assets/images/icons';
import { Link } from 'react-router-dom';
import { formatDate } from 'utils/helpers';

import { Spin } from 'antd';
import { isEmpty } from 'lodash';
import request from 'utils/request';

export default function TabNotificationTransaction({
  SectionEmptyNotify,
  updateStatusReadAll,
  onlyShowUnRead,
  updateStatusReadAndRedirect,
  SectionEmptyNotifyUnread,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pageSize, setPageSize] = useState(8);
  const [notifyTransaction, setNotifyTransaction] = useState(null);
  const [idsNotify, setIdsNotify] = useState([]);

  const fetchNotifyTransaction = async () => {
    const url = `common-service/notifications?page=1&page_size=${pageSize}&type=transaction`;
    const response = await request(url, {
      method: 'get',
    })
      .then(response => {
        if (response?.data) setNotifyTransaction(response?.data);
      })
      .catch(error => setIsError(true));
  };

  useEffect(() => {
    fetchNotifyTransaction();
  }, []);

  useEffect(() => {
    const filterIds = () => {
      let temp = [];
      if (!isEmpty(notifyTransaction)) {
        notifyTransaction.map((item, index) => {
          if (item.read_status === 'unread') temp.push(item.id);
        });
      }
      setIdsNotify(temp);
    };
    filterIds();
  }, [notifyTransaction]);

  useEffect(() => {
    fetchNotifyTransaction();
  }, [pageSize]);

  const handleUpdateStatus = async () => {
    await updateStatusReadAll(idsNotify);
    await fetchNotifyTransaction();
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

  const pageContent = !isEmpty(notifyTransaction) ? (
    <>
      <div className="action">
        <div className="notify-new">Mới nhất</div>
        <div className="mark-as-read" onClick={handleUpdateStatus}>
          Đánh dấu đã đọc
        </div>
      </div>
      <div className="list-notification">
        {onlyShowUnRead
          ? notifyTransaction.filter(temp => temp.read_status === 'unread')
              .length >= 1
            ? notifyTransaction
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
                      {item?.metadata?.status ? (
                        <div className="mb-8">
                          Giao dịch
                          <Link to=""> #{item?.data_id} </Link>
                          của bạn đã được Admin xác nhận{' '}
                          <span
                            className={
                              item?.metadata?.status === 'failed'
                                ? 'txt-highline--red'
                                : 'txt-highline--green'
                            }
                          >
                            {item?.metadata?.status === 'failed'
                              ? 'từ chối.'
                              : 'thành công.'}
                          </span>
                        </div>
                      ) : (
                        <div className="mb-8">
                          {item?.metadata?.method === 'deposit'
                            ? 'Bạn vừa thực hiện nạp tiền '
                            : 'Bạn vừa thực hiện rút tiền '}
                          <span
                            className={
                              item?.metadata?.method === 'deposit'
                                ? 'txt-highline--green'
                                : 'txt-highline--red'
                            }
                          >
                            + {item?.metadata?.amount}
                          </span>{' '}
                          {item?.metadata?.method === 'deposit'
                            ? 'vào tài khoản.'
                            : 'từ tài khoản'}
                        </div>
                      )}
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
          : notifyTransaction.map((item, index) => (
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
                  {item?.metadata?.status ? (
                    <div className="mb-8">
                      Giao dịch
                      <Link to=""> #{item?.data_id} </Link>
                      của bạn vừa được Admin xác nhận{' '}
                      <span
                        className={
                          item?.metadata?.status === 'failed'
                            ? 'txt-highline--red'
                            : 'txt-highline--green'
                        }
                      >
                        {item?.metadata?.status === 'failed'
                          ? 'từ chối.'
                          : 'thành công.'}
                      </span>
                    </div>
                  ) : (
                    <div className="mb-8">
                      {item?.metadata?.method === 'deposit'
                        ? 'Bạn vừa thực hiện nạp tiền '
                        : 'Bạn vừa thực hiện rút tiền '}
                      <span
                        className={
                          item?.metadata?.method === 'deposit'
                            ? 'txt-highline--green'
                            : 'txt-highline--red'
                        }
                      >
                        {item?.metadata?.method === 'deposit' ? '+' : ''}
                        {item?.metadata?.amount}
                      </span>{' '}
                      {item?.metadata?.method === 'deposit'
                        ? 'vào tài khoản.'
                        : 'từ tài khoản'}
                    </div>
                  )}
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
      {notifyTransaction.length < 8 || (
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
      {notifyTransaction ? (
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
}
