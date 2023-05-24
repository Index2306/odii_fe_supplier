import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import { globalActions } from 'app/pages/AppPrivate/slice';
import { selectCurrentUser } from 'app/pages/AppPrivate/slice/selectors';
import {
  Row,
  Col,
  Spin,
  Switch,
  Divider,
  Skeleton,
  Modal,
  Select,
  Tooltip,
} from 'antd';
import {
  selectLoading,
  selectDetail,
  selectDataRole,
  selectDataSourceIds,
} from '../../slice/selectors';
import { tooltip } from 'assets/images/dashboards';
import { useEmployeesSlice } from '../../slice';
import { SectionWrapper } from 'styles/commons';
import {
  PageWrapper,
  Button,
  Form,
  Input,
  Checkbox,
  Radio,
  Link,
  Avatar,
} from 'app/components';
import { ShopOutlined } from '@ant-design/icons';
import { formatDate } from 'utils/helpers';
import constants from 'assets/constants';
const Item = Form.Item;
const { Option } = Select;
const { roles } = constants;
const layout = {
  labelCol: { xs: 24, sm: 24 },
  wrapperCol: { xs: 24, sm: 24, md: 24 },
  labelAlign: 'left',
};

const genders = ['male', 'female', 'other'];

export function Detail({ match }) {
  const { t } = useTranslation();
  const id = match?.params?.id;
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { actions } = useEmployeesSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectDetail);

  const dataRoles = useSelector(selectDataRole);
  const dataSourceIds = useSelector(selectDataSourceIds);

  const [dataRolesFormat, setDataRolesFormat] = useState([]);
  const [isDisabledSource, setIsDisabledSource] = useState(false);
  const [role_ids, setRole_Ids] = useState('');
  const [source_ids, setSource_Ids] = useState([]);
  const [visiableModalConfirm, setVisiableModalConfirm] = useState(false);
  const [allSourceId, setAllSourceId] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isRole, setIsRole] = useState({
    owner: false,
    partner_source: false,
  });
  const [isPartnerSource, setIsPartnerSource] = useState(false);

  const host = process.env.REACT_APP_IMAGE_STATIC_HOST + '/';
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    return () => {
      dispatch(globalActions.setDataBreadcrumb({}));
      dispatch(actions.getDetailDone({}));
      dispatch(actions.getDone({}));
    };
  }, []);

  useEffect(() => {
    dispatch(actions.getDataRole({}));
    dispatch(actions.getDataSourceIds({}));
  }, []);

  useEffect(() => {
    const setRoleIds = () => {
      if (!isEmpty(data)) {
        const temp = [];
        data.roles.map(item => {
          temp.push(item?.id.toString());
          setIsPartnerSource(item?.title === 'partner_source' ? true : false);
          onChangeSelectRole(item?.title);
        });
        setRole_Ids(temp);
      }
    };
    setRoleIds();
  }, [data]);

  useEffect(() => {
    const setSourceIds = async () => {
      if (!isEmpty(data)) {
        const ids = [];
        if (!data.sources.includes(null)) {
          data.sources.map(item => {
            ids.push(item?.id);
          });
        }
        setSource_Ids(ids);
      }
    };
    setSourceIds();
  }, [data]);

  useEffect(() => {
    const formatDataRoles = () => {
      if (!isEmpty(dataRoles)) {
        const temp = dataRoles
          .map(item => {
            return {
              ...item,
              titleFormat: item?.title.includes('partner_')
                ? item?.title.replace('partner_', '')
                : item?.title.includes('admin_')
                ? item?.title.replace('admin_', '')
                : item?.title.includes('super_a')
                ? item?.title.replace('super_a', '')
                : item?.title,
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
    const dataBreadcrumb = {
      menus: [
        {
          name: 'Nhân viên',
          link: '/employees',
        },
        {
          name: 'Thông tin nhân viên',
        },
      ],
      title: '',
      fixWidth: true,
      // status: '',
      // actions: (
      //   <Button
      //     className="btn-sm mr-2"
      //     onClick={handleUpdateRoles}
      //     color="blue"
      //   >
      //     <span>Lưu</span>
      //   </Button>
      // ),
    };
    if (!isEmpty(data)) {
      dataBreadcrumb.title = data?.full_name ? data?.full_name : 'N/A';
      // dataBreadcrumb.status = data.status;
    } else {
      if (id) {
        dispatch(actions.getDetail(id));
      }
    }
    dispatch(globalActions.setDataBreadcrumb(dataBreadcrumb));
  }, [data]);

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

  const handleUpdateStatus = async () => {
    await dispatch(
      actions.updateStatusUser({
        id,
        data: {
          user_ids: [id],
          status: data?.status === 'active' ? 'inactive' : 'active',
        },
      }),
    );
  };

  const onChangeRole = values => {
    setRole_Ids(values);
    if (values?.includes('1')) {
      setIsDisabled(true);
      setRole_Ids(['1']);
    }
    const partnerSrcRole = dataRolesFormat.find(
      item => values.includes(item?.id) && item?.title === 'partner_source',
    );

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

  const onChangeSelectRole = value => {
    if (value === 'owner') {
      setIsDisabled(!isDisabled);
      setIsRole(prev => ({ ...prev, partner_source: !isDisabled }));
    } else if (value === 'partner_source') {
      setIsPartnerSource(true);
      setIsDisabled(!isDisabled);
      setIsRole(prev => ({ ...prev, owner: !isDisabled }));
    }
  };

  const handleUpdateRoles = async () => {
    setVisiableModalConfirm(false);
    await dispatch(
      actions.updateUser({
        id,
        data: {
          user_id: id,
          role_ids: role_ids,
          source_ids: source_ids,
        },
      }),
    );
    await dispatch(actions.getDetail(id));
  };

  return (
    <PageWrapper fixWidth>
      <Spin tip="Đang tải..." spinning={isLoading}>
        <CustomForm
          {...layout}
          form={form}
          name="profile"
          fields={[
            {
              name: ['id'],
              value: data?.id || '',
            },
            {
              name: ['created_at'],
              value: formatDate(data?.created_at) || '',
            },
            {
              name: ['full_name'],
              value: data?.full_name || '',
            },
            {
              name: ['first_name'],
              value: data?.first_name || '',
            },
            {
              name: ['last_name'],
              value: data?.last_name || '',
            },
            {
              name: ['gender'],
              value: data?.gender || '',
            },
            {
              name: ['email'],
              value: data?.email || '',
            },
            {
              name: ['phone'],
              value: data?.phone || '',
            },
            {
              name: ['country'],
              value: data?.country || '',
            },
            {
              name: ['province'],
              value: data?.province || '',
            },
            {
              name: ['address'],
              value: data?.address || '',
            },
            {
              name: ['role_ids'],
              value: role_ids,
            },
            {
              name: ['source_ids'],
              value: source_ids,
            },
          ]}
        >
          <Row gutter={24}>
            <Col span={7}>
              <CustomSectionWrapper>
                {isLoading ? (
                  <Skeleton active paragraph={{ rows: 9 }} />
                ) : (
                  <>
                    <Row gutter={8}>
                      <Col lg={24}>
                        <Item name="avatar">
                          <div className="text-center">
                            <img
                              src={
                                data?.avatar?.location
                                  ? host + data?.avatar?.location
                                  : data?.avatar?.origin
                              }
                              disabled
                              alt=""
                            />
                            <div className="txt-name">{data?.full_name}</div>
                          </div>
                        </Item>
                      </Col>
                    </Row>
                    <Row gutter={8}>
                      <CustomCol lg={24}>
                        <div className="d-flex justify-content-between">
                          <div className="title-info">Mã nhân viên</div>
                          <div>{data?.id}</div>
                        </div>
                        <div className="d-flex justify-content-between mt-16">
                          <div className="title-info">Điện thoại</div>
                          <div className="txt-phone">
                            {data?.phone ? '+84 ' + data?.phone : 'N/A'}
                          </div>
                        </div>
                        {!isEmpty(data) && (
                          <Item
                            name="is_partner_user_active"
                            className=" mt-24 mb-0"
                          >
                            <div className="status d-flex justify-content-between">
                              <div className="item-label">
                                {t('user.status')}:
                              </div>
                              <CustomSwitch
                                checkedChildren="Hoạt động"
                                unCheckedChildren="Dừng hoạt động"
                                defaultChecked={data?.status === 'active'}
                                onChange={handleUpdateStatus}
                                disabled={
                                  data?.is_owner ||
                                  !currentUser?.roles?.includes(roles.owner)
                                }
                              />
                            </div>
                          </Item>
                        )}
                      </CustomCol>
                    </Row>
                  </>
                )}
              </CustomSectionWrapper>
            </Col>
            <Col span={17}>
              <CustomSectionWrapper>
                {isLoading ? (
                  <Skeleton active paragraph={{ rows: 20 }} />
                ) : (
                  <>
                    <Item>
                      <span className="bold">Tài khoản</span> <br />
                      Đây là thông tin tài khoản của nhân viên này
                    </Item>
                    <Item name="id" label={t('user.id')}>
                      <Input disabled />
                    </Item>
                    <Item name="email" label="E-mail">
                      <Input disabled />
                    </Item>
                    {/* <Item>
                      <Link className="link-reset__pass">
                        Reset và gửi lại mật khẩu
                      </Link>
                    </Item> */}
                    <Item name="created_at" label={t('user.created_at')}>
                      <Input disabled />
                    </Item>
                    <Item name="gender" label={t('user.gender')}>
                      <Radio.Group disabled>
                        <Row gutter={10}>
                          {genders.map(gender => (
                            <Col key={gender}>
                              <Radio value={gender}>
                                {t(`user.${gender}`)}
                              </Radio>
                            </Col>
                          ))}
                        </Row>
                      </Radio.Group>
                    </Item>
                    {isPartnerSource && (
                      <Item
                        name="source_ids"
                        label="Nguồn hàng"
                        className="source"
                        // rules={[
                        //   {
                        //     required: isRole?.owner,
                        //     message: 'Vui lòng chọn nguồn hàng!',
                        //   },
                        // ]}
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
                            option.label
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          <Option value="all" label="Tất cả nguồn hàng">
                            <CustomDivSource>
                              <CustomAvatar src={<ShopOutlined />} />
                              <div className="source-info">
                                <div className="source-name">
                                  Tất cả nguồn hàng
                                </div>
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
                                    : source?.user_id &&
                                      source?.email !== data?.email
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
                                    <div className="source-name">
                                      {source?.name}
                                    </div>
                                    <div className="source-address">
                                      {source?.address}
                                    </div>
                                  </div>
                                  {source?.user_id && (
                                    <Tooltip
                                      placement="top"
                                      title={`${source?.name} đang cấp quyền cho tài khoản: ${source?.email}`}
                                    >
                                      <img
                                        className="tooltip"
                                        src={tooltip}
                                        alt=""
                                      />
                                    </Tooltip>
                                  )}
                                </CustomDivSource>
                              </Option>
                            );
                          })}
                        </CustomSelect>
                      </Item>
                    )}
                    <Item name="role_ids" label={t('user.userRoles')}>
                      <Checkbox.Group
                        style={{ width: '100%' }}
                        onChange={onChangeRole}
                      >
                        <Row gutter={8}>
                          {dataRolesFormat
                            ? dataRolesFormat?.map(
                                (role, index) =>
                                  (role.title.includes('partner_') ||
                                    role.title.includes('owner')) && (
                                    <div className="item-role">
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
                                            ? () =>
                                                onChangeSelectRole(role?.title)
                                            : ''
                                        }
                                      >
                                        <div
                                          className="title-role"
                                          style={{
                                            color: role.title.includes('owner')
                                              ? 'red'
                                              : '',
                                          }}
                                        >
                                          {role?.title.includes('owner')
                                            ? 'Admin'
                                            : role?.title.includes(
                                                'partner_source',
                                              )
                                            ? 'Product Source'
                                            : role?.titleFormat}
                                        </div>
                                      </Checkbox>
                                    </div>
                                  ),
                              )
                            : ''}
                        </Row>
                      </Checkbox.Group>
                    </Item>
                    <Divider className="mt-48" />
                    <Item>
                      <div className="d-flex justify-content-between">
                        <div>
                          <span
                            className="bold"
                            style={{
                              color: 'red',
                            }}
                          >
                            Admin -{' '}
                          </span>
                          Quyền quản trị tương đương chủ tài khoản
                        </div>
                        <Button
                          // type="primary"
                          className="btn-sm"
                          color="blue"
                          // htmlType="submit"
                          onClick={() => setVisiableModalConfirm(true)}
                          disabled={data?.is_owner}
                        >
                          Lưu
                        </Button>
                      </div>
                    </Item>
                  </>
                )}
              </CustomSectionWrapper>
            </Col>
          </Row>
        </CustomForm>
        <CustomModalConfirm
          name="modal__confirm"
          className="modal__confirm"
          visible={visiableModalConfirm}
          footer={null}
          onCancel={() => setVisiableModalConfirm(!visiableModalConfirm)}
        >
          <div className="modal__title">Xác nhận thay đổi quyền nhân viên</div>
          <div className="modal__content">
            Sự thay đổi quyền quản trị của nhân viên sẽ ảnh hưởng đến tài nguyên
            và công việc trong hệ thống.
            <br />
            Bạn chắc chắn về sự thay đổi này ?
          </div>
          <div className="modal__btn">
            <Button
              context="secondary"
              className="btn-sm"
              color="default"
              style={{
                color: 'white',
                background: '#6C798F',
              }}
              width="200px"
              onClick={() => setVisiableModalConfirm(!visiableModalConfirm)}
            >
              Hủy
            </Button>
            <Button
              className="btn-sm"
              color="blue"
              width="200px"
              onClick={handleUpdateRoles}
            >
              Xác nhận
            </Button>
          </div>
        </CustomModalConfirm>
      </Spin>
    </PageWrapper>
  );
}
const CustomSectionWrapper = styled(SectionWrapper)`
  padding-bottom: 0;
  border-radius: 4px;
  border: 1px solid #ebebf0;
  box-shadow: 0px 4px 10px rgba(30, 70, 117, 0.05);
  .title-info {
    color: #828282;
  }
  .txt-name {
    margin-top: 14px;
    font-weight: bold;
    font-size: 16px;
    line-height: 19px;
  }
  .txt-phone {
    color: #2f80ed;
  }
  .status {
    padding: 12px;
    border: 1px solid #ebebf0;
    border-radius: 4px;
  }
  .source {
    .ant-select-selector {
      height: 40px;
    }
  }
`;

const CustomCol = styled(Col)`
  border-top: 1px solid #ebebf0;
  padding: 20px 20px;
`;

const CustomForm = styled(Form)`
  .mb-0 {
    margin: 0;
  }
  .mt-16 {
    margin-top: 16px;
  }
  .mt-24 {
    margin-top: 24px;
  }
  .mt-48 {
    margin-top: 48px;
  }
  .bold {
    font-weight: bold;
  }
  .link-reset__pass {
    /* text-decoration-line: underline; */
    color: #2f80ed;
  }
  img {
    width: 108px;
    height: 108px;
    border-radius: 50%;
  }
  .item-label {
    margin: auto 16px auto 0;
    font-weight: bold;
  }
  label {
    font-weight: bold;
  }
  .ant-input[disabled] {
    color: #333333;
  }
  .CustomCol {
    padding-left: 60px !important;
    &:first-child {
      border-right: 2px solid #b1aeae;
    }
    &:last-child {
      padding-left: 100px !important;
    }
  }
  .title {
    font-weight: 600;
    font-size: 16px;
    color: blue;
    margin-bottom: 18px;
  }
  .item-role {
    &:not(:first-child) {
      margin-left: 25px;
    }
    .title-role {
      font-weight: 600;
      font-size: 14px;
      line-height: 19px;
      color: #333333;
    }
    .content-role {
      font-size: 14px;
      line-height: 19px;
      color: #333333;
      font-weight: normal;
    }
  }
  .ant-checkbox-wrapper {
    margin-left: unset;
  }
`;

const CustomSwitch = styled(Switch)`
  &.ant-switch-checked {
    background: #4869de;
  }
`;

const CustomModalConfirm = styled(Modal)`
  .ant-modal-content {
    margin-top: 45%;
  }
  .modal {
    &__title {
      font-size: 18px;
      font-weight: 500;
      text-align: center;
    }
    &__content {
      margin-top: 12px;
      color: gray;
      font-size: 14px;
      text-align: center;
    }
    &__btn {
      margin-top: 32px;
      display: flex;
      justify-content: space-between;
    }
  }
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
const CustomAvatar = styled(Avatar)`
  width: 45px;
  height: 45px;
  font-size: 22px;
`;
