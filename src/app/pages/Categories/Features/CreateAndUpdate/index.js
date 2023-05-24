import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import styled from 'styled-components/macro';
import { isEmpty } from 'lodash';
import { Row, Col, Spin, Form as F, message, Space, Select } from 'antd';
import { selectLoading, selectDetail, selectData } from '../../slice/selectors';
import { useCategoriesSlice } from '../../slice';
import { Button, PageWrapper, Form, Input } from 'app/components';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { SectionWrapper } from 'styles/commons';

const Item = F.Item;

export function CreateAndUpdateCategories({ match, history }) {
  const id = match?.params?.id;
  const dispatch = useDispatch();
  const { actions } = useCategoriesSlice();
  const [form] = Form.useForm();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectDetail);
  const dataParent = useSelector(selectData);
  const [Parent, setParent] = React.useState({});
  const { Option } = Select;

  useEffect(() => {
    dispatch(
      globalActions.setDataBreadcrumb({
        menus: [
          {
            name: 'Danh mục',
          },
          {
            name: id ? 'Cập nhật' : 'Thêm mới',
          },
        ],
        title: `${id ? 'Cập nhật' : 'Thêm'} danh mục`,
      }),
    );
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
      dispatch(actions.getDetailDone({}));
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(data)) {
      form.setFieldsValue({
        name: data?.name || '',
        thumb: data?.thumb || null,
        description: data?.description || '',
        parent_id: data?.parent_id || '',
      });
    } else {
      if (id) dispatch(actions.getDetail(id));
    }
  }, [data]);

  const goBack = () => {
    history.push('/categories');
  };

  const onClear = () => {
    if (id) {
      form.setFieldsValue({
        name: data?.name || '',
        thumb: data?.thumb || null,
        description: data?.description || '',
        parent_id: data?.parent_id || '',
      });
    } else {
      form.resetFields();
    }
  };

  const onFinish = values => {
    if (
      !form.isFieldsTouched(
        id
          ? ['name', 'thumb', 'description', 'parent_id']
          : ['name', 'thumb', 'description', 'parent_id'],
      )
    ) {
      return message.error('Vui lòng thêm thông tin!');
    }
    if (id) {
      dispatch(
        actions.update({
          id,
          data: {
            ...data,
            name: values.name.trim(),
            description: values.description.trim(),
            parent_id: values.parent_id,
          },
        }),
      );
    } else {
      dispatch(
        actions.create({
          data: {
            ...data,
            name: values.name.trim(),
            description: values.description.trim(),
            parent_id: values.parent_id,
          },
        }),
      );
    }
  };

  const onSelectParen = value => {
    setParent(value);
  };
  const layout = {
    labelCol: { xs: 24, sm: 7 },
    wrapperCol: { xs: 24, sm: 12, md: 10 },
  };
  const tailLayout = {
    wrapperCol: { offset: 7, span: 16 },
  };

  return (
    <PageWrapper>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <Form
          form={form}
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <>
            <Row gutter={24}>
              <Col span={24}>
                <Item shouldUpdate>
                  <div className="d-flex justify-content-between">
                    <Button onClick={goBack} className="btn-md" color="green">
                      <span>Trở về</span>
                    </Button>
                  </div>
                </Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={24}>
                <SectionWrapper mt={{ xs: 's4' }}>
                  <div className="">
                    <Item name="parent_id" label="Parent" {...layout}>
                      <Select
                        showSearch
                        placeholder="Select a Parent"
                        onChange={onSelectParen}
                        value={Parent}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {dataParent.map(parent => (
                          <Option value={parent.id}>{parent.name}</Option>
                        ))}
                      </Select>
                    </Item>
                    <Item
                      name="name"
                      label="Tên"
                      {...layout}
                      rules={[
                        {
                          required: true,
                          message: 'Please input Name category!',
                        },
                      ]}
                    >
                      <Input placeholder="Please input Name Category" />
                    </Item>
                    <Item name="thumb" label="Thumb" {...layout}>
                      <Input placeholder="Please input thumb" />
                    </Item>
                    <Item name="description" label="Mô tả" {...layout}>
                      <Input placeholder="Please input Description" />
                    </Item>
                    <Item shouldUpdate {...tailLayout}>
                      <Space>
                        <Button
                          // onClick={onMenuClick(null, 2)}
                          type="primary"
                          htmlType="submit"
                          className="btn-md mr-2"
                          // disabled={!id}
                          color="blue"
                        >
                          <span>{id ? 'Cập nhật' : 'Lưu'}</span>
                        </Button>
                        <Button
                          context="secondary"
                          color="red"
                          onClick={onClear}
                          className="btn-md"
                        >
                          <span>Reset</span>
                        </Button>
                      </Space>
                    </Item>
                  </div>
                </SectionWrapper>
              </Col>
            </Row>
          </>
        </Form>
      </Spin>
    </PageWrapper>
  );
}
