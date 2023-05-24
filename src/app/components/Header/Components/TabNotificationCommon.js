import React, { useState, useEffect } from 'react';
import { bell } from 'assets/images/icons';
// import { Link } from 'react-router-dom';
import { formatDate } from 'utils/helpers';

import { Spin, Modal } from 'antd';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import styled from 'styled-components/macro';
import { bellNotification } from 'assets/images';

export default function TabNotificationCommon({
  SectionEmptyNotify,
  updateStatusReadAll,
  onlyShowUnRead,
  updateStatusReadAndRedirect,
  SectionEmptyNotifyUnread,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pageSize, setPageSize] = useState(8);
  const [notifyCommon, setNotifyCommon] = useState(null);
  const [idsNotify, setIdsNotify] = useState([]);
  const [isVisibleDetailNotify, setIsVisibleDetailNotify] = useState(false);
  const [record, setRecord] = useState('');

  const fetchNotifyCommon = async () => {
    const url = `common-service/notifications?page=1&page_size=${pageSize}&type=common`;
    const response = await request(url, {
      method: 'get',
    })
      .then(response => {
        if (response?.data) setNotifyCommon(response?.data);
      })
      .catch(error => setIsError(true));
  };

  useEffect(() => {
    fetchNotifyCommon();
  }, []);

  useEffect(() => {
    const filterIds = () => {
      let temp = [];
      if (!isEmpty(notifyCommon)) {
        notifyCommon.map((item, index) => {
          if (item.read_status === 'unread') temp.push(item.id);
        });
      }
      setIdsNotify(temp);
    };
    filterIds();
  }, [notifyCommon]);

  const updateStatusReadAndShowDetail = async record => {
    if (record.read_status === 'unread') {
      const url = `common-service/message/${record.id}`;
      const response = await request(url, {
        method: 'put',
      })
        .then(response => {
          if (!isEmpty(response?.data));
        })
        .catch(error => error);
    }
  };

  useEffect(() => {
    fetchNotifyCommon();
  }, [pageSize]);

  const handleUpdateStatus = async () => {
    await updateStatusReadAll(idsNotify);
    await fetchNotifyCommon();
  };

  const handleUpdateStatusAndShowDetail = async record => {
    if (record.read_status === 'unread') {
      updateStatusReadAndRedirect(record, async () => {
        await fetchNotifyCommon();
      });
    }
    setRecord(record);
    setIsVisibleDetailNotify(true);
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

  const pageContent = !isEmpty(notifyCommon) ? (
    <>
      <div className="action">
        <div className="notify-new">Mới nhất</div>
        <div className="mark-as-read" onClick={handleUpdateStatus}>
          Đánh dấu đã đọc
        </div>
      </div>
      <div className="list-notification">
        {onlyShowUnRead
          ? notifyCommon.filter(temp => temp.read_status === 'unread').length >=
            1
            ? notifyCommon
                .filter(temp => temp.read_status === 'unread')
                .map((item, index) => (
                  <div
                    key={index}
                    className="item-notification unread"
                    onClick={() => handleUpdateStatusAndShowDetail(item)}
                  >
                    <div className="notify-img">
                      <img className={item?.metadata?.thumb ? 'image' : 'bell'} src={item?.metadata?.thumb ? item?.metadata?.thumb.origin : bell} alt="" />
                    </div>
                    <div className="notify-content">
                      <div className="title">{item?.name}</div>
                      <div className="content">{item?.content}</div>
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
          : notifyCommon.map((item, index) => (
              <div
                key={index}
                className={
                  item?.read_status === 'unread'
                    ? 'item-notification unread'
                    : 'item-notification'
                }
                onClick={() => handleUpdateStatusAndShowDetail(item)}
              >
                <div className="notify-img">
                  <img className={item?.metadata?.thumb ? 'image' : 'bell'} src={item?.metadata?.thumb ? item?.metadata?.thumb.origin : bell} alt="" />
                </div>
                <div className="notify-content">
                  <div className="title">{item?.name}</div>
                  <div className="content">{item?.content}</div>
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
      {notifyCommon.length < 8 || (
        <div className="show-more" onClick={handleShowMore}>
          Xem thêm
        </div>
      )}
      {isLoading && (
        <div className="loading-show-more">
          <Spin />
        </div>
      )}
      <Modal
        name="modal-set-time-auto-send"
        visible={isVisibleDetailNotify}
        footer={null}
        // width={450}
        onCancel={() => setIsVisibleDetailNotify(false)}
      >
        <ContentModal>
        <img className="modal-img" src={bellNotification} alt="" />
          <div className="notify-title">{record.name}</div>
          {record.content 
          ? <div className="notify-content">{record?.metadata?.url 
            ? <a href={record?.metadata?.url} target='blank'>{record.content}</a> 
            : record.content}
            </div>
          : <div className="notify-url"><a href={record?.metadata?.url} target='blank'>{record?.metadata?.url}</a></div>}
          <div className="notify-date">{formatDate(record.created_at)}</div>
        </ContentModal>
      </Modal>
    </>
  ) : (
    SectionEmptyNotify()
  );

  return (
    <>
      {notifyCommon ? (
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

const ContentModal = styled.div`
  text-align: center;
  margin-top: 20px;
  .modal-img {
    width: 80px;
    display: flex;
    margin: auto;
  }
  .notify-title {
    font-weight: bold;
    font-size: 18px;
    line-height: 21px;
    margin-bottom: 6px;
  }
  .notify-content {
    line-height: 21px;
    margin: 24px 0 12px;
    text-align: start;
    white-space: pre-line;
    a{
      font-size: 14px;
      color: #333;
      white-space: pre-line;
      &:hover{
        color: #40a9ff;
        text-decoration: underline;
        opacity: 0.8;
      }
    }
  }
  .notify-date {
    font-size: 12px;
    color: #828282;
    line-height: 21px;
    text-align: start;
  }
  .notify-url {
    line-height: 21px;
    margin: 0px 0 12px;
    text-align: start;
    a{
      font-size: 14px;
      color: #333;
      &:hover{
        color: #40a9ff;
        text-decoration: underline;
        opacity: 0.8;
      }
    }
  }
`;
