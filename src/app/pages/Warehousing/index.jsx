/**
 *
 * Warehousing
 *
 */
import React, { useState, useEffect, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Spin, Skeleton } from 'antd';
import { isEmpty } from 'lodash';
import {
  Button,
  PageWrapper,
  Image,
  Divider,
  EmptyPage,
  Table,
  Link,
} from 'app/components';
import { formatDate } from 'utils/helpers';
// import moment from 'moment';
import { CustomTitle, CustomStyle } from 'styles/commons';
import { useWarehousingSlice } from './slice';
import { selectLoading, selectData } from './slice/selectors';
import { IncludeImage, RightBox } from './styled';
import styled from 'styled-components/macro';
import {
  UserOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

export const Warehousing = memo(({ history, ...res }) => {
  const dispatch = useDispatch();
  const { actions } = useWarehousingSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectData);
  const [ViewStyleList, setViewStyleList] = useState(
    localStorage.getItem('ViewstyleWarehouse'),
  );

  useEffect(() => {
    dispatch(actions.getData());
  }, []);

  const goDetail = id => () => {
    history.push(`/warehousing/uc/${id}`);
  };

  const goCreate = () => {
    history.push('warehousing/uc');
  };

  const handleSetViewStyle = viewstyle => {
    setViewStyleList(viewstyle);
    localStorage.setItem('ViewstyleWarehouse', viewstyle);
  };

  const columns = React.useMemo(
    () => [
      {
        title: 'STT',
        width: 60,
        align: 'center',
        render: (_, v, i) => i + 1,
      },
      {
        title: 'Kho hàng',
        dataIndex: 'name',
        width: 150,
        render: (_, record) => {
          return (
            <CustomDivName>
              <CustomAvatar
                src={record.thumb?.origin}
                icon={<UserOutlined />}
              />
              &emsp;
              <CustomWarehouseName>
                <CustomLink to={`/warehousing/uc/${record.id}`}>
                  {record.name || 'N/A'}
                </CustomLink>
                <div style={{ display: 'table-row' }}>
                  {record.is_pickup_address && (
                    <div className="pickup_address">Kho lấy hàng</div>
                  )}
                  {record.is_return_address && (
                    <div className="return_address">Kho trả hàng</div>
                  )}
                </div>
              </CustomWarehouseName>
            </CustomDivName>
          );
        },
      },
      {
        title: 'Địa chỉ',
        width: 140,
        render: (_, record) => (
          <div>
            {record?.address_final
              ? record?.address_final
              : record?.location_data?.address1}
          </div>
        ),
      },
      // {
      //   title: 'Quốc gia',
      //   width: 120,
      //   render: (_, record) => <div>{record?.location_data?.country}</div>,
      // },
      {
        title: 'Điện thoại',
        dataIndex: 'phone',
        width: 100,
        render: text => <div>{text}</div>,
      },
      {
        title: 'Tổng SP',
        dataIndex: 'countProduct',
        width: 60,
      },
      {
        title: 'SP hết hàng',
        dataIndex: 'countInactiveProduct',
        width: 60,
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'created_at',
        width: 110,
        render: text => <div>{formatDate(text, true)}</div>,
      },
    ],
    [data],
  );

  if (isEmpty(data)) {
    return (
      <PageWrapper style={{ width: '1200px' }}>
        <Spin tip="Đang tải..." spinning={isLoading}>
          <CustomStyle className="d-flex justify-content-between">
            <CustomTitle>Kho hàng</CustomTitle>
            <CustomDiv>
              <Button className="btn-sm" onClick={goCreate}>
                + Thêm kho hàng
              </Button>
              <div className="view-style">
                <div
                  className={ViewStyleList ? 'active' : ''}
                  onClick={() => handleSetViewStyle(true)}
                >
                  <AppstoreOutlined />
                </div>
                <div
                  className={!ViewStyleList ? 'active' : ''}
                  onClick={() => handleSetViewStyle(false)}
                >
                  <UnorderedListOutlined />
                </div>
              </div>
            </CustomDiv>
          </CustomStyle>
          <CustomDivEmpty>
            {isLoading ? (
              <Skeleton active paragraph={{ rows: 20 }} className="loading" />
            ) : (
              <EmptyPage
                style={{ height: 'calc(100vh - 200px)' }}
                isLoading={isLoading}
              ></EmptyPage>
            )}
          </CustomDivEmpty>
        </Spin>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper style={{ width: '1200px' }}>
      <Spin tip="Đang tải..." spinning={isLoading}>
        {/* {isLoading ? (
          <Skeleton active paragraph={{ rows: 0 }} className="loading" />
        ) : ( */}
        <CustomStyle className="d-flex justify-content-between">
          <CustomTitle>Kho hàng</CustomTitle>
          <CustomDiv>
            <Button className="btn-sm" onClick={goCreate}>
              + Thêm kho hàng
            </Button>
            <div className="view-style">
              <div
                className={ViewStyleList === 'list' ? 'active' : ''}
                onClick={() => handleSetViewStyle('list')}
              >
                <AppstoreOutlined />
              </div>
              <div
                className={ViewStyleList === 'table' ? 'active' : ''}
                onClick={() => handleSetViewStyle('table')}
              >
                <UnorderedListOutlined />
              </div>
            </div>
          </CustomDiv>
        </CustomStyle>
        {/* )} */}

        {ViewStyleList === 'list' ? (
          <Row gutter={{ xs: 8, sm: 16, md: 28 }}>
            {data.map(item => (
              <Col xs={24} md={12}>
                <CustomStyle key={item.id} className="" mb={{ xs: 's6' }}>
                  {/* {isLoading ? (
                    <Skeleton
                      active
                      paragraph={{ rows: 4 }}
                      className="loading"
                    />
                  ) : ( */}
                  <Row>
                    <Col xs={10}>
                      <IncludeImage>
                        <Image size="100x100" src={item?.thumb?.location} />
                        <NameBox
                          fontSize={{ xs: 'f3' }}
                          mb={{ xs: 's2' }}
                          fontWeight="bold"
                        >
                          {item?.name}
                          <div className="address-tag">
                            {item.is_pickup_address && (
                              <div className="pickup_address">Kho lấy hàng</div>
                            )}
                            {item.is_return_address && (
                              <div className="return_address">Kho trả hàng</div>
                            )}
                          </div>
                        </NameBox>
                        <CustomStyle
                          fontSize={{ xs: 'f1' }}
                          mb={{ xs: 's4' }}
                          color="gray3"
                        >
                          {item?.address_final
                            ? item.address_final
                            : item?.location_data?.address1}
                        </CustomStyle>
                        <Button
                          className="btn-sm"
                          context="secondary"
                          width="100%"
                          onClick={goDetail(item.id)}
                        >
                          Xem chi tiết
                        </Button>
                      </IncludeImage>
                    </Col>

                    <Col xs={14}>
                      <RightBox>
                        <CustomStyle className="d-flex row">
                          <CustomStyle
                            className="col"
                            borderRight="1px solid"
                            borderColor="stroke"
                          >
                            <CustomStyle
                              color="blackPrimary"
                              fontWeight="bold"
                              fontSize={{ xs: 'f4' }}
                            >
                              {item.countProduct || <br />}
                            </CustomStyle>
                            <CustomStyle color="gray3">
                              Tổng sản phẩm
                            </CustomStyle>
                          </CustomStyle>

                          <CustomStyle pl={{ xs: 's6' }} className="col">
                            <CustomStyle
                              color="blackPrimary"
                              fontWeight="bold"
                              fontSize={{ xs: 'f4' }}
                            >
                              {item.countInactiveProduct || <br />}
                            </CustomStyle>
                            <CustomStyle color="gray3">
                              Sản phẩm hết hàng
                            </CustomStyle>
                          </CustomStyle>
                        </CustomStyle>

                        <Divider my={{ xs: 's5' }} />

                        <CustomStyle>
                          <CustomStyle
                            mb={{ xs: 's3' }}
                            className="d-flex justify-content-between"
                          >
                            <CustomStyle color="gray3">Mã kho</CustomStyle>
                            <CustomStyle>{item?.id}</CustomStyle>
                          </CustomStyle>
                          <CustomStyle
                            mb={{ xs: 's3' }}
                            className="d-flex justify-content-between"
                          >
                            <CustomStyle color="gray3">Quốc gia</CustomStyle>
                            <CustomStyle>
                              {item?.location_data?.country}
                            </CustomStyle>
                          </CustomStyle>
                          <CustomStyle
                            mb={{ xs: 's3' }}
                            className="d-flex justify-content-between"
                          >
                            <CustomStyle color="gray3">Điện thoại</CustomStyle>
                            <CustomStyle>{item?.phone}</CustomStyle>
                          </CustomStyle>
                          <CustomStyle
                            mb={{ xs: 's3' }}
                            className="d-flex justify-content-between"
                          >
                            <CustomStyle color="gray3">Ngày tạo</CustomStyle>
                            <CustomStyle>
                              {item?.created_at
                                ? formatDate(item.created_at)
                                : ''}
                            </CustomStyle>
                          </CustomStyle>
                        </CustomStyle>
                      </RightBox>
                    </Col>
                  </Row>
                  {/* )} */}
                </CustomStyle>
              </Col>
            ))}
          </Row>
        ) : (
          <CustomDivTable>
            {isLoading ? (
              <Skeleton active paragraph={{ rows: 4 }} className="loading" />
            ) : (
              <Table
                className="table"
                columns={columns}
                dataSource={data}
                scroll={{ x: 900, y: 5000 }}
                // rowKey={record => record.id}
              />
            )}
          </CustomDivTable>
        )}
      </Spin>
    </PageWrapper>
  );
});

const CustomAvatar = styled(Image)`
  width: 45px;
  height: 45px;
  border-radius: 50%;
`;

const CustomDivName = styled.div`
  display: flex;
  cursor: pointer;
`;

const CustomLink = styled(Link)`
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #333333;
  margin: auto 0;
`;

const CustomDivEmpty = styled.div`
  .style-1 {
    height: calc(100vh - 120px);
  }
`;

const CustomDivTable = styled.div`
  .ant-table {
    padding: 21px;
  }
`;

const CustomDiv = styled.div`
  display: flex;
  .view-style {
    margin-left: 16px;
    width: 80px;
    height: 32px;
    display: flex;
    border-radius: 4px;
    background: #ffffff;
    box-sizing: border-box;
    cursor: pointer;
    .active {
      color: #ffffff;
      background: #3d56a6;
      border: 1px solid #3d56a6;
    }
    .anticon {
      vertical-align: 0%;
    }
    & div {
      font-weight: 900;
      font-size: 16px;
      line-height: 28px;
      flex: 1 1;
      text-align: center;
      color: #6c798f;
      border: 1px solid #e6e6e9;
      &:first-child {
        border-right: unset;
        border-radius: 4px 0px 0px 4px;
      }
      &:last-child {
        border-left: unset;
        border-radius: 0px 4px 4px 0px;
      }
    }
  }
`;
const CustomWarehouseName = styled.div`
  display: block;
  .pickup_address {
    color: #40d0bd;
    font-size: 10px;
    background-color: #e8f9f7;
  }
  .return_address {
    color: #ee4d2d;
    font-size: 10px;
    background-color: #fff1f0;
  }
`;
const NameBox = styled(CustomStyle)`
  display: block;
  .address-tag {
  }
  .pickup_address {
    color: #40d0bd;
    font-size: 10px;
    background-color: #e8f9f7;
    width: max-content;
    margin: 0 auto;
  }
  .return_address {
    color: #ee4d2d;
    font-size: 10px;
    background-color: #fff1f0;
    width: max-content;
    margin: 0 auto;
  }
`;
