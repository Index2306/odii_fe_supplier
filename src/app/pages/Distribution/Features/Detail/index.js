import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import styled from 'styled-components/macro';
import { Row, Col, Spin } from 'antd';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { selectLoading, selectDetail } from '../../slice/selectors';
import { useProductsSlice } from '../../slice';
import { Button, PageWrapper } from 'app/components';

import { SectionWrapper } from 'styles/commons';

export function Detail({ match, history }) {
  const id = match?.params?.id;
  const dispatch = useDispatch();
  const { actions } = useProductsSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectDetail);
  useEffect(() => {
    dispatch(actions.getDetail(id));
    dispatch(
      globalActions.setDataBreadcrumb({
        menus: [
          {
            name: 'Sản phẩm',
          },
          {
            name: 'Chi Tiết',
          },
        ],
        title: 'Chi tiết sản phẩm',
      }),
    );
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
    };
  }, []);

  const goBack = () => {
    history.push('/products');
  };
  const goUpdate = () => {
    history.push(`/products/uc/${id}`);
  };

  return (
    <>
      <PageWrapper>
        <Spin tip="Đang tải..." spinning={isLoading}>
          <Row gutter={24}>
            <Col span={24}>
              <div className="d-flex justify-content-between">
                <Button onClick={goBack} className="btn-md" context="secondary">
                  <span>Trở về</span>
                </Button>
                <Button
                  onClick={goUpdate}
                  context="secondary"
                  className="btn-md"
                  color="green"
                >
                  <span>Sửa</span>
                </Button>
              </div>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24}>
              <SectionWrapper mt={{ xs: 's4' }}>
                {/* <CustomH3 mb={{ xs: 's4' }}>Chi tiết sản phẩm</CustomH3> */}
                <div className="">
                  <Row gutter={24}>
                    <Col span={12}>
                      <b>Tên:</b> {data?.name}
                    </Col>
                    <Col span={12}>
                      <b>Giá:</b> {data?.odii_price}
                    </Col>
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
