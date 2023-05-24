import React, { useState, useEffect } from 'react';
import { Row, Col, Spin, Space } from 'antd';
import {
  Button,
  PageWrapper,
  Form,
  Input,
  DatePicker,
  Tabs,
} from 'app/components';
import { SectionWrapper } from 'styles/commons';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { useDispatch, useSelector } from 'react-redux';
import { selectDetail, selectLoading } from '../../slice/selectors';
import { usePromotionSlice } from '../../slice';
import { styledSystem } from 'styles/theme/utils';
import styled from 'styled-components/macro';
import { CustomStyle } from 'styles/commons';
import Confirm from 'app/components/Modal/Confirm';
import SuggestName from '../../components/SuggestName';
import ListProduct from '../../components/ListProduct';
import { isEmpty, pickBy, identity } from 'lodash';
import moment from 'moment';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import Description from '../../components/Description';
import notification from 'utils/notification';
import { ListDiscount } from '../index';

const Item = Form.Item;
const { TabPane } = Tabs;

const layout = {
  labelCol: { xs: 24, sm: 24 },
  wrapperCol: { xs: 24, sm: 24, md: 24 },
  labelAlign: 'left',
};

export function Detail({ match, history }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { actions } = usePromotionSlice();
  const id = match?.params?.id;
  const data = useSelector(selectDetail);
  const isLoading = useSelector(selectLoading);
  const userSup = useSelector(selectCurrentUser);
  const [products, setProducts] = useState([]);
  const [, setFormValues] = useState({});
  const { setFieldsValue, getFieldsValue } = form;

  const { name, approved_by, approved_time } = getFieldsValue();

  useEffect(() => {
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
      dispatch(actions.getDetailDone({}));
    };
  }, []);

  const gotoPage = (data = '', isReload) => {
    dispatch(actions.getDetailDone({}));
  };

  useEffect(() => {
    const dataBreadcrumb = {
      menus: [
        {
          name: 'Khuyến mại',
          link: '/promotion',
        },
        {
          name: 'Chi tiết khuyến mại',
        },
      ],
      fixWidth: true,
      actions: (
        <Item className="m-0" shouldUpdate>
          <div className="d-flex justify-content-between">
            <Space>
              {userSup?.roles?.includes('owner') &&
                ['awaiting', 'active'].includes(data?.status_validate) && (
                  <Button
                    className="btn-sm mr-2 "
                    onClick={submitWithStatus(id)}
                    color={data?.is_approve ? 'red' : 'blue'}
                  >
                    {!data?.is_approve ? 'Duyệt KM' : 'Dừng KM'}
                  </Button>
                )}
            </Space>
          </div>
        </Item>
      ),
    };
    if (!isEmpty(data)) {
      setFieldsValue({
        name: data?.name || '',
        note: data?.note || '',
        from_time: moment(data?.from_time),
        to_time: moment(data?.to_time),
        approved_by: data?.approved_by,
        approved_time: moment(data?.approved_time),
      });
      setProducts(data?.products || [{}]);
      dataBreadcrumb.title = data?.name;
    } else {
      dispatch(actions.getDetail(id));
    }
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
  }, [data]);

  const submitWithStatus = value => () => {
    dispatch(
      actions.updateState({
        id: value,
        data: { approved_by, approved_time },
        onSuccess: () => {
          gotoPage('', true);
        },
      }),
    );
  };

  const onClear = () => {
    dispatch(
      globalActions.showModal({
        modalType: Confirm,
        modalProps: {
          isFullWidthBtn: true,
          data: {
            message: 'Bạn có chắc chắn muốn thoát và huỷ phiên làm việc?',
          },
          callBackConfirm: () => history.push('/promotion'),
        },
      }),
    );
  };

  const onFinish = values => {
    const handleproducts = products.map(item => pickBy(item, identity));
    const dataSend = {
      ...values,
      type: data?.type,
      products: handleproducts,
      from_time: moment(values.from_time),
      to_time: moment(values.to_time),
    };
    const handleDataSend = pickBy(dataSend, identity);
    dispatch(
      actions.updateAndCreate({
        id,
        data: handleDataSend,
        onSuccess: () => {
          gotoPage('', true);
        },
      }),
    );
  };

  const onFinishFailed = ({ errorFields }) => {
    let descriptionErr = '';
    for (const iterator of errorFields) {
      descriptionErr = `
      ${descriptionErr ? `${descriptionErr},` : descriptionErr}
      ${iterator.errors[0]}
        `;
    }
    notification('error', descriptionErr, 'Vui lòng điền \n thêm thông tin!');
  };

  const onDelPromotion = () => {
    dispatch(
      globalActions.showModal({
        modalType: Confirm,
        modalProps: {
          isFullWidthBtn: true,
          data: {
            message: 'Bạn có chắc chắn muốn xóa không?',
          },
          callBackConfirm: () => {
            dispatch(
              actions.delPromotion({
                id,
              }),
            );
            history.push('/promotion');
          },
        },
      }),
    );
  };

  const formDetail = () => (
    <Form
      form={form}
      scrollToFirstError
      {...layout}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      onValuesChange={setFormValues}
    >
      <Row gutter={24}>
        <Col span={17}>
          <CustomSectionWrapper mt={{ xs: 's4' }}>
            <Item
              name="name"
              label="Tên chương trình"
              products={[
                {
                  required: true,
                  message: 'Không được để trống ô tên!',
                },
                {
                  min: 10,
                  message:
                    'Tên chương trình của bạn quá ngắn. Vui lòng nhập ít nhất 10 kí tự.',
                },
              ]}
            >
              <Input
                showCount
                maxLength={120}
                minLength={10}
                placeholder="Nhập tên chương trình khuyến mại"
                suffix={
                  <CustomStyle color="gray3">{`| ${
                    name?.length ?? 0
                  }/120`}</CustomStyle>
                }
              />
            </Item>
          </CustomSectionWrapper>
          <CustomSectionWrapper mt={{ xs: 's4' }}>
            <div className="title">Thông tin</div>
            <Row gutter={24}>
              <Col xs={24} lg={12}>
                <Item name="from_time" label="Thời gian bắt đầu">
                  <DatePicker
                    style={{ width: '100%' }}
                    showTime
                    disabled={
                      data?.is_approve ||
                      ['active', 'expired']?.includes(data?.status_validate)
                    }
                    format="YYYY/MM/DD HH:mm"
                  />
                </Item>
              </Col>
              <Col xs={24} lg={12}>
                <Item name="to_time" label="Thời gian kết thúc">
                  <DatePicker
                    style={{ width: '100%' }}
                    showTime
                    disabled={
                      data?.is_approve ||
                      data?.status_validate?.includes('expired')
                    }
                    format="YYYY/MM/DD HH:mm"
                  />
                </Item>
              </Col>
            </Row>
            {data?.approved_by && (
              <Row gutter={24}>
                <Col xs={24} lg={12}>
                  <Item name="approved_by" label="Người duyệt">
                    <Input placeholder="Nhập tên người duyệt" disabled={true} />
                  </Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Item name="approved_time" label="Ngày duyệt">
                    <DatePicker
                      style={{ width: '100%' }}
                      showTime
                      disabled={true}
                      format="YYYY/MM/DD HH:mm"
                    />
                  </Item>
                </Col>
              </Row>
            )}

            <Description layout={layout} form={form} />
          </CustomSectionWrapper>
        </Col>
        <Col span={7}>
          <SuggestName layout={layout} />
          <CustomSectionWrapper mt={{ xs: 's4' }}>
            <div className="title">Trạng thái duyệt</div>
            <CustomStyle
              mb={{ xs: 's6' }}
              fontSize={{ xs: 'f3' }}
              fontWeight="bold"
              color={data?.is_approve ? 'greenMedium' : '#ff9877'}
            >
              {data?.is_approve ? 'Đã duyệt' : 'Chờ duyệt'}
            </CustomStyle>
          </CustomSectionWrapper>
          <CustomSectionWrapper mt={{ xs: 's4' }}>
            <div className="title">Phương thức khuyến mại</div>
            <CustomStyle
              mb={{ xs: 's6' }}
              fontSize={{ xs: 'f3' }}
              fontWeight="bold"
            >
              {data?.type?.includes('product_by')
                ? 'Giảm giá trên từng sản phẩm'
                : 'Chiết khấu theo số lượng bán'}
            </CustomStyle>
          </CustomSectionWrapper>
          <CustomSectionWrapper mt={{ xs: 's4' }}>
            <div className="title">Người tạo</div>
            <CustomStyle mb={{ xs: 's6' }} fontSize={{ xs: 'f2' }}>
              <Input
                value={data?.name_creator}
                placeholder="Nhập tên người tạo"
                disabled={true}
              />
            </CustomStyle>
            <div className="title">Ngày tạo</div>
            <CustomStyle mb={{ xs: 's6' }} fontSize={{ xs: 'f2' }}>
              <DatePicker
                value={moment(data?.created_at)}
                style={{ width: '100%' }}
                showTime
                disabled={true}
                format="YYYY/MM/DD HH:mm"
              />
            </CustomStyle>
          </CustomSectionWrapper>
        </Col>
      </Row>
      <Row gutter={24}>
        <ListProduct
          layout={layout}
          products={products}
          setProducts={setProducts}
          typeMethod={data?.type}
          data={data}
          gotoPage={gotoPage}
        />
      </Row>
      <Item shouldUpdate>
        <Row>
          <Col xs={24} md={24}>
            <CustomStyle className="d-flex justify-content-end">
              <Space>
                <Button
                  color="grayBlue"
                  onClick={onDelPromotion}
                  className="btn-sm"
                  width={80}
                  disabled={
                    data?.is_approve ||
                    ['active', 'expired']?.includes(data?.status_validate)
                  }
                >
                  <span>Xóa</span>
                </Button>
                <Button
                  color="grayBlue"
                  onClick={onClear}
                  className="btn-sm"
                  width={80}
                >
                  <span>Hủy</span>
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  width={100}
                  className="btn-sm mr-2"
                  disabled={
                    data?.is_approve ||
                    data?.status_validate?.includes('expired')
                  }
                  color="blue"
                >
                  <span>Lưu</span>
                </Button>
              </Space>
            </CustomStyle>
          </Col>
        </Row>
      </Item>
    </Form>
  );

  return (
    <PageWrapper fixWidth>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Chi tiết" key="1">
          <Spin tip="Đang tải..." spinning={isLoading}>
            {formDetail()}
          </Spin>
        </TabPane>
        <TabPane tab="Theo dõi" key="2">
          <CustomSectionWrapper>
            <ListDiscount
              isLoading={isLoading}
              promotionId={id}
              typeQuantity={
                !!(
                  data.type === 'quantity_by' &&
                  data?.status_validate?.includes('expired')
                )
              }
              typeProduct={!!(data.type === 'product_by')}
            />
          </CustomSectionWrapper>
        </TabPane>
      </Tabs>
    </PageWrapper>
  );
}

export const CustomSectionWrapper = styledSystem(styled(SectionWrapper)`
  width: 100%;
  padding: 16px 20px
  box-shadow: 0px 4px 10px rgba(30, 70, 117, 0.05);
  border-radius: 4px;
  .title {
    color: #000;
    font-weight: 500;
    font-size: 14px;
    margin-bottom: 1rem;
  }
  input,
  .ant-tag,
  .ant-select-selector {
    border-radius: 4px;
  }
  label {
    font-weight: 500;
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
`);
