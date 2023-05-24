import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spin, Form as F, Space } from 'antd';
import { isEmpty, pickBy, identity } from 'lodash';
import { Button, PageWrapper, Form } from 'app/components';
import { globalActions } from 'app/pages/AppPrivate/slice';
import Confirm from 'app/components/Modal/Confirm';
import Info from '../../Components/Info';
import { useProductSourceSlice } from '../../slice';
import { selectDetail, selectLoading } from '../../slice/selectors';

// import { SectionWrapper } from 'styles/commons';
const Item = F.Item;

const layout = {
  labelCol: { xs: 24, sm: 24 },
  wrapperCol: { xs: 24, sm: 24, md: 24 },
  labelAlign: 'left',
};
export function CreateAndUpdateSource({ match, history }) {
  const id = match?.params?.id; // is update
  const dispatch = useDispatch();
  const { actions } = useProductSourceSlice();
  const [form] = Form.useForm();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectDetail);
  const [, setFormValues] = useState({});
  const { setFieldsValue, submit } = form;
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
          name: 'Nguồn hàng',
          link: '/infobusiness',
        },
        {
          name: id ? 'Chi tiết nguồn hàng' : 'Thêm mới nguồn hàng',
        },
      ],
      title: 'Thêm mới',
      fixWidth: true,
    };
    if (!isEmpty(data)) {
      setFieldsValue({
        name: data?.name || '',
        id: data?.id || '',
        description: data?.description || '',
        address: data?.address || '',
        phone: data?.phone || '',
        thumb: data?.thumb || {},
      });

      dataBreadcrumb.title = data?.name;
    } else {
      if (id) dispatch(actions.getDetail(id));
    }
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
  }, [data]);

  const onClear = () => {
    dispatch(
      globalActions.showModal({
        modalType: Confirm,
        modalProps: {
          isFullWidthBtn: true,
          data: {
            message: 'Bạn có chắc chắn muốn thoát và huỷ phiên làm việc?',
          },
          callBackConfirm: () => history.push('/infobusiness'),
        },
      }),
    );
  };

  const onFinish = values => {
    const { address, ...resValues } = values;

    const dataSend = {
      ...resValues,
      name: resValues.name?.trim(),
      address: address?.toString() || '',
      phone: resValues.phone?.trim(),
    };

    if (id) {
      const { id, ...removeId } = data;
      let payload = pickBy(
        {
          ...removeId,
          ...dataSend,
        },
        identity,
      );
      dispatch(
        actions.updateAndCreate({
          id,
          data: payload,
        }),
      );
    } else {
      let payload = pickBy(dataSend, identity);
      dispatch(
        actions.updateAndCreate({
          data: payload,
          push: history.push,
        }),
      );
    }
  };

  return (
    <PageWrapper fixWidth>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <Form
          form={form}
          name="normal_login"
          className="login-form"
          onValuesChange={setFormValues}
          onFinish={onFinish}
        >
          <>
            <Info layout={layout} form={form} />
            <Item shouldUpdate>
              <div className="d-flex justify-content-end">
                <Space align="baseline">
                  <Button color="grayBlue" onClick={onClear} className="btn-sm">
                    <span>Hủy</span>
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="btn-sm mr-2"
                    // disabled={!id}
                    width={100}
                    color="blue"
                  >
                    <span>Lưu</span>
                  </Button>
                </Space>
              </div>
            </Item>
          </>
        </Form>
      </Spin>
    </PageWrapper>
  );
}
