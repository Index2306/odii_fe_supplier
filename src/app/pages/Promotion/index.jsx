import React, { useState } from 'react';
import { Modal, Divider, Form, Space } from 'antd';
import {
  PageWrapper,
  Button,
  LoadingIndicator,
  Select,
  Input,
  DatePicker,
} from 'app/components';
import styled from 'styled-components';
import { CustomH3, SectionWrapper } from 'styles/commons';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';
import { PlusCircleOutlined } from '@ant-design/icons';
import { selectLoading } from './slice/selectors';
import { useSelector, useDispatch } from 'react-redux';
import { usePromotionSlice } from './slice';
import moment from 'moment';
import { ListPromotion } from './features';

const { Option } = Select;
const { RangePicker } = DatePicker;
const Item = Form.Item;

export function Promotion({ history }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const isLoading = useSelector(selectLoading);
  const { actions } = usePromotionSlice();
  const dispatch = useDispatch();

  const { resetFields } = form;
  const [visibleModal, setVisibleModal] = useState(false);

  const gotoPage = (data = '', isReload) => {
    let payload = isReload ? history?.location?.search : data;
    if (!payload) {
      payload = '?page=1&page_size=10';
    }
    dispatch(actions.getData(payload));
  };

  React.useEffect(() => {
    const delaySecond = 60000;
    let reloadPageInterval;
    let reloadPageTimeout;
    reloadPageTimeout = setTimeout(() => {
      reloadPageInterval = setInterval(() => {
        gotoPage('', true);
      }, delaySecond);
    }, delaySecond);
    return () => {
      clearInterval(reloadPageInterval);
      clearTimeout(reloadPageTimeout);
    };
  }, []);

  const formatDate = dateStr => {
    const date = moment(dateStr);
    const dateFormatted = date.format('YYYY-MM-DD');
    return dateFormatted;
  };

  const onClose = () => {
    setVisibleModal(false);
    onClear();
  };

  const onClear = () => {
    resetFields();
  };

  const onFinish = async value => {
    let values = await form.validateFields();
    const key = `${formatDate(values?.key[0])}_${formatDate(values?.key[1])}`;
    value = {
      ...values,
      from_time: moment(values?.key[0]).format('YYYY-MM-DD HH:mm'),
      to_time: moment(values?.key[1]).format('YYYY-MM-DD HH:mm'),
      key: key,
    };
    dispatch(actions.updateAndCreate({ data: value }));
    setVisibleModal(false);
    resetFields();
    gotoPage('', true);
  };

  const goCreate = () => {
    setVisibleModal(true);
  };

  return (
    <PageWrapper>
      <CustomDiv className="header d-flex justify-content-between">
        <CustomH3 className="title " mb={{ xs: 's6' }}>
          {t(messages.title())}
        </CustomH3>
        <Button className="btn-sm" color="blue" onClick={goCreate}>
          <PlusCircleOutlined /> &ensp; Thêm khuyến mại
        </Button>
      </CustomDiv>
      <CustomSectionWrapper>
        <ListPromotion isLoading={isLoading} history={history} />
      </CustomSectionWrapper>

      <CustomModal
        name="modal_add_promotion"
        visible={visibleModal}
        footer={null}
        onCancel={onClose}
        style={{ height: 'calc(100vh - 200px)' }}
        // bodyStyle={{ overflowY: 'scroll' }}
      >
        {isLoading && <LoadingIndicator />}
        <Form form={form} name="form_add_promotion" onFinish={onFinish}>
          <Item>
            <div className="title"> Thêm chương trình khuyến mại</div>
          </Item>
          <CustomItem
            name="name"
            label="Tên chương trình"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập chương trình khuyến mại',
              },
              {
                min: 10,
                max: 120,
                message: 'Không vượt quá 120 ký tự',
              },
            ]}
          >
            <Input placeholder="Nhập chương trình khuyến mại" size="medium" />
          </CustomItem>
          <CustomItem
            name="key"
            label="Thời gian áp dụng"
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn thời gian áp dụng',
              },
            ]}
          >
            <RangePicker
              className="range-picker"
              format="YYYY/MM/DD HH:mm"
              size="medium"
              showTime
            />
          </CustomItem>
          <CustomItem
            name="type"
            label="Phương thức khuyến mại"
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn phương thức',
              },
            ]}
          >
            <Select placeholder="Chọn phương thức" size="medium">
              <Option value="product_by">Giảm giá trên từng sản phẩm</Option>
              <Option value="quantity_by">Chiết khấu theo số lượng bán</Option>
            </Select>
          </CustomItem>
          <Divider />
          <div className="d-flex justify-content-end">
            <Space align="end">
              <Button
                context="secondary"
                className="btn-sm"
                color="default"
                style={{ color: 'white', background: '#6c798F' }}
                onClick={onClose}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                className="btn-sm"
                color="blue"
                htmlType="submit"
              >
                Xác nhận
              </Button>
            </Space>
          </div>
        </Form>
      </CustomModal>
    </PageWrapper>
  );
}

const CustomSectionWrapper = styled(SectionWrapper)`
  p {
    margin-top: 14px;
  }
  .hide {
    visibility: hidden;
  }
  .group-btn {
    display: none;
  }
  .box-status:hover .group-btn {
    display: block;
  }
  .action-wrapper {
    display: none;
    position: absolute;
    padding: 0;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    white-space: nowrap;
    word-break: keep-all;
    > div {
      display: inline-flex;
      > button {
        margin-left: 11px;
      }
    }
    button {
      margin: auto;
    }
  }
  tr:hover {
    .action-wrapper {
      display: inline-flex;
    }
  }
`;

const CustomDiv = styled.div`
  margin-bottom: 12px;
`;

const CustomModal = styled(Modal)``;

const CustomItem = styled(Item)``;
