/**
 *
 * Employees
 *
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
  Row,
  Col,
  Spin,
  Modal,
  Form as F,
  Checkbox,
  Divider,
  Select,
  Tooltip,
} from 'antd';
import {
  PlusCircleOutlined,
  ShopOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { isEmpty } from 'lodash';
import {
  Button,
  Table,
  PageWrapper,
  BoxColor,
  LoadingIndicator,
  Form,
  Input,
  Link,
  Avatar,
} from 'app/components';
import constants from 'assets/constants';
import { CustomH3, CustomStyle, SectionWrapper } from 'styles/commons';
import { useEmployeesSlice } from './slice';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import { FilterBar } from './Features';
import {
  selectLoading,
  selectData,
  selectDataRole,
  selectListSelected,
  selectPagination,
  selectDataSourceIds,
} from './slice/selectors';
import { tooltip } from 'assets/images/dashboards';
import { messages } from './messages';
import { formatDate } from 'utils/helpers';
import styled from 'styled-components';
const { roles } = constants;
const { Option } = Select;
const Item = F.Item;

export function Employees({ history }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { actions } = useEmployeesSlice();
  const listSelected = useSelector(selectListSelected);
  const currentUser = useSelector(selectCurrentUser);
  const dataSourceIds = useSelector(selectDataSourceIds);
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectData);
  const dataRoles = useSelector(selectDataRole);
  const pagination = useSelector(selectPagination);

  const [dataRolesFormat, setDataRolesFormat] = useState([]);
  const [visibleModal, setvisibleModal] = useState('');
  const [role_ids, setRole_Ids] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [listOwner, setListOwner] = useState([]);
  const [allSourceId, setAllSourceId] = useState([]);
  const [isDisabledSource, setIsDisabledSource] = useState(false);
  const [source_ids, setSource_Ids] = useState([]);
  const [isRole, setIsRole] = useState({
    owner: false,
    partner_source: false,
  });

  const host = process.env.REACT_APP_IMAGE_STATIC_HOST + '/';

  const gotoPage = (data = '', isReload) => {
    dispatch(actions.getData(isReload ? history.location.search : data));
  };

  const onChangeSeleclRole = value => {
    if (value === 'owner') {
      setIsDisabled(!isDisabled);
      setIsRole(prev => ({ ...prev, partner_source: !isDisabled }));
    } else if (value === 'partner_source') {
      setIsDisabled(!isDisabled);
      setIsRole(prev => ({ ...prev, owner: !isDisabled }));
    }
  };

  useEffect(() => {
    dispatch(actions.getDataRole({}));
    dispatch(actions.getDataSourceIds({}));
  }, []);

  useEffect(() => {
    const delaySecond = 10000;
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

  useEffect(() => {
    // dispatch(actions.getData({}));
    dispatch(actions.getDataRole({}));
    dispatch(actions.getDataSourceIds({}));
  }, []);

  useEffect(() => {
    const formatDataRoles = () => {
      if (!isEmpty(dataRoles)) {
        const temp = dataRoles
          .map(item => {
            return {
              ...item,
              titleFormat: item.title.replace('partner_', ''),
            };
          })
          .map(item => {
            return {
              ...item,
              titleFormat: item.title.replace('owner', 'Admin'),
            };
          })
          .map(item2 => {
            return {
              ...item2,
              titleFormat:
                item2.titleFormat.charAt(0).toUpperCase() +
                item2.titleFormat.substr(1),
            };
          });
        setDataRolesFormat(temp);
      }
    };
    formatDataRoles();
  }, [dataRoles]);

  useEffect(() => {
    const getAllSource = () => {
      if (!isEmpty(dataSourceIds)) {
        const temp = [];
        for (let source of dataSourceIds) {
          if (isEmpty(source?.user_id)) {
            temp.push(source?.id);
          }
        }
        setAllSourceId(temp);
      }
    };
    getAllSource();
  }, [dataSourceIds]);

  const rowSelection = {
    onChange: selectedRowKeys => {
      // setListOption([]);'
      dispatch(actions.setListSelected(selectedRowKeys));
    },
    getCheckboxProps: record => ({
      disabled: listOwner.includes(record.id) || record.is_owner === true,
      name: record.name,
    }),
  };

  const onClose = () => {
    setvisibleModal(false);
    setRole_Ids([]);
    setSource_Ids([]);
  };

  const goCreate = () => {
    setvisibleModal(true);
  };

  const onChangeRole = values => {
    setRole_Ids(values);
    if (values?.includes('1')) {
      setIsDisabled(true);
      setRole_Ids(['1']);
    }
    const partnerSrcRole = dataRolesFormat.find(
      item => values.includes(item.id) && item.title === 'partner_source',
    );
    // console.log('found role', userRole);
    if (!isEmpty(partnerSrcRole)) {
      setRole_Ids([partnerSrcRole.id]);
    }
  };

  const onChangeSourceIds = values => {
    if (values?.includes('all')) {
      setIsDisabledSource(true);
      setSource_Ids(allSourceId);
    } else {
      setSource_Ids(values);
      setIsDisabledSource(false);
    }
  };

  const onFinish = values => {
    dispatch(
      actions.inviteUser({
        data: {
          // ...recordDetail,
          full_name: values?.full_name.trim(),
          email: values?.email.trim(),
          role_ids: role_ids,
          source_ids: source_ids,
        },
      }),
    );
    setSource_Ids([]);
    setvisibleModal(false);
    setIsDisabled(false);
    setIsRole({
      owner: false,
      partner_source: false,
    });
    form.resetFields();
  };

  const columns = React.useMemo(
    () => [
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Nhân viên</div>
          </div>
        ),
        dataIndex: 'full_name',
        key: 'full_name',
        width: 200,
        render: (text, record) => {
          return (
            <>
              <CustomAvatar
                src={
                  record.avatar?.location
                    ? host + record.avatar?.location
                    : record.avatar?.origin
                }
                icon={<UserOutlined />}
              />
              &emsp;
              <CustomLink to={`/employees/${record.id}/detail/profile`}>
                {text || 'N/A'}
              </CustomLink>
            </>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Vai trò</div>
          </div>
        ),
        width: 170,
        render: (_, record) => {
          let temp = '';
          if (record.is_owner) {
            listOwner.push(record.id);
            return <CustomDivRoleOwner>Owner</CustomDivRoleOwner>;
          } else {
            for (const role of record.roles) {
              temp =
                temp +
                ', ' +
                (role.title === 'owner'
                  ? role.title.replace('owner', 'Admin')
                  : role.title === 'partner_source'
                  ? role.title.replace('partner_source', 'Product Source')
                  : role.title.replace('partner_', '').charAt(0).toUpperCase() +
                    role.title.replace('partner_', '').substr(1));
            }
          }
          return (
            <>
              <CustomDivRole>{temp.substr(1)}</CustomDivRole>
            </>
          );
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Tài khoản Email</div>
          </div>
        ),
        dataIndex: 'email',
        key: 'email',
        width: 200,
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Điện thoại</div>
          </div>
        ),
        dataIndex: 'phone',
        key: 'phone',
        width: 100,
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Giới tính</div>
          </div>
        ),
        dataIndex: 'gender',
        key: 'gender',
        width: 100,
        align: 'center',
        render: text => {
          return <div>{t(`user.${text}`)}</div>;
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Ngày tham gia</div>
          </div>
        ),
        dataIndex: 'created_at',
        key: 'created_at',
        width: 150,
        render: text => {
          return <div style={{ color: '#828282' }}>{formatDate(text)}</div>;
        },
      },
      {
        title: (
          <div className="custome-header">
            <div className="title-box">Trạng thái</div>
          </div>
        ),
        dataIndex: 'status',
        key: 'status',
        width: 120,
        align: 'center',
        render: (text, record) => {
          const currentStatus = constants.EMPLOYEE_STATUS.find(
            v => v.id === text,
          );
          return (
            <BoxColor
              fontWeight="medium"
              colorValue={currentStatus?.color}
              width="120px"
            >
              {currentStatus?.name || ''}
            </BoxColor>
          );
        },
      },
    ],
    [data],
  );

  return (
    <PageWrapper>
      <CustomDiv className="header d-flex justify-content-between">
        <CustomH3 className="title " mb={{ xs: 's6' }}>
          {t(messages.title())}
        </CustomH3>
        <Button
          className="btn-sm"
          onClick={goCreate}
          color="blue"
          disabled={isLoading || !currentUser?.roles.includes(roles.owner)}
        >
          <PlusCircleOutlined /> &ensp; Thêm nhân viên
        </Button>
      </CustomDiv>
      <CustomSectionWrapper>
        <CustomStyle className="title text-left" my={{ xs: 's5' }}>
          <FilterBar
            isLoading={isLoading}
            gotoPage={gotoPage}
            history={history}
            showAction={!isEmpty(listSelected)}
          />
        </CustomStyle>
        <Spin tip="Đang tải..." spinning={isLoading}>
          <Row gutter={24}>
            <Col span={24}>
              <div>
                <Table
                  className="custom"
                  rowSelection={{
                    selectedRowKeys: listSelected,
                    type: 'checkbox',
                    ...rowSelection,
                  }}
                  columns={columns}
                  searchSchema={{
                    keyword: {
                      required: false,
                    },
                    status: {
                      required: false,
                    },
                  }}
                  data={{ data, pagination }}
                  scroll={{ x: 1100, y: 1000 }}
                  actions={gotoPage}
                  rowKey={record => record.id}
                />
              </div>
            </Col>
          </Row>
        </Spin>
      </CustomSectionWrapper>
      <CustomModal
        name="modal_inviteUser"
        visible={visibleModal}
        footer={null}
        className="modal-invite"
        onCancel={onClose}
      >
        {isLoading && <LoadingIndicator />}
        <Form
          form={form}
          name="form-invite"
          className="form-invite"
          initialValues={{}}
          onFinish={onFinish}
        >
          <Item>
            <div className="title">Thêm nhân viên</div>
            <div className="content">
              Gửi lời mời tham gia hệ thống đến nhân viên của bạn
            </div>
          </Item>
          <CustomItem
            name="full_name"
            label="Họ tên nhân viên"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập họ tên nhân viên',
              },
            ]}
          >
            <Input
              className="input"
              placeholder="Nhập chính xác họ tên nhân viên"
            />
          </CustomItem>
          <CustomItem
            name="email"
            label="Email nhân viên"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập email',
              },
              {
                type: 'email',
                message: 'Email chưa đúng định dạng',
              },
            ]}
          >
            <Input
              className="input"
              placeholder="Nhập chính xác email nhân viên"
            />
          </CustomItem>
          <CustomItem
            name="source_ids"
            label="Nguồn hàng"
            className="source"
            rules={[
              {
                required: isRole?.owner,
                message: 'Vui lòng chọn nguồn hàng!',
              },
            ]}
          >
            <CustomSelect
              mode="multiple"
              allowClear
              optionLabelProp="label"
              optionFilterProp="label"
              placeholder="Chọn nguồn hàng nếu Role là nhà cung cấp hàng"
              maxTagCount="responsive"
              onChange={onChangeSourceIds}
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="all" label="Tất cả nguồn hàng">
                <CustomDivSource>
                  <CustomAvatar src={<ShopOutlined />} />
                  <div className="source-info">
                    <div className="source-name">Tất cả nguồn hàng</div>
                  </div>
                </CustomDivSource>
              </Option>
              {dataSourceIds?.map((source, index) => {
                return (
                  <Option
                    value={source?.id}
                    key={index}
                    label={source?.name}
                    disabled={
                      isDisabledSource
                        ? isDisabledSource
                        : source?.user_id
                        ? true
                        : false
                    }
                  >
                    <CustomDivSource>
                      <CustomAvatar
                        src={source?.thumb?.origin}
                        icon={<ShopOutlined />}
                      />
                      <div className="source-info">
                        <div className="source-name">{source?.name}</div>
                        <div className="source-address">{source?.address}</div>
                      </div>
                      {source?.user_id && (
                        <Tooltip
                          placement="top"
                          title={`${source?.name} đang cấp quyền cho tài khoản: ${source?.email}`}
                        >
                          <img className="tooltip" src={tooltip} alt="" />
                        </Tooltip>
                      )}
                    </CustomDivSource>
                  </Option>
                );
              })}
            </CustomSelect>
          </CustomItem>

          <CustomItem
            name="role_ids"
            label="Vai trò"
            // className="required"
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn vai trò!',
              },
            ]}
          >
            <Checkbox.Group style={{ width: '100%' }} onChange={onChangeRole}>
              {dataRolesFormat
                ? dataRolesFormat?.map((role, index) => (
                    <Checkbox
                      value={role?.id}
                      key={index}
                      disabled={
                        role?.title === 'owner'
                          ? isRole.owner
                          : role?.title === 'partner_source'
                          ? isRole.partner_source
                          : isDisabled
                      }
                      onClick={
                        role?.title === 'owner' ||
                        role?.title === 'partner_source'
                          ? () => onChangeSeleclRole(role?.title)
                          : // setIsChecked(!isChecked)
                            ''
                      }
                    >
                      <div className="titleRole">{role?.titleFormat}</div>
                      <div className="contentRole">
                        {role?.description === 'Chủ tài khoản'
                          ? 'Quản trị viên'
                          : role?.description}
                      </div>
                    </Checkbox>
                  ))
                : ''}
            </Checkbox.Group>
          </CustomItem>
          <Divider />
          <CustomItemButton>
            <div className="mr-20">
              <CustomButton
                className="btn-sm btn-cancel"
                context="secondary"
                color="blue"
                onClick={onClose}
              >
                Hủy
              </CustomButton>
            </div>
            <div>
              <CustomButton
                type="primary"
                className="btn-sm"
                color="blue"
                htmlType="submit"
              >
                Gửi lời mời
              </CustomButton>
            </div>
          </CustomItemButton>
        </Form>
      </CustomModal>
    </PageWrapper>
  );
}
const CustomDiv = styled.div`
  margin-bottom: 12px;
`;
const CustomSectionWrapper = styled(SectionWrapper)`
  p {
    margin-top: 14px;
  }
`;

const CustomModal = styled(Modal)`
  .ant-modal-content {
    background: #f4f6fd;
    border-radius: 6px;
  }
  .title {
    font-weight: bold;
    font-size: 18px;
    line-height: 21px;
    color: #3d56a6;
  }
  .content {
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
  }
  .ant-divider-horizontal {
    min-width: 520px;
    margin: 24px -24px 18px;
  }
  .source {
    .ant-select-selector {
      height: 40px;
    }
  }
  .required {
    .ant-form-item-label {
      &::before {
        display: inline-block;
        color: #ff4d4f;
        font-size: 14px;
        font-family: SimSun, sans-serif;
        line-height: 1;
        content: '*';
        margin-right: 4px;
      }
    }
  }
`;
const CustomItem = styled(Item)`
  display: block;
  .ant-form-item-label {
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: #333333;
  }
  .label-desc {
    margin-bottom: 16px;
  }
  .ant-checkbox-group {
    display: grid;
    background-color: white;
    border-radius: 4px;
    padding-left: 8px;
    padding-top: 8px;
    border: 1px solid #ebebf0;
    .ant-checkbox-wrapper {
      margin-left: 0;
      &:not(:last-child) {
        margin-bottom: 16px;
      }
      .ant-checkbox {
        top: 12px;
        position: relative;
      }
      .ant-checkbox-inner {
        border-radius: 50%;
      }
    }
  }
  .titleRole {
    font-weight: 600;
    font-size: 14px;
    line-height: 19px;
    color: #333333;
  }
  .contentRole {
    font-size: 14px;
    line-height: 19px;
    color: #333333;
  }
`;

const CustomItemButton = styled.div`
  display: flex;
  justify-content: flex-end;
  .mr-20 {
    margin-right: 20px;
  }
  .btn-cancel {
    min-width: 74px;
    background: white;
    border: 1px solid #ebebf0;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.05);
  }
`;

const CustomButton = styled(Button)`
  margin-left: auto;
`;

const CustomAvatar = styled(Avatar)`
  width: 45px;
  height: 45px;
  font-size: 22px;
`;

const CustomLink = styled(Link)`
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #333333;
`;

const CustomSelect = styled(Select)`
  border-radius: 4px;
  border: solid 1px #ebebf0;
  width: 100%;
  .ant-select-selector {
    border: unset !important;
  }
  .ant-select-item-option .ant-select-item-option-content {
    display: flex;
    justifycontent: space-between;
  }
`;

const CustomDivSource = styled.div`
  display: flex;
  .source-info {
    margin: auto 12px;
  }
  .source-name {
    font-weight: 600;
    font-size: 14px;
    line-height: 19px;
    color: #333333;
  }
  .label-desc {
    font-size: 14px;
    line-height: 19px;
    color: #333333;
  }

  .ant-avatar-image {
    background: #ccc;
  }
`;

const CustomDivRole = styled.div`
  display: flex;
  &::before {
    content: ' ';
    text-align: left;
    margin: auto 0;
    height: 6px;
    margin-right: 7px;
    width: 6px;
    background-color: black;
    border-radius: 50%;
    display: inline-block;
  }
`;

const CustomDivRoleOwner = styled.div`
  display: flex;
  color: #2f80ed;
  &::before {
    content: ' ';
    text-align: left;
    margin: auto 0;
    height: 6px;
    margin-right: 7px;
    width: 6px;
    background-color: #2f80ed;
    border-radius: 50%;
    display: inline-block;
  }
`;
