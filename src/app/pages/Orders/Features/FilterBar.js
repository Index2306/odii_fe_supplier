import React, { memo, useRef, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Space } from 'antd';
import { Form, Input, Select, DatePicker, Tabs, Button } from 'app/components';
import { SearchOutlined } from '@ant-design/icons';
import Filter from 'app/hooks/Filter';
import constants from 'assets/constants';
import moment from 'moment';
import { debounce } from 'lodash';
import { CustomStyle } from 'styles/commons';
import styled from 'styled-components/macro';
import { GetTime } from 'utils/helpers';
import { selectSelectedOrders } from '../slice/selectors';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import PrintProgress from '../Components/List/PrintProgress';

const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const PRINT_POGRESS_MODAL_KEY = 'PRINT_POGRESS_MODAL';
const initState = {
  keyword: '',
  // status: '',
  odii_status: '',
  fulfillment_status: '',
  // store_id: '',
  from_time: '',
  to_time: '',
  platform: '',
  print_status: '',
};

const FilterBar = memo(function FilterBar({
  isLoading,
  history,
  showAction,
  listStores,
  pagination,
  tab,
  summary,
  batchActionHandler,
}) {
  const [filter, setFilter] = React.useState(initState);
  const [form] = Form.useForm();
  const [currModalKey, setCurrModalKey] = React.useState(null);
  const [currModelAction, setCurrentModelAction] = React.useState({});
  const [time, setTime] = React.useState('day');
  // const [hackValue, setHackValue] = React.useState();
  const selectedOrders = useSelector(selectSelectedOrders);
  const { roles } = useSelector(selectCurrentUser);
  // const printNumber = selectedOrders?.metadata?.packingOrPrintNumber || 0;
  const ref = useRef(null);

  const changeKeyword = useCallback(
    debounce(() => {
      form
        .validateFields()
        .then(formValues => {
          const values = { ...filter, ...formValues };
          if (ref.current) {
            ref.current.callBack(values);
            setFilter(values);
          }
        })
        .catch(error => {});
    }, 250),
    [],
  );

  useEffect(() => {
    form.setFieldsValue({ keyword: filter.keyword });
    tab(filter.odii_status + '-' + filter.fulfillment_status);
  }, [filter]);

  useEffect(() => {
    if (history.location.search == '?page=1&page_size=10') {
      let values = {
        ...filter,
        odii_status: constants.ODII_ORDER_STATUS.PENDING,
        fulfillment_status: 'seller_confirmed',
      };
      ref.current.callBack(values);
      setFilter(values);
    }
  }, []);

  const handleFilter = (type, needRefresh, clear) => e => {
    const value = (e?.target?.value ?? e) || '';
    let values = {};
    if (clear) {
      if (type == 'day') {
        setTimeRanger(type);
        values = { ...filter, from_time: '', to_time: '' };
      } else {
        values = { ...filter, [type]: '' };
      }
    } else {
      values = { ...filter, [type]: value };
    }
    if (
      type === 'odii_status' &&
      value != constants.ODII_ORDER_STATUS.PENDING
    ) {
      values.fulfillment_status = '';
    }
    if (
      type === 'odii_status' &&
      value == constants.ODII_ORDER_STATUS.PENDING &&
      !value.fulfillment_status
    ) {
      values.fulfillment_status = 'seller_confirmed';
    }
    if (e.type === 'click' || needRefresh) {
      if (ref.current) {
        ref.current.callBack(values);
      }
    }
    setFilter(values);
  };

  const setTimeRanger = value => {
    let values = {};
    if (typeof value === 'string') {
      setTime(value);
      if (!GetTime(value)) {
        values = {
          ...filter,
          from_time: '',
          to_time: '',
        };
      } else {
        values = {
          ...filter,
          from_time: moment(GetTime(value)?.[0]).format('YYYY-MM-DD'),
          to_time: moment(GetTime(value)?.[1]).format('YYYY-MM-DD 23:59'),
        };
      }
    } else {
      values = {
        ...filter,
        from_time: moment(value?.[0]).format('YYYY-MM-DD'),
        to_time: moment(value?.[1]).format('YYYY-MM-DD 23:59'),
      };
    }
    ref.current.callBack(values);
  };

  const modals = [
    {
      key: PRINT_POGRESS_MODAL_KEY,
      getContent: () => (
        <PrintProgress
          key={PRINT_POGRESS_MODAL_KEY}
          visible={true}
          // onCancel={() => setCurrModalKey(null)}
          onFinish={toggleModal}
          selectedOrders={selectedOrders}
        ></PrintProgress>
      ),
    },
  ];

  const toggleModal = modalKey => {
    setCurrModalKey(currModalKey ? null : modalKey);
  };

  // const disabledDate = current => {
  //   // const dates = [filter.from_time, filter.to_time];
  //   if (!dates || dates.length === 0) {
  //     return false;
  //   }
  //   // const tooLate = dates[0] && current.diff(dates[0], 'days') > 7;
  //   // const tooEarly = dates[1] && dates[1].diff(c, 'days') > 7;
  //   const tooLate = dates[0] && dates[0] > dates[1];
  //   // if(dates[0]) return
  //   const tooEarly = dates[1] && (dates[1] >= moment() || dates[1] < dates[0]);
  //   return tooEarly || tooLate;
  // };

  // const onOpenChange = open => {
  //   if (!open && filter.from_time && filter.to_time) {
  //     // setHackValue([]);
  //     ref?.current?.callBack(filter);
  //     // setDates([]);
  //   } else {
  //     // setHackValue(undefined);
  //   }
  // };

  const countStatus = id => {
    const itemCount = summary?.find(item => item.order_status == id);
    return itemCount?.record_cnt;
  };

  const TagBoxChecked = constants?.KEY_FILTER?.map(item => {
    if (filter[item.id] != '') {
      const platform = ['lazada', 'shopee', 'tiktok', 'other'].includes(
        filter[item.id],
      );
      const print = ['printed', 'unprinted'].includes(filter[item.id]);
      return (
        <div className="tag-box-checked">
          <div className="tag-box-title">{item.name}:</div>
          <span>
            {print
              ? constants?.ORDER_PRINT_STATUS.find(
                  el => el.id == filter[item.id],
                ).name
              : !platform
              ? constants?.ORDER_FILTER_TIME.find(el => el.id == time)?.name
              : filter[item.id]}
          </span>
          <div
            className="tag-box-close"
            onClick={handleFilter(item.id, true, true)}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.5"
                d="M6.27734 4.75L9.09375 1.96094L9.66797 1.38672C9.75 1.30469 9.75 1.16797 9.66797 1.05859L9.06641 0.457031C8.95703 0.375 8.82031 0.375 8.73828 0.457031L5.375 3.84766L1.98438 0.457031C1.90234 0.375 1.76562 0.375 1.65625 0.457031L1.05469 1.05859C0.972656 1.16797 0.972656 1.30469 1.05469 1.38672L4.44531 4.75L1.05469 8.14062C0.972656 8.22266 0.972656 8.35938 1.05469 8.46875L1.65625 9.07031C1.76562 9.15234 1.90234 9.15234 1.98438 9.07031L5.375 5.67969L8.16406 8.49609L8.73828 9.07031C8.82031 9.15234 8.95703 9.15234 9.06641 9.07031L9.66797 8.46875C9.75 8.35938 9.75 8.22266 9.66797 8.14062L6.27734 4.75Z"
                fill="#919191"
              />
            </svg>
          </div>
        </div>
      );
    }
  });

  const onClickActionButton = (type, items) => {
    console.log(type, items);
    if (type.id === 'print' || type.id === 'print_pack_list') {
      toggleModal(PRINT_POGRESS_MODAL_KEY);
    } else {
      batchActionHandler(type, items);
    }
  };

  return (
    <Filter
      initState={initState}
      filter={filter}
      setFilter={setFilter}
      ref={ref}
    >
      <Tabs
        onChange={handleFilter('odii_status', true)}
        activeKey={filter?.odii_status ? filter?.odii_status : '0'}
      >
        {constants?.ORDER_FILTER_STATUS.map(v => {
          if ([1, 2, 3, 4, 7].includes(v.id)) {
            return (
              <>
                <TabPane
                  tab={`${v.name} (${countStatus(v.id) || 0})`}
                  key={v.id}
                ></TabPane>
              </>
            );
          } else {
            return (
              <>
                <TabPane tab={v.name} key={v.id}></TabPane>
              </>
            );
          }
        })}
      </Tabs>
      {/** Chờ xử lý thì hiển thị sub tab trạng thái xác nhận đơn từ seller và supplier */}
      {filter?.odii_status == constants.ODII_ORDER_STATUS.PENDING && (
        <Tabs
          onChange={handleFilter('fulfillment_status', true)}
          activeKey={
            filter?.fulfillment_status ? filter?.fulfillment_status : ''
          }
        >
          {constants?.ORDER_FILTER_WAITCONFIRM_STATUS.map(v => {
            return (
              <>
                <TabPane
                  tab={`${v.name} (${countStatus(v.id) || 0})`}
                  key={v.id}
                ></TabPane>
              </>
            );
          })}
        </Tabs>
      )}
      <Row gutter={[8, 8]}>
        <Col xs={24} lg={6}>
          <Form name="order-filter" form={form}>
            <Form.Item
              name="keyword"
              // defaultValue="son"
              rules={[
                {
                  min: 2,
                  message: 'Nội dung tìm kiếm ít nhất 2 ký tự',
                },
              ]}
            >
              <Input
                placeholder="Mã đơn, hóa đơn, tên khách hàng"
                allowClear
                size="medium"
                // color="#7C8DB5"
                color="primary"
                disabled={isLoading}
                prefix={<SearchOutlined />}
                onChange={handleFilter('keyword')}
              />
            </Form.Item>
          </Form>
        </Col>
        <Col xs={24} flex="auto">
          <Space>
            <CustomStyle width="130px">
              <Select
                color="primary"
                size="medium"
                value={filter?.platform || 0}
                onSelect={handleFilter('platform', true)}
              >
                <Option value={0}>Nền tảng</Option>
                {constants?.SALE_CHANNEL.filter(item =>
                  ['LAZADA', 'SHOPEE', 'TIKTOK', 'OTHER'].includes(item.id),
                )?.map(v => (
                  <Option value={v.id.toLowerCase()} key={v.id}>
                    <img
                      src={v?.icon}
                      alt=""
                      style={{ maxWidth: '100%', marginRight: 5 }}
                      width={15}
                    />
                    {v.name}
                  </Option>
                ))}
              </Select>
            </CustomStyle>
            <CustomStyle width="180px">
              <Select
                color="primary"
                size="medium"
                onSelect={setTimeRanger}
                value={time}
              >
                {constants?.ORDER_FILTER_TIME.map(v => (
                  <Option
                    style={{
                      background: v.id == 'day' && '#3D56A6',
                      color: v.id == 'day' && '#fff',
                    }}
                    key={v.id}
                    value={v.id}
                  >
                    {v.name}
                  </Option>
                ))}
              </Select>
            </CustomStyle>
            <CustomStyle w="130px">
              <RangePicker
                disabled={time && time != 'custom'}
                color="primary"
                className="range-picker"
                format="DD/MM/YYYY"
                // size="large"
                // onOpenChange={onOpenChange}
                value={[
                  filter.from_time && moment(filter.from_time),
                  filter.to_time && moment(filter.to_time),
                ]}
                onChange={setTimeRanger}
              />
            </CustomStyle>
            <CustomStyle width="180px">
              <Select
                color="primary"
                size="medium"
                onSelect={handleFilter('print_status', true)}
                value={
                  filter.print_status
                    ? filter.print_status
                    : constants?.ORDER_PRINT_STATUS[0].id
                }
              >
                {constants?.ORDER_PRINT_STATUS.map(v => (
                  <Option
                    style={{
                      pointerEvents:
                        v.id == constants?.ORDER_PRINT_STATUS[0].id && 'none',
                      background:
                        v.id == constants?.ORDER_PRINT_STATUS[0].id &&
                        '#3D56A6',
                      color:
                        v.id == constants?.ORDER_PRINT_STATUS[0].id && '#fff',
                    }}
                    key={v.id}
                    value={v.id}
                  >
                    {v.name}
                  </Option>
                ))}
              </Select>
            </CustomStyle>
          </Space>
        </Col>
      </Row>
      {/* <TagBox gutter={8}>{TagBoxChecked}</TagBox> */}
      {selectedOrders.hasAction && !roles?.includes('partner_source') && (
        <Row gutter={[8, 8]} style={{ marginBottom: 10 }}>
          <Col xs={24} style={{ display: 'flex' }}>
            {selectedOrders?.metadata &&
              constants.ORDER_ACTION_TYPE_NAME.map(type => {
                if (
                  selectedOrders?.metadata[type.count_name] &&
                  selectedOrders?.metadata[type.count_name] > 0
                ) {
                  return (
                    <Button
                      className="btn-sm"
                      style={{ marginRight: '10px' }}
                      onClick={() =>
                        onClickActionButton(type, selectedOrders?.items)
                      }
                      // onClick={() =>
                      //   // printNumber && toggleModal(PRINT_POGRESS_MODAL_KEY)
                      // }
                    >
                      {`${type.name} (${
                        selectedOrders?.metadata[type.count_name]
                      })`}
                    </Button>
                  );
                }
                return null;
              })}
          </Col>
        </Row>
      )}

      {modals.map(modal => currModalKey === modal.key && modal.getContent({}))}
    </Filter>
  );
});

const SelectAction = styled(Select)`
  width: 180px;
  .ant-select-selector {
    /* border: none !important; */
    /* box-shadow: none !important; */
    font-size: 14px;
    color: ${({ theme }) => theme.primary}!important;
  }
  .ant-select-selection-placeholder,
  .ant-select-selector + span {
    color: ${({ theme }) => theme.primary}!important;
  }
  .ant-select-selection-placeholder {
    padding-right: 14px !important;
  }
  .ant-select-single.ant-select-show-arrow .ant-select-selection-placeholder {
  }
  .ant-select-arrow {
    top: 46%;
    .anticon > svg {
      width: 10px;
    }
  }
`;

const TagBox = styled.div`
  display: flex;
  margin-bottom: 2px;
  .tag-box-checked {
    padding: 8px 10px;
    margin-right: 15px;
    background: #f7f7f9;
    border-radius: 4px;
    width: auto;
    min-width: 148px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;

    .tag-box-title {
      font-weight: 400;
      font-size: 14px;
      line-height: 16px;
      color: #6c798f;
    }

    span {
      padding-left: 5px;
      font-weight: 500;
      font-size: 15px;
      line-height: 16px;
    }
    .tag-box-close {
      padding-left: 10px;
      cursor: pointer;

      &:hover {
        color: #000;
      }
    }
  }
`;

export default FilterBar;
