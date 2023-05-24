import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CustomStyle } from 'styles/commons';
// import { messages } from './messages';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import { flower } from 'assets/images/dashboards';
import {
  ImportantWork,
  ChartSell,
  //  Congratulation
} from './Features';
import { isEmpty } from 'lodash';
import request from 'utils/request';
import moment from 'moment';
import { CustomModal } from './Component';
import {
  CustomDivDashBroad,
  CustomSectionWrapper2,
  Banner,
  CustomWrapperPage,
} from './styles';
import ImageSvg from './image';
import PayBox from './Features/PayBox';
import TopProduct from './Features/TopProduct';
import Topsell from './Features/Topsell';

const MODAL_WELLCOME_REMIND = 'MODAL_WELLCOME_REMIND';
const MODAL_PENDING_REVIEW = 'MODAL_PENDING_REVIEW';
const MODAL_PENDING_REVIEW_AFTER_UPDATE = 'MODAL_PENDING_REVIEW_AFTER_UPDATE';
const MODAL_NOTIFICATION_REJECT = 'MODAL_NOTIFICATION_REJECT';
const MODAL_NOTIFICATION_INACTIVE = 'MODAL_NOTIFICATION_INACTIVE';

export function Dashboard({ history }) {
  const { t } = useTranslation();
  const userInfo = useSelector(selectCurrentUser);
  const currentUser = useSelector(selectCurrentUser);

  const [currModalKey, setCurrModalKey] = useState(null);
  const [dataSupplierProfile, setDataSupplierProfile] = useState('');
  const [isError, setIsError] = useState('');
  const [isShowBannerRemind, setIsShowBannerRemind] = useState('');
  const [dataNews, setDataNews] = useState([]);
  const [statusWork, setStatusWork] = React.useState({});

  // useEffect(() => {
  //   const getNews = async () => {
  //     const headers = {
  //       'Content-Type': 'application/json',
  //       Authorization:
  //         'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJpbnRlZ3JhdGUtYXBwIiwiaWF0IjpbMTY0MTE3NTYyNSwiMTY0MTE3NTYyNSJdLCJleHAiOjE2NzI3MTE2MjUsImF1ZCI6Im9kaWkudm4iLCJzdWIiOiJob2FuZ3R1YW4udmFsQGdtYWlsLmNvbSIsImlkIjoiMSIsIndlYnNpdGUiOiJvZGlpLnZuIn0.1bYK5yBcx3-S4fFKUHeG1zIFfqwkTdAQSbjL_HKAgbM',
  //     };
  //     await fetch('https://odii.vn/wp-json/odii-api/v1/posts?limit=3', {
  //       method: 'GET',
  //       // credentials: 'include',
  //       headers,
  //     })
  //       .then(result => result.json())
  //       .then(data => {
  //         setDataNews(data);
  //       })
  //       .catch(err => {
  //         console.log(err);
  //         setDataNews(FAKE_NEWS);
  //       });
  //   };
  //   getNews();
  // }, []);

  const dataModals = [
    {
      key: MODAL_WELLCOME_REMIND,
      getContent: () => (
        <CustomModal
          key={MODAL_WELLCOME_REMIND}
          visible={true}
          dataImg={flower}
          title={'Chúc mừng đăng ký thành công'}
          desc={
            'Cảm ơn bạn đã đăng ký và sử dụng dịch vụ của Odii. Bạn cần thực hiện cung cấp & xác thực doanh nghiệp của bạn trước khi sử dụng hệ thống.'
          }
          action={goSupplierSetting}
          btnAction={'Cung cấp thông tin doanh nghiệp'}
          handleCancel={() => toggleModal(MODAL_WELLCOME_REMIND)}
          btnCancel={'Bổ sung thông tin sau'}
        />
      ),
    },
    {
      key: MODAL_PENDING_REVIEW,
      getContent: () => (
        <CustomModal
          key={MODAL_PENDING_REVIEW}
          visible={true}
          onCancel={() => toggleModal(MODAL_PENDING_REVIEW)}
          dataImg={flower}
          title={'Bạn đã hoàn tất thông tin Doanh nghiệp'}
          desc={
            <>
              Cảm ơn bạn đã thực hiện cung cấp & xác thực thông tin doanh nghiệp
              của bạn. <br />
              Chúng tôi đang đánh giá và xác thực thông tin bạn cung cấp.
              <br />
              Vui lòng đợi thông báo hoặc liên hệ CSKH.
            </>
          }
          handleCancel={() => toggleModal(MODAL_PENDING_REVIEW)}
          btnCancel={'Tôi đã hiểu'}
        />
      ),
    },
    {
      key: MODAL_PENDING_REVIEW_AFTER_UPDATE,
      getContent: () => (
        <CustomModal
          key={MODAL_PENDING_REVIEW_AFTER_UPDATE}
          visible={true}
          onCancel={() => toggleModal(MODAL_PENDING_REVIEW_AFTER_UPDATE)}
          dataImg={flower}
          title={
            <>
              Thông tin Doanh nghiệp đang được <br />
              <span style={{ color: 'blue' }}>đánh giá lại</span>
            </>
          }
          desc={
            <>
              Cảm ơn bạn đã thực hiện cung cấp & xác thực lại thông tin doanh
              nghiệp của bạn. <br />
              Chúng tôi đang đánh giá và xác thực thông tin bạn cung cấp.
              <br />
              Vui lòng đợi thông báo hoặc liên hệ CSKH.
            </>
          }
          handleCancel={() => toggleModal(MODAL_PENDING_REVIEW_AFTER_UPDATE)}
          btnCancel={'Tôi đã hiểu'}
        />
      ),
    },
    {
      key: MODAL_NOTIFICATION_REJECT,
      getContent: () => (
        <CustomModal
          key={MODAL_NOTIFICATION_REJECT}
          visible={true}
          onCancel={() => toggleModal(MODAL_NOTIFICATION_REJECT)}
          // dataImg={null}
          title={
            <>
              Thông tin xác thực Doanh nghiệp
              <br />
              <span style={{ color: 'red' }}> bị từ chối</span>
            </>
          }
          desc={
            <>
              Thông tin xác thực doanh ngiệp chưa chính xác.
              {/* <br />
            Lý do :
            <br />
            {dataSupplierProfile?.note} */}
              <br />
              Bạn vui lòng kiểm tra và chỉnh sửa thông tin chính xác, hoặc liên
              hệ CSKH để được hỗ trợ.
            </>
          }
          action={goSupplierSetting}
          btnAction={'Chỉnh sửa thông tin doanh nghiệp'}
        />
      ),
    },
    {
      key: MODAL_NOTIFICATION_INACTIVE,
      getContent: () => (
        <CustomModal
          key={MODAL_NOTIFICATION_INACTIVE}
          visible={true}
          onCancel={() => toggleModal(MODAL_NOTIFICATION_INACTIVE)}
          // dataImg={null}
          title={'Tài khoản của bạn đã bị vô hiệu hóa'}
          desc={'Vui lòng liên hệ Admin hoặc CSKH để được hỗ trợ.'}
          handleCancel={() => toggleModal(MODAL_NOTIFICATION_INACTIVE)}
          btnCancel={'Tôi đã hiểu'}
        />
      ),
    },
  ];

  useEffect(() => {
    history.push('/dashboard');
  }, []);

  useEffect(() => {
    request(`user-service/supplier/profile`, {})
      .then(result => {
        setDataSupplierProfile(result?.data ?? {});
      })
      .catch(err => {
        setIsError(true);
      });
  }, []);

  useEffect(() => {
    request(`oms/supplier/status-work-report`)
      .then(result => {
        setStatusWork(result?.data ?? {});
      })
      .catch(err => {
        setIsError(true);
      });
  }, []);

  useEffect(() => {
    // if (!isEmpty(currentUser) && !isEmpty(dataSupplierProfile)) {
    if (!isEmpty(currentUser)) {
      if (
        currentUser?.status === 'active' &&
        currentUser?.supplier_status === 'inactive' &&
        dataSupplierProfile?.register_status === 'verified' &&
        isEmpty(dataSupplierProfile)
      ) {
        setIsShowBannerRemind(true);
        toggleModal(MODAL_WELLCOME_REMIND);
      } else if (
        currentUser?.status === 'active' &&
        currentUser?.supplier_status === 'inactive' &&
        dataSupplierProfile?.register_status === 'pending_for_review'
      ) {
        toggleModal(MODAL_PENDING_REVIEW);
      } else if (
        currentUser?.status === 'active' &&
        currentUser?.supplier_status === 'inactive' &&
        dataSupplierProfile?.register_status ===
        'pending_for_review_after_update'
      ) {
        toggleModal(MODAL_PENDING_REVIEW_AFTER_UPDATE);
      } else if (
        currentUser?.status === 'active' &&
        currentUser?.supplier_status === 'inactive' &&
        dataSupplierProfile?.register_status === 'reject'
      ) {
        toggleModal(MODAL_NOTIFICATION_REJECT);
      } else if (
        currentUser?.status === 'active' &&
        currentUser?.supplier_status === 'active' &&
        dataSupplierProfile?.status === 'inactive'
      ) {
        toggleModal(MODAL_NOTIFICATION_INACTIVE);
      } else {
        setIsShowBannerRemind(false);
      }
    } else if (isError) {
      setIsShowBannerRemind(true);
      toggleModal(MODAL_WELLCOME_REMIND);
    }
  }, [currentUser, dataSupplierProfile, isError]);

  const goSupplierSetting = () => {
    history.push({
      pathname: '/infobusiness',
    });
  };

  const toggleModal = modalKey => {
    setCurrModalKey(currModalKey ? null : modalKey);
  };

  return (
    <>
      {dataModals.map(
        modal => currModalKey === modal.key && modal.getContent({}),
      )}

      <CustomDivDashBroad>
        {isShowBannerRemind ? (
          <>
            <div className="notification-verify-info">
              Lưu ý: Bạn cần thực hiện xác thực thông tin doanh nghiệp để có thể
              bắt đầu sử dụng hệ thống.{' '}
              <span className="link" onClick={goSupplierSetting}>
                Xác thực ngay
              </span>
            </div>
            {/* <Congratulation /> */}
          </>
        ) : (
          ''
        )}
        <CustomWrapperPage fixWidth>
          <Banner>
            <svg
              className="background-header"
              width="1000"
              height="120"
              viewBox="0 0 1000 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="1000"
                height="120"
                rx="4"
                fill="url(#paint0_linear_2_95323)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_2_95323"
                  x1="130"
                  y1="-2.48875e-05"
                  x2="979.793"
                  y2="201.215"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#4D7CC2" />
                  <stop offset="1" stopColor="#3D56A6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="svg-image">
              <ImageSvg />
            </div>
            <div className="image-text">
              <CustomStyle mb={{ xs: 's2' }}>
                Xin chào {userInfo?.full_name},
              </CustomStyle>
              <CustomStyle fontWeight="medium" fontSize={{ xs: 'f5' }}>
                Chào mừng bạn đến với hệ thống Odii - Nhà cung cấp.
              </CustomStyle>
            </div>
            <div className="image-icon">
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.6"
                  d="M10.9375 0.625H1.3125C0.574219 0.625 0 1.22656 0 1.9375V11.5625C0 12.3008 0.574219 12.875 1.3125 12.875H10.9375C11.6484 12.875 12.25 12.3008 12.25 11.5625V1.9375C12.25 1.22656 11.6484 0.625 10.9375 0.625ZM2.51562 7.84375C2.32422 7.84375 2.1875 7.70703 2.1875 7.51562V5.98438C2.1875 5.82031 2.32422 5.65625 2.51562 5.65625H9.73438C9.89844 5.65625 10.0625 5.82031 10.0625 5.98438V7.51562C10.0625 7.70703 9.89844 7.84375 9.73438 7.84375H2.51562Z"
                  fill="white"
                />
              </svg>
            </div>
          </Banner>
          <ImportantWork data={statusWork} />
          <ChartSell />
          <PayBox />
          <TopProduct data={statusWork} />
          <Topsell />
        </CustomWrapperPage>
      </CustomDivDashBroad>
    </>
  );
}
