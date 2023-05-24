import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { Spin } from 'antd';
import { selectLoading, selectDetail } from '../../slice/selectors';
import { useRevenueSlice } from '../../slice';
import { PageWrapper } from 'app/components';
import { Hint, History, InfoTransaction } from '../Components';

export function Detail({ match }) {
  // const { t } = useTranslation();
  const id = match?.params?.id;
  const dispatch = useDispatch();
  const { actions } = useRevenueSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectDetail);

  useEffect(() => {
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
      dispatch(actions.getDetailDone({}));
    };
  }, []);

  useEffect(() => {
    const dataBreadcrumb = {
      menus: [
        {
          name: 'Doanh thu',
          link: '/revenue',
        },
        {
          name: 'Chi tiết giao dịch',
        },
      ],
      title: '',
      status: '',
      fixWidth: true,
    };
    if (!isEmpty(data)) {
      dataBreadcrumb.title = data?.long_code;
      dataBreadcrumb.status = data?.confirm_status;
    } else {
      if (id) {
        dispatch(actions.getDetail(id));
        dispatch(actions.getTimeline(id));
      }
    }
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
  }, [data]);

  return (
    <PageWrapper fixWidth>
      <Spin tip="Đang tải..." spinning={isLoading}>
        {data?.status === 'confirmed' && (
          <Hint data={data} isLoading={isLoading}></Hint>
        )}
        <InfoTransaction data={data} isLoading={isLoading}></InfoTransaction>
        <History data={data} isLoading={isLoading}></History>
      </Spin>
    </PageWrapper>
  );
}
