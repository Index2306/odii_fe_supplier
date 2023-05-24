import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Row, Col, Spin, Skeleton } from 'antd';
import { bgWarehousing } from 'assets/images';
import {
  Button,
  PageWrapper,
  Image,
  Divider,
  Table,
  Link,
} from 'app/components';
import { formatDate } from 'utils/helpers';
// import moment from 'moment';
import { CustomStyle } from 'styles/commons';
import styled from 'styled-components/macro';
import { SectionWrapper } from 'styles/commons';
import {
  UserOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import {
  selectDataSource,
  selectPagination,
  selectLoading,
} from 'app/pages/ProductSource/slice/selectors';
import { useProductSourceSlice } from 'app/pages/ProductSource/slice';
// import { warehouses } from 'assets/images/empty';

export default function ProductSource() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { actions } = useProductSourceSlice();
  const data = useSelector(selectDataSource);
  const pagination = useSelector(selectPagination);
  const isLoading = useSelector(selectLoading);
  const [ViewStyleList, setViewStyleList] = useState(
    localStorage.getItem('ViewstyleproductSource')
      ? localStorage.getItem('ViewstyleproductSource')
      : 'list',
  );

  useEffect(() => {
    dispatch(actions.getData());
  }, []);

  const goDetail = id => () => {
    history.push(`/source/uc/${id}`);
  };

  const goCreate = () => {
    history.push('source/uc');
  };

  const handleSetViewStyle = viewstyle => {
    setViewStyleList(viewstyle);
    localStorage.setItem('ViewstyleproductSource', viewstyle);
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
        title: 'Nguồn hàng',
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
                <CustomLink to={`/source/uc/${record.id}`}>
                  {record.name || 'N/A'}
                </CustomLink>
              </CustomWarehouseName>
            </CustomDivName>
          );
        },
      },
      {
        title: 'Số điện thoại',
        width: 140,
        render: (_, record) => <div>{record?.phone}</div>,
      },
      {
        title: 'Địa chỉ',
        width: 140,
        render: (_, record) => <div>{record?.address}</div>,
      },
      {
        title: 'Mô tả',
        width: 140,
        render: (_, record) => <div>{record?.description}</div>,
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

  const pageContent = (
    <>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <PageWrapper fixWidth style={{ padding: 0 }}>
          {/* {isEmpty(data) && (
            <CustomSectionEmpty>
              <div className="empty-img">
                <img src={warehouses} alt="" />
              </div>
              <div className="empty-title">Chưa có kho hàng</div>
              <div className="empty-desc">
                Rất tiếc, bạn chưa có kho hàng nào. Khởi tạo kho hàng ngay để
                quản lý tồn kho hiệu quả hơn!
              </div>
              <Button className="btn-sm" onClick={goCreate}>
                + Thêm kho hàng
              </Button>
            </CustomSectionEmpty>
          )} */}
          {ViewStyleList === 'list' ? (
            <>
              <SectionTop>
                {false ? (
                  <Skeleton
                    active
                    paragraph={{ rows: 0 }}
                    className="loading"
                  />
                ) : (
                  <>
                    <div className="quantity-warehouse">
                      {pagination.total} nguồn hàng
                    </div>
                    <CustomDiv>
                      <Button className="btn-sm" onClick={goCreate}>
                        + Thêm nguồn hàng
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
                  </>
                )}
              </SectionTop>
              <SectionWrapper style={{ marginTop: '26px' }}>
                {false ? (
                  <Skeleton
                    active
                    paragraph={{ rows: 6 }}
                    className="loading"
                  />
                ) : (
                  <>
                    <Row gutter={{ xs: 8, sm: 16, md: 28 }}>
                      {data?.map(item => (
                        <Col xs={24} md={12}>
                          <CustomStyle
                            key={item?.id}
                            className=""
                            style={{ height: '100%' }}
                            mb={{ xs: 's6' }}
                          >
                            <Row style={{ height: '100%' }}>
                              <Col xs={10}>
                                <IncludeImage>
                                  <Image
                                    size="100x100"
                                    src={item?.thumb?.location}
                                  />
                                  <NameBox
                                    fontSize={{ xs: 'f3' }}
                                    mb={{ xs: 's2' }}
                                    fontWeight="bold"
                                  >
                                    {item?.name}
                                  </NameBox>
                                  <CustomStyle
                                    fontSize={{ xs: 'f1' }}
                                    fontWeight="bold"
                                    color="gray3"
                                  >
                                    {item?.phone}
                                  </CustomStyle>
                                  <CustomStyle
                                    fontSize={{ xs: 'f1' }}
                                    mb={{ xs: 's4' }}
                                    color="gray3"
                                  >
                                    {item?.address}
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
                                  <CustomStyle
                                    textAlign="center"
                                    fontWeight="500"
                                  >
                                    Mô tả
                                  </CustomStyle>
                                  <Divider my={{ xs: 's5' }} mt="0px" />
                                  <CustomStyle>{item?.description}</CustomStyle>
                                </RightBox>
                              </Col>
                            </Row>
                          </CustomStyle>
                        </Col>
                      ))}
                    </Row>
                  </>
                )}
              </SectionWrapper>
            </>
          ) : (
            <>
              <SectionTop>
                <div className="quantity-warehouse">
                  {pagination?.total} nguồn hàng
                </div>
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
              </SectionTop>
              <CustomDivTable>
                <Table
                  className="table"
                  columns={columns}
                  dataSource={data}
                  scroll={{ x: 900, y: 5000 }}
                  // rowKey={record => record.id}
                />
              </CustomDivTable>
            </>
          )}
        </PageWrapper>
      </Spin>
    </>
  );

  // return (
  //   <div className="box-df">
  //     {isLoading ? (
  //       <Skeleton active paragraph={{ rows: 4 }} className="loading" />
  //     ) : (
  //       pageContent
  //     )}
  //   </div>
  // );
  return (
    // isLoading ? (
    //   <Skeleton active paragraph={{ rows: 4 }} className="loading" />
    // ) : (
    <div className="box-df">{pageContent}</div>
  );
}

const SectionTop = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  .quantity-warehouse {
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
  }
`;

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

const CustomDivTable = styled.div`
  /* .ant-table {
    padding: 21px;
  } */
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
const IncludeImage = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-image: url(${bgWarehousing});
  border-radius: 4px 0px 0px 4px;
  background-size: cover;
  border: 1px solid #e6e6e9;
  border-right: none;
  background-repeat: no-repeat;
  padding: ${({ theme }) => theme.space.s5}px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  .ant-image-img {
    margin-bottom: 12px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
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

const RightBox = styled(CustomStyle)`
  height: 100%;
  background: ${({ theme }) => theme.whitePrimary};
  border-radius: 0px 4px 4px 0px;
  border: 1px solid #e6e6e9;
  padding: ${({ theme }) => theme.space.s6}px ${({ theme }) => theme.space.s7}px;
`;
