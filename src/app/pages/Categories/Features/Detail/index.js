import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import styled from 'styled-components/macro';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { Row, Col, Spin } from 'antd';
import { selectLoading, selectDetail } from '../../slice/selectors';
import { useCategoriesSlice } from '../../slice';
import { Button, PageWrapper } from 'app/components';

import { CustomH3, SectionWrapper } from 'styles/commons';

export function Detail({ match, history }) {
  const id = match?.params?.id;
  const dispatch = useDispatch();
  const { actions } = useCategoriesSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectDetail);
  useEffect(() => {
    dispatch(actions.getDetail(id));
    dispatch(
      globalActions.setDataBreadcrumb({
        menus: [
          {
            name: 'Danh mục',
          },
          {
            name: 'Chi Tiết',
          },
        ],
        title: 'Chi tiết danh mục',
      }),
    );
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
    };
  }, []);

  const goBack = () => {
    history.push('/categories');
  };
  const goUpdate = () => {
    history.push(`/categories/uc/${id}`);
  };

  return (
    <>
      <PageWrapper>
        <Spin tip="Đang tải..." spinning={isLoading}>
          <Row gutter={24}>
            <Col span={24}>
              <div className="d-flex justify-content-between">
                <Button onClick={goBack} className="btn-sm" color="green">
                  <span>Trở về</span>
                </Button>
                <Button onClick={goUpdate} className="btn-sm" color="green">
                  <span>Cập nhật</span>
                </Button>
              </div>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24}>
              <SectionWrapper mt={{ xs: 's4' }}>
                <CustomH3 mb={{ xs: 's4' }}>Chi tiết danh mục</CustomH3>
                <div className="">
                  <Row>
                    <b>Tên:</b> &ensp; {data?.name}
                  </Row>
                  <Row>
                    <b>Thumb:</b> &ensp; {data?.thumb}
                  </Row>
                  <Row>
                    <b>Mô tả:</b> &ensp; {data?.description}
                  </Row>
                  <Row>
                    <b>ID Cha:</b> &ensp; {data?.parent_id}
                  </Row>
                  <Row>
                    <b>Khởi tạo:</b> &ensp; {data?.created_at}
                  </Row>
                  <Row>
                    <b>Khởi tạo:</b> &ensp; {data?.created_at}
                  </Row>
                </div>
              </SectionWrapper>
            </Col>
          </Row>
        </Spin>
      </PageWrapper>
    </>
  );
}
