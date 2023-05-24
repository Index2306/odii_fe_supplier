/**
 *
 * Products
 *
 */
import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
  Row,
  Col,
  Spin,
  List,
  Collapse,
  Dropdown,
  Menu,
  Tooltip,
  Input,
} from 'antd';
import { isEmpty, isEqual } from 'lodash';
import { EditOutlined, WarningTwoTone } from '@ant-design/icons';
import {
  DownOutlined,
  MoreOutlined,
  UnorderedListOutlined,
  TableOutlined,
} from '@ant-design/icons';
import {
  Table,
  PageWrapper,
  Image,
  Link,
  BoxColor,
  Button,
  Pagination,
} from 'app/components';
// import constants from 'assets/constants';
import { SectionWrapper, CustomTitle, CustomStyle } from 'styles/commons';
import { formatMoney } from 'utils/helpers';
// import { EditOutlined } from '@ant-design/icons';
import { useDistributionsSlice } from './slice';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import { FilterBar } from './Features';
import {
  selectLoading,
  selectData,
  selectPagination,
  selectDetails,
  selectSummary,
} from './slice/selectors';
import { messages } from './messages';
import Confirm from 'app/components/Modal/Confirm';
import { COMBINE_STATUS } from './constants';
import TableVarient from './Components/TableVarient';
import usePrevious from 'app/hooks/UsePrevious';
import ProductList from './Components/ProductList';
import { MainWrapper } from './Components/styles';
import { TotalQuantity } from './Features/CreateAndUpdate/modals';

const { Panel } = Collapse;
const { Item } = Menu;
const initConfirmAction = {
  visible: false,
  nextState: {},
  recordId: 0,
};

export function Distribution({ history }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useDistributionsSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectData);
  const { roles } = useSelector(selectCurrentUser);
  const pagination = useSelector(selectPagination);
  const summary = useSelector(selectSummary);

  const [isShowConfirmStatus, setIsShowConfirmStatus] = React.useState(false);
  const [detail, setDetail] = React.useState({});
  const [idChangeCollape, setIdChangeCollape] = React.useState([]);
  const [change, setChange] = React.useState(
    localStorage.getItem('ViewstyleDistribution')
      ? localStorage.getItem('ViewstyleDistribution')
      : 'list',
  );
  const [changeCollape, setChangeCollape] = React.useState();
  const preData = usePrevious(data) || [];
  const [recordAction, setRecordAction] = React.useState();
  const [idInventory, setIdInventory] = React.useState();
  const [changeVisible, setChangeVisible] = React.useState(false);
  const [variant, setVariant] = React.useState();
  const [actionCollape, setActionCollape] = React.useState(false);
  const [StatusModal, setStatusModal] = React.useState('');
  const [variationDetail, setVariationDetail] = React.useState();
  const [confirmAction, setConfirmAction] = React.useState(initConfirmAction);
  const [typeQuantity, setTypeQuantity] = React.useState();

  React.useEffect(() => {
    if (variant && !actionCollape) {
      setActionCollape(true);
    }
  }, [variant]);

  React.useEffect(() => {
    if (StatusModal) {
      setStatusModal();
    }
  }, [variationDetail]);

  const onChangeProductState = (record, nextState) => {
    setConfirmAction({
      visible: true,
      nextState: nextState,
      recordId: record.id,
    });
  };
  const ActionMenu = record => {
    const combineStatus = !isEmpty(record)
      ? COMBINE_STATUS[`${record.status}`]
      : COMBINE_STATUS[Object.keys(COMBINE_STATUS)[0]];
    return (
      <Menu style={{ width: 150 }}>
        <Item
          onClick={() => {
            onChangeProductState(record, combineStatus);
          }}
        >
          {combineStatus?.buttonText}
        </Item>
      </Menu>
    );
  };

  const gotoPage = (data = '') => {
    dispatch(actions.getData(data));
  };

  const onCloseConfirmModel = () => {
    setConfirmAction({ ...initConfirmAction });
  };
  const onConfirmAction = () => {
    if (confirmAction.recordId > 0) {
      dispatch(
        actions.updateState({
          id: confirmAction.recordId,
          data: {
            supplier_status: confirmAction.nextState.publish_status,
          },
          onSuccess: () => {
            gotoPage(history.location.search);
            onCloseConfirmModel();
          },
        }),
      );
    } else {
      onCloseConfirmModel();
    }
  };

  const handleChangeKingOf = viewstyle => {
    setChange(viewstyle);
    localStorage.setItem('ViewstyleDistribution', viewstyle);
  };

  const handleChangeCollape = (e, record) => {
    setActionCollape(!actionCollape);
    setChangeCollape(`${e}_${record.id}`);
    if (e) {
      if (!idChangeCollape.includes(record.id)) {
        idChangeCollape.push(record.id);
        setIdChangeCollape(idChangeCollape);
        setVariationDetail(record?.variations);
      }
      setIdInventory(record);
    } else {
      idChangeCollape.splice(idChangeCollape.indexOf(record.id), 1);
      setIdChangeCollape(idChangeCollape);
      if (idChangeCollape) {
        let lastId = idChangeCollape[idChangeCollape.length - 1];
        setIdInventory(data?.find(item => item.id === lastId));
      }
    }
  };

  const handleMenuClick = (Type, id) => e => {
    if (Type) {
      setVariationDetail(data.find(item => item.id === id).variations);
    }
    if (e) {
      e.stopPropagation();
    }
    setStatusModal(Type);
  };

  const handleAction = type => e => {
    switch (type) {
      case 'cancel':
        e.stopPropagation();
        setActionCollape(false);
        break;
      case 'accept':
        e.stopPropagation();
        handleUpdateInventory('', variant);
        setActionCollape(false);
        break;
      case 'all':
        handleUpdateInventory('', e);
        setActionCollape(true);
        break;
      default:
        return;
    }
  };

  const genExtra = id => (
    <div className="see-more">
      {idChangeCollape.includes(id) && (
        <div className="btn-more">
          <Button
            className="btn-sm"
            onClick={handleMenuClick(
              <TotalQuantity
                title="Sửa số lượng"
                data={variationDetail}
                variations={variationDetail}
                setVariations={setVariant}
                callBackCancel={handleMenuClick('')}
                callBackSave={handleAction('all')}
              />,
              id,
            )}
          >
            Chỉnh sửa hàng loạt
          </Button>
        </div>
      )}
      {actionCollape && idInventory?.id === id ? (
        <div className="btn-action-collape">
          <Button
            className="btn-sm btn-cancel"
            onClick={handleAction('cancel')}
          >
            Hủy
          </Button>
          <Button className="btn-sm" onClick={handleAction('accept')}>
            Lưu
          </Button>
        </div>
      ) : (
        <>
          <div className="text-see-more">
            {idChangeCollape.includes(id) ? 'Rút gọn' : 'Xem thêm'}
          </div>
          <div
            className={
              idChangeCollape.includes(id) ? 'icon-see-more' : 'icon-see'
            }
          >
            <DownOutlined />
          </div>
        </>
      )}
    </div>
  );

  const handleInventory = (record, type) => {
    setIdInventory(record);
    setTypeQuantity(type);
    if (record.has_variation) {
      handleChangeCollape(true, record);
    } else {
      setChangeVisible(true);
    }
  };

  const handleUpdateInventory = (value, newVariant, type) => {
    console.log(newVariant);
    console.log('check_idInventory', idInventory);
    if (idInventory) {
      const id = idInventory.id;
      let newVariations;
      let total;
      let totalReal;
      let dataSend;
      if (newVariant) {
        newVariations = newVariant.map(item => {
          return {
            id: item.id,
            total_quantity: item.total_quantity,
            real_quantity: item.real_quantity,
          };
        });
        total = newVariant.reduce(
          (prev, curr) => prev + curr.total_quantity,
          0,
        );
        totalReal = newVariant.reduce(
          (prev, curr) => prev + curr.real_quantity,
          0,
        );
        dataSend = {
          total_quantity: total,
          real_quantity: totalReal,
          variations: newVariations,
        };
      } else {
        dataSend = {
          [type]: parseInt(value),
        };
      }
      dispatch(
        actions.updateQuantity({
          id,
          data: {
            ...dataSend,
          },
        }),
      );
    }
    setChangeVisible(false);
    gotoPage(history.location.search);
  };

  const changeValueInventory = (e, type) => {
    handleUpdateInventory(e.target.value, null, type);
  };

  const InventoryPopup = (
    <>
      <CustomInventory>
        <CustomStyle className="title-box">Số lượng tồn kho :</CustomStyle>
        <Input
          type="number"
          placeholder="Nhập số lượng tồn kho"
          onPressEnter={e => changeValueInventory(e, 'total_quantity')}
        />
      </CustomInventory>
    </>
  );

  const InventoryRealPopup = (
    <>
      <CustomInventory>
        <CustomStyle className="title-box">Số lượng tồn kho thực :</CustomStyle>
        <Input
          type="number"
          placeholder="Nhập số lượng tồn kho thực"
          onPressEnter={e => changeValueInventory(e, 'real_quantity')}
        />
      </CustomInventory>
    </>
  );

  const columns = React.useMemo(
    () => [
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Sản phẩm</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'name',
        key: 'name',
        // width: 240,
        render: (text, record) => (
          <WrapperOption>
            <List.Item>
              <List.Item.Meta
                avatar={<Image size="45x45" src={record?.thumb?.location} />}
                title={<Link to={`/distribution/uc/${record.id}`}>{text}</Link>}
                // description={`${record.option_1}${
                //   record.option_2 ? `/${record.option_2}` : ''
                // }${record.option_3 ? `/${record.option_3}` : ''}`}
              />
            </List.Item>
          </WrapperOption>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Danh mục sản phẩm</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'top_category',
        key: 'top_category',
        width: '12%',
        render: text => text?.name,
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Biến thể</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'number_of_variation',
        key: 'number_of_variation',
        width: '7%',
        className: 'text-center',
        render: text => !!text && text,
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">
              <Tooltip title="Tồn kho thực, có thể sửa giá trị tồn kho">
                Tồn kho
              </Tooltip>
            </div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'total_quantity',
        key: 'total_quantity',
        width: '7%',
        className: 'text-center',
        render: (text, record) => (
          <CustomStyle
            textAlign="center"
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
          >
            <div>{text}</div>
            {!record.has_variation ? (
              <Dropdown
                overlay={InventoryPopup}
                trigger={['click']}
                placement="bottomRight"
                visible={
                  idInventory &&
                  typeQuantity === 'total_quantity' &&
                  idInventory.id == record.id
                    ? changeVisible
                    : false
                }
                onVisibleChange={value => setChangeVisible(value)}
              >
                <CustomStyle
                  onClick={() => handleInventory(record, 'total_quantity')}
                >
                  <EditOutlined className="icon-edit" />
                </CustomStyle>
              </Dropdown>
            ) : (
              <EditOutlined
                onClick={() => handleInventory(record, 'total_quantity')}
                className="icon-edit"
              />
            )}
            <div className="warning-icon-table">
              {record.zero_quantity_warn && (
                <>
                  <Tooltip title="Hết hàng">
                    <WarningTwoTone twoToneColor="#f10202" />
                  </Tooltip>
                </>
              )}
              {!record.zero_quantity_warn && record.low_quantity_warn && (
                <>
                  <Tooltip title="Sắp hết hàng">
                    <WarningTwoTone twoToneColor="#f3b506" />
                  </Tooltip>
                </>
              )}
            </div>
          </CustomStyle>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">
              <Tooltip title="Số lượng sản phẩm còn lại trong kho thực">
                Tồn kho thực
              </Tooltip>
            </div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'real_quantity',
        key: 'real_quantity',
        width: '7%',
        render: (text, record) => (
          <CustomStyle
            textAlign="center"
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
          >
            <div>{text}</div>
            {!record.has_variation ? (
              <Dropdown
                overlay={InventoryRealPopup}
                trigger={['click']}
                placement="bottomRight"
                visible={
                  idInventory &&
                  typeQuantity === 'real_quantity' &&
                  idInventory.id == record.id
                    ? changeVisible
                    : false
                }
                onVisibleChange={value => setChangeVisible(value)}
              >
                <CustomStyle
                  onClick={() => handleInventory(record, 'real_quantity')}
                >
                  <EditOutlined className="icon-edit" />
                </CustomStyle>
              </Dropdown>
            ) : (
              <EditOutlined
                onClick={() => handleInventory(record, 'real_quantity')}
                className="icon-edit"
              />
            )}
          </CustomStyle>
        ),
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Kho lấy hàng</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'supplier_warehousing',
        key: 'supplier_warehousing',
        width: 120,
        render: text => <CustomStyle fontSize={13}>{text?.name}</CustomStyle>,
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Giá NCC</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'origin_supplier_price',
        key: 'origin_supplier_price',
        width: '8%',
        render: (text, record) => {
          const money = record?.has_variation
            ? record.min_price_variation
            : record.origin_supplier_price;
          return (
            <CustomStyle fontSize={{ xs: 'f2' }}>
              {formatMoney(money)}
            </CustomStyle>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">
              <Tooltip title="Giá khuyến nghị cho seller bán">
                Giá gợi ý
              </Tooltip>
            </div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'recommend_retail_price',
        key: 'recommend_retail_price',
        width: '8%',
        render: (text, record) => {
          const money = record.has_variation
            ? record.min_recommend_variation_price
            : record.recommend_retail_price;
          return (
            <CustomStyle fontSize={{ xs: 'f2' }}>
              {formatMoney(money)}
            </CustomStyle>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Trạng thái</div>
            {/* <div className="addition"></div> */}
          </div>
        ),
        dataIndex: 'status',
        key: 'status',
        width: '10%',
        render: (text, record) => {
          const currentStatus = COMBINE_STATUS[`${text}`];
          return (
            <div className="">
              <BoxColor
                notBackground
                fontWeight="medium"
                colorValue={currentStatus?.colorLabel}
              >
                {currentStatus?.label || ''}
              </BoxColor>
              {!roles?.includes('partner_source') && (
                <Dropdown
                  overlay={() => ActionMenu(record)}
                  trigger={['hover']}
                  placement="bottomRight"
                  style={{ cursor: 'pointer' }}
                  onVisibleChange={value => setRecordAction(record)}
                >
                  <MoreOutlined style={{ cursor: 'pointer' }} />
                </Dropdown>
              )}
            </div>
          );
        },
      },
    ],
    [changeCollape, recordAction, idInventory, changeVisible],
  );

  const goCreate = () => {
    history.push('distribution/uc');
  };

  return (
    <>
      <PageWrapper>
        <CustomStyle className="d-flex justify-content-between">
          <CustomTitle>{t(messages.title())}</CustomTitle>
          <GroupButton>
            {!roles?.includes('partner_source') && (
              <Button className="btn-sm" onClick={goCreate}>
                + Phân bổ sản phẩm
              </Button>
            )}
            <div className="group-button" style={{ display: 'flex' }}>
              <Tooltip title="Danh sách" color="#3D56A6">
                <Button
                  className={change === 'list' ? 'btn-list active' : 'btn-list'}
                  onClick={() => handleChangeKingOf('list')}
                >
                  <UnorderedListOutlined
                    style={{ color: change === 'list' ? '#fff' : '#3D56A6' }}
                  />
                </Button>
              </Tooltip>
              <Tooltip title="Lưới" color="#3D56A6">
                <Button
                  className={change === 'grip' ? 'btn-grip active' : 'btn-grip'}
                  onClick={() => handleChangeKingOf('grip')}
                >
                  <TableOutlined
                    style={{ color: change === 'grip' ? '#fff' : '#3D56A6' }}
                  />
                </Button>
              </Tooltip>
            </div>
          </GroupButton>
        </CustomStyle>
        <SectionWrapper className="custom-table-box">
          <CustomStyle className="noTab text-left" mb={{ xs: 's5' }}>
            <FilterBar
              isLoading={isLoading}
              gotoPage={gotoPage}
              summary={summary}
              history={history}
            />
          </CustomStyle>
          {change === 'list' && (
            <Spin tip="Đang tải..." spinning={isLoading}>
              <Row gutter={24}>
                <Col span={24}>
                  <div>
                    <CustomTable
                      className="custom"
                      rowSelection={{}}
                      columns={columns}
                      expandable={{
                        expandedRowKeys: data.map(e => e.id),
                        expandedRowRender: record => {
                          let variation = record?.variations || [];

                          return (
                            <>
                              {record.has_variation &&
                                variation.length > 0 &&
                                !roles?.includes('partner_source') && (
                                  <div className="card-variant">
                                    <Collapse
                                      accordion
                                      onChange={e =>
                                        handleChangeCollape(e, record)
                                      }
                                      activeKey={
                                        idChangeCollape.includes(record.id) && [
                                          '1',
                                        ]
                                      }
                                    >
                                      <Panel
                                        // header={
                                        //   idChangeCollape.includes(record.id)
                                        //     ? 'rút gọn'
                                        //     : `xem thêm ${variations.length} biến thể khác`
                                        // }
                                        header={`Tổng ${variation.length} biến thể`}
                                        key="1"
                                        extra={genExtra(record.id)}
                                      >
                                        <TableVarient
                                          data={variation}
                                          setVariant={value =>
                                            setVariant(value)
                                          }
                                          actionCollape={actionCollape}
                                          setIdInventory={value =>
                                            setIdInventory(value)
                                          }
                                          idInventory={idInventory}
                                        />
                                      </Panel>
                                    </Collapse>
                                  </div>
                                )}
                            </>
                          );
                        },
                        expandIcon: ({ expanded, onExpand, record }) => <></>,
                      }}
                      searchSchema={{
                        keyword: {
                          required: false,
                        },
                        status: {
                          required: false,
                        },
                        publish_status: {
                          required: false,
                        },
                        quantity: {
                          required: false,
                        },
                        product_stock_status: {
                          required: false,
                        },
                      }}
                      data={{ data, pagination }}
                      scroll={{ x: 1100 }}
                      // rowClassName="pointer"
                      actions={gotoPage}
                      // onRow={record => ({
                      //   onClick: goDetail(record),
                      // })}
                    />
                  </div>
                </Col>
              </Row>
            </Spin>
          )}
        </SectionWrapper>
        {change === 'grip' && (
          <Spin tip="Đang tải..." spinning={isLoading}>
            <MainWrapper>
              <ProductList products={data} />
            </MainWrapper>
            <Pagination
              searchSchema={{
                keyword: {
                  required: false,
                },
                status: {
                  required: false,
                },
                publish_status: {
                  required: false,
                },
              }}
              data={{ data, pagination }}
              actions={gotoPage}
            />
          </Spin>
        )}
        {confirmAction.visible && (
          <Confirm
            data={detail}
            isFullWidthBtn
            title={`Xác nhận '${confirmAction.nextState?.buttonText}'`}
            isModalVisible={confirmAction.visible}
            handleCancel={onCloseConfirmModel}
            handleConfirm={onConfirmAction}
          />
        )}
      </PageWrapper>
      {StatusModal}
    </>
  );
}

const WrapperOption = styled.div`
  .ant-list-item-meta {
    align-items: center;
  }
  .ant-checkbox-wrapper {
    visibility: hidden;
  }
  .ant-list-item-meta-title {
    /* text-align: justify; */
    display: -webkit-box;
    -webkit-line-clamp: 2; /* number of lines to show */
    -webkit-box-orient: vertical;
  }
`;

const CustomInventory = styled.div`
  background: #fff;
  padding: 20px;
  box-shadow: 0 2px 4px 0 rgba(158, 158, 158, 0),
    0 2px 15px 0 rgba(0, 0, 0, 0.2);

  .title-box {
    margin-bottom: 5px;
    font-weight: 500;
  }
  .btn-box {
    padding-top: 5px;
    display: flex;
    justify-content: flex-end;
  }
`;
const CustomTable = styled(Table)`

  .ant-checkbox-wrapper {
    visibility: visible;
  }

  .icon-edit{
    color: #5245e5;
    margin-left: 5px;
    font-size: 12px;

    &:hover{
      cursor: pointer;
      color: #3D56A6;
    }
  }

  .ant-table-tbody > tr.ant-table-row > td {
    background: #fff;
  }
  .ant-table-container {
    table {
      .ant-table-expanded-row {
        .ant-table-cell {
          padding: 0;
          background: #fff;

          &:not(last-child){
            border-bottom: 10px solid #f5f6fd;
          }
          .card-variant {
            display: flex;
            justify-content: center;
            cursor: pointer;
          }
        }
      }

      .ant-table-thead > tr > th{
        border-bottom: 10px solid #f5f6fd;
      }

      // .ant-table-tbody{
      //   tr{
      //     td{
      //       border-bottom: none;
      //     }
      //   }
      // }

      .ant-table-row-expand-icon-cell {
        padding: 0 !important;
        width: 0%;
      }

      .add-variant-action {
        .ant-collapse-content {
          height: auto !important;
        }
      }

      .ant-collapse {
        width: 100%;
        background: #fff;
        border: none;

        .ant-collapse-header{

          padding: 8px 65px;
          margin: 8px 12px 8px 12px;
          font-size: 12px;
          color: #9d9d9d;
          background: #f9f9fa;

          &:hover{
            background: #f6f6fb;
          }

          .ant-collapse-arrow{
            display: none;
          }

          .see-more{
            display: flex;
            align-items: center;

            .btn-more{
              padding-right: 20px;
              border-right: 1px solid #5245e5;

              .btn-sm{
                font-size: 12px;
                height: 24px;
                min-width: 48px;
                padding: 0 8px;
                background-color: #fff;
                border: 1px solid #5245e5;
                border-radius: 4px;
                color: #5245e5;

                &:hover{
                  color: #766df2;
                  border-color: #766df2;
                }
              }
            }

            .text-see-more{
              margin-right: 2px;
              color: #5245e5;
              min-width: 76px;
              text-align: center;
            }
            .icon-see-more {
              transform: rotate(-180deg);
              transition: all .3s ease;

              span{
                font-size: 12px;
                color: #5245e5;
              }
            }

            .icon-see{
              transition: all .3s ease;
              display: flex;
              align-items: center;

              span{
                font-size: 12px;
                color: #5245e5;
              }
            }

            .btn-action-collape{
              display: flex;
              margin-left: 10px;

              .btn-sm{
                margin-left: 10px;
                height: 24px;
                font-size: 12px;
                padding: 0 8px;
                background-color: #fff;
                border: 1px solid #5245e5;
                border-radius: 4px;
                color: #5245e5;
                min-width: 48px;

                &:hover{
                  color: #766df2;
                  border-color: #766df2;
                }
              }

              .btn-cancel{
                color: #474e66;
                border: 1px solid #dde2f0;
              }
            }
          }
        }

          .ant-collapse-content {
            width: 100%;
            border: none;
            overflow: hidden scroll;
            max-height: 300px;

            .ant-collapse-content-box {
              padding: 0;
            }
          }
        }
      }
    }
  }
  .warning-icon-table{
    position: absolute;
    right: 5px;
    z-index: 1;
    top: -3px;
  }
`;

const GroupButton = styled.div`
  display: flex;
  .group-button {
    margin-left: 15px;

    .btn-list,
    .btn-grip {
      width: 40px;
      height: 32px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      outline: none;
    }
    .btn-list {
      background: #ffffff;
      border: 1px solid #ebebf0;
      border-radius: 4px 0px 0px 4px;
    }
    .btn-grip {
      background: #ffffff;
      border: 1px solid #ebebf0;
      border-radius: 0px 4px 4px 0px;
    }
    .active {
      background: #3d56a6;
      border: 1px solid #3d56a6;
    }
  }
  .ant-btn-primary {
    background-color: #3d56a6;
    margin-left: 15px;

    &:hover {
      background: #40a9ff;
      border-color: #40a9ff;
    }
  }
  .btn-filter {
    width: 100px;
    height: 36px;
    border: 1px solid #ebebf0;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    margin-left: 15px;

    span {
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;
      color: #3d56a6;
    }
  }
  .select-status {
    width: 110px;
    height: 36px;
  }
  .ant-select-selection-placeholder,
  .ant-select-selection-item {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: #3d56a6;
  }
`;
