/**
 *
 * Header
 *
 */
import * as React from 'react';
import { useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
import {
  useSelector,
  //  useDispatch
} from 'react-redux';
// import { useHistory } from 'react-router-dom';
import { Button, Image } from 'app/components';
import { Popover, Badge, Tabs, Switch, Divider } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import { CustomStyle } from 'styles/commons';
import { user } from 'assets/images/icons';
import { bellNotification } from 'assets/images';
import { IconUser, IconSignOut, IconStore } from 'assets/images/header';
import { MenuOutlined } from '@ant-design/icons';
import constants from 'assets/constants';
import {
  TabNotificationOrder,
  TabNotificationTransaction,
  TabNotificationProduct,
  TabNotificationCommon,
} from './Components';
import {
  CustomHeader,
  DivNotify,
  WrapperBadge,
  WrapperUserInfo,
  CustomDiv,
} from './styles';

const { TabPane } = Tabs;
const { roles } = constants;
export default function HeaderDefault(props) {
  // const { t } = useTranslation();
  // const dispatch = useDispatch();
  // const isLoading = useSelector(selectLoading);
  const currentUser = useSelector(selectCurrentUser);
  // const history = useHistory();

  const [dataCountNotify, setDataCountNotify] = useState([]);
  const [onlyShowUnRead, setOnlyShowUnRead] = useState(false);

  const fetchDataCountNotify = async () => {
    const url = 'common-service/count-notifications';
    const response = await request(url, {
      method: 'get',
    })
      .then(response => {
        if (!isEmpty(response?.data)) setDataCountNotify(response?.data);
      })
      .catch(error => error);
  };

  useEffect(() => {
    fetchDataCountNotify();
  }, []);

  useEffect(() => {
    const delaySecond = 60000;
    let reloadPageInterval;
    let reloadPageTimeout;
    reloadPageTimeout = setTimeout(() => {
      reloadPageInterval = setInterval(() => {
        fetchDataCountNotify();
      }, delaySecond);
    }, delaySecond);
    return () => {
      clearInterval(reloadPageInterval);
      clearTimeout(reloadPageTimeout);
    };
  }, []);

  const updateStatusReadAll = async values => {
    const url = 'common-service/notifications';
    const response = await request(url, {
      method: 'put',
      data: {
        message_ids: values,
      },
    })
      .then(response => {
        if (!isEmpty(response?.data));
      })
      .catch(error => error);

    await fetchDataCountNotify();
  };

  const updateStatusReadAndRedirect = async (record, onSuccessCalback) => {
    if (record.read_status === 'unread') {
      const url = `common-service/message/${record.id}`;
      const response = await request(url, {
        method: 'put',
      })
        .then(response => {
          if(response.is_success){
            setDataCountNotify(data => ({...data, total_noti_common: dataCountNotify.total_noti_common - 1, total_notifications: dataCountNotify.total_notifications - 1}))
            if (onSuccessCalback) onSuccessCalback()
          }
        })
        .catch(error => error);
    }
    if (record.type === 'transaction') {
      window.location.href = '/mywallet';
    } else if (record.type === 'order') {
      window.location.href = '/orders';
    } else if (record.type === 'product') {
      window.location.href = '/products';
    }
  };

  const goLogin = () => {
    localStorage.clear();
    window.location.href = '/auth/signin';
  };

  const goMyProfile = () => {
    window.location.href = '/myprofile';
  };

  const goInfoBusiness = () => {
    window.location.href = '/infobusiness';
  };

  const handleOnlyShowUnRead = () => {
    setOnlyShowUnRead(!onlyShowUnRead);
  };

  const SectionEmptyNotify = () => {
    return (
      <div className="notify-empty">
        <div className="empty-img">
          <img src={bellNotification} alt="" />
        </div>
        <div className="empty-title">Chưa có thông báo</div>
        <div className="empty-desc">
          Bạn chưa có thông báo nào trong vòng 30 ngày gần đây
        </div>
      </div>
    );
  };

  const SectionEmptyNotifyUnread = () => {
    return (
      <div className="notify-empty">
        <div className="empty-img">
          <img src={bellNotification} alt="" />
        </div>
        <div className="empty-title">Không có thông báo nào chưa đọc</div>
        <div className="empty-desc">
          Bạn đã đọc tất cả thông báo trong vòng 30 ngày gần nhất.
        </div>
      </div>
    );
  };

  const action = (
    <CustomDiv>
      <div className="item">
        <Button context="secondary" color="transparent" onClick={goMyProfile}>
          <div className="item-icon">
            <img src={IconUser} alt="" />
          </div>
          <span>&nbsp;Tài khoản&ensp;</span>
        </Button>
      </div>
      {/* <Divider /> */}
      {currentUser?.roles?.includes(roles.owner) && (
        <div className="item">
          <Button
            context="secondary"
            color="transparent"
            onClick={goInfoBusiness}
          >
            <div className="item-icon">
              <img src={IconStore} alt="" />
            </div>
            <span>&nbsp;Doanh nghiệp&ensp;</span>
          </Button>
        </div>
      )}

      {/* <Divider /> */}
      <div className="item logout">
        <Button context="secondary" color="transparent" onClick={goLogin}>
          <div className="item-icon">
            <img src={IconSignOut} alt="" />
          </div>
          <span>&nbsp;Đăng xuất</span>
        </Button>
      </div>
      <Divider />
      <div className="item">
        <CustomStyle textAlign="right" color="gray4" pr={{ xs: 's3' }}>
          Phiên bản: {process.env.REACT_APP_VERSION_APP}
        </CustomStyle>
      </div>
    </CustomDiv>
  );

  const notify = (
    <DivNotify>
      <div className="top">
        <div className="title">Thông báo</div>
        <div className="d-flex">
          <div className="title-switch">Hiển thị thông báo chưa đọc</div>
          <Switch onChange={handleOnlyShowUnRead} />
        </div>
      </div>
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <Badge
              count={
                !isEmpty(dataCountNotify)
                  ? dataCountNotify?.total_noti_orders
                  : 0
              }
            >
              Đơn hàng
            </Badge>
          }
          key="1"
        >
          <TabNotificationOrder
            SectionEmptyNotify={SectionEmptyNotify}
            updateStatusReadAll={updateStatusReadAll}
            onlyShowUnRead={onlyShowUnRead}
            updateStatusReadAndRedirect={updateStatusReadAndRedirect}
            SectionEmptyNotifyUnread={SectionEmptyNotifyUnread}
          />
        </TabPane>
        <TabPane
          tab={
            <Badge
              count={
                !isEmpty(dataCountNotify)
                  ? dataCountNotify?.total_noti_products
                  : 0
              }
            >
              Sản phẩm
            </Badge>
          }
          key="2"
        >
          <TabNotificationProduct
            SectionEmptyNotify={SectionEmptyNotify}
            updateStatusReadAll={updateStatusReadAll}
            onlyShowUnRead={onlyShowUnRead}
            updateStatusReadAndRedirect={updateStatusReadAndRedirect}
            SectionEmptyNotifyUnread={SectionEmptyNotifyUnread}
          />
        </TabPane>
        <TabPane
          tab={
            <Badge
              count={
                !isEmpty(dataCountNotify)
                  ? dataCountNotify?.total_noti_transactions
                  : 0
              }
            >
              Giao dịch
            </Badge>
          }
          key="3"
        >
          <TabNotificationTransaction
            SectionEmptyNotify={SectionEmptyNotify}
            updateStatusReadAll={updateStatusReadAll}
            onlyShowUnRead={onlyShowUnRead}
            updateStatusReadAndRedirect={updateStatusReadAndRedirect}
            SectionEmptyNotifyUnread={SectionEmptyNotifyUnread}
          />
        </TabPane>
        <TabPane
          tab={
            <Badge
              count={
                !isEmpty(dataCountNotify)
                  ? dataCountNotify?.total_noti_common
                  : 0
              }
            >
              Hệ thống
            </Badge>
          }
          key="4"
        >
          <TabNotificationCommon
            SectionEmptyNotify={SectionEmptyNotify}
            updateStatusReadAll={updateStatusReadAll}
            onlyShowUnRead={onlyShowUnRead}
            updateStatusReadAndRedirect={updateStatusReadAndRedirect}
            SectionEmptyNotifyUnread={SectionEmptyNotifyUnread}
          />
        </TabPane>
      </Tabs>
    </DivNotify>
  );
  return (
    <>
      <CustomHeader className="d-inline-flex justify-content-end align-items-center">
        <Popover
          // placement="bottom"
          content={notify}
          trigger="click"
          overlayClassName="popover-notify--global"
        >
          <WrapperBadge>
            <Badge count={dataCountNotify?.total_notifications}>
              <BellOutlined />
            </Badge>
          </WrapperBadge>
        </Popover>

        <Popover
          placement="bottomRight"
          content={action}
          trigger="click"
          overlayClassName="popover-action--global"
        >
          <WrapperUserInfo>
            <CustomStyle fontSize={{ xs: 'f2' }} color="grayBlue">
              <MenuOutlined />
            </CustomStyle>
            {currentUser?.avatar ? (
              <Image
                size="200x200"
                src={
                  currentUser?.avatar?.location
                    ? currentUser?.avatar?.location
                    : currentUser?.avatar?.origin
                }
              />
            ) : (
              <div className="default-image">
                <img src={user} alt="" />
              </div>
            )}
          </WrapperUserInfo>
        </Popover>
      </CustomHeader>
    </>
  );
}
