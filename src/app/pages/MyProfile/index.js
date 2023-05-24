/**
 *
 * MyProfile
 *
 */
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
  Row,
  Col,
  Spin,
  DatePicker,
  Modal,
  Space,
  Form as F,
  Alert,
  // Skeleton,
} from 'antd';
import { LockOutlined, LoadingOutlined } from '@ant-design/icons';
import { PageWrapper, Button, Form, Input, Radio } from 'app/components';
import { SectionWrapper } from 'styles/commons';
import { useMyProfileSlice } from './slice';
import constants from 'assets/constants';
// import { authActions } from 'app/pages/Auth/slice';
import notification from 'utils/notification';
import request from 'utils/request';
import { selectLoading, selectData } from './slice/selectors';
import { messages } from './messages';
import * as moment from 'moment';
import { Avatar } from 'app/components/Uploads';
import styled from 'styled-components';

const genders = ['male', 'female', 'other'];

const Item = F.Item;

export function MyProfile({ history }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { actions } = useMyProfileSlice();
  const isLoading = useSelector(selectLoading);
  const data = useSelector(selectData);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const avatarRef = useRef();
  const handleClickTrigger = () => {
    avatarRef.current.querySelector('span[class="ant-upload"]').click();
  };

  const [isLoadingInterval, setIsLoadingInterval] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [dataAvatar, setDataAvatar] = useState(data?.avatar);
  const [dataBirthday, setDataBirthday] = useState('');
  // const [dataBirthdayShow, setDataBirthdayShow] = useState('');

  const [visible, setVisible] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    dispatch(actions.getData({}));
  }, []);

  const { setFieldsValue, getFieldsValue, resetFields } = form;

  useEffect(() => {
    // const { province } = getFieldsValue();
    setFieldsValue({
      full_name: data?.full_name || '',
      email: data?.email,
      phone: data?.phone || '',
      gender: data?.gender || '',
      birthday: data?.birthday ? moment(data?.birthday) : moment('2000-01-01'),
    });
    setDataAvatar(data?.avatar);
  }, [data]);

  const handleChange = responThumb => {
    setDataAvatar(responThumb);
  };

  const onChangeBirthday = (date, dateString) => {
    setDataBirthday(date);
    // setDataBirthdayShow(moment(date));
  };

  const onClose = () => {
    setVisible(false);
    form2.resetFields();
  };

  const goChangePass = () => {
    setVisible(true);
  };

  const goUpdate = () => {
    setIsUpdate(true);
  };
  const onFinish = values => {
    dispatch(
      actions.updateMyProfile({
        data: {
          avatar: dataAvatar,
          full_name: values.full_name,
          phone: values.phone,
          gender: values.gender,
          birthday: dataBirthday
            ? moment(dataBirthday).format('YYYY-MM-DD')
            : data?.birthday
            ? moment(data?.birthday).format('YYYY-MM-DD')
            : '2000-01-01',
        },
      }),
    );
    setIsUpdate(false);
  };

  const onFinishChangePass = async values => {
    setIsLoadingInterval(true);
    const response = await request(`user-service/users/me/change-password`, {
      method: 'post',
      data: {
        old_password: values.old_password.trim(),
        password: values.password.trim(),
      },
    })
      .then(response => response)
      .catch(err => err);
    if (response.is_success) {
      form2.resetFields();
      notification('success', `Thay đổi mật khẩu thành công!`, 'Thành công!');
      setVisible(false);
      setMessageError('');
    } else {
      const code = response?.data?.error_code || response?.data?.error;
      const message = constants.ERRORS__AUTH[code] || code;
      setMessageError(message);
    }
    setIsLoadingInterval(false);
  };

  const handleCancel = () => {
    setFieldsValue({
      full_name: data?.full_name || '',
      email: data?.email,
      phone: data?.phone || '',
      gender: data?.gender || '',
      birthday: data?.birthday ? moment(data?.birthday) : moment('2000-01-01'),
    });
    setIsUpdate(false);
    setDataAvatar(data?.avatar);
  };

  return (
    <>
      <CustomPageWrapper fixWidth>
        <div className="TitleProfile">{t(messages.title())}</div>
        <Spin tip="Đang tải..." spinning={isLoading}>
          <Form
            form={form}
            name="profile"
            className="profile-form"
            onFinish={onFinish}
          >
            <CustomSectionWrapper>
              <div className="left">
                {/* {isLoading ? (
                  <Skeleton active paragraph={{ rows: 10 }} />
                ) : (
                  <> */}
                <Row gutter={8} className="mb-18">
                  <Col xs={24}>
                    <CustomItem
                      name="full_name"
                      label="Họ tên"
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập Họ tên',
                        },
                        {
                          max: 100,
                          message: 'Họ và tên không vượt quá 100 ký tự.',
                        },
                      ]}
                    >
                      <CustomInput placeholder="Họ tên" disabled={!isUpdate} />
                    </CustomItem>
                  </Col>
                </Row>
                <Row gutter={8} className="mb-12">
                  <Space>
                    <Col xs={24}>
                      <CustomItem name="email" label="Email đăng ký">
                        <CustomInput placeholder="Email" disabled />
                      </CustomItem>
                    </Col>

                    <Col xs={24}>
                      <CustomItem
                        name="phone"
                        label="Số điện thoại"
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng nhập Số điện thoại',
                          },
                          {
                            min: 10,
                            max: 11,
                            message: 'Số điện thoại không hợp lệ',
                          },
                        ]}
                      >
                        <CustomInput
                          placeholder="Số điện thoại"
                          disabled={!isUpdate}
                        />
                      </CustomItem>
                    </Col>
                  </Space>
                </Row>
                <div className="linkChangePass" onClick={goChangePass}>
                  {t(messages.changepass())}
                </div>
                <CustomItem
                  name="gender"
                  label={t('user.gender')}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn giới tính',
                    },
                  ]}
                >
                  <Radio.Group disabled={!isUpdate}>
                    <Row gutter={8}>
                      {genders.map(gender => (
                        <Col key={gender}>
                          <Radio value={gender}>{t(`user.${gender}`)}</Radio>
                        </Col>
                      ))}
                    </Row>
                  </Radio.Group>
                </CustomItem>
                <CustomItem name="birthday" label={t('user.birthday')}>
                  <DatePicker
                    // renderExtraFooter={() => 'extra footer'}
                    showTime={false}
                    showNow={true}
                    onChange={onChangeBirthday}
                    format="DD/MM/YYYY"
                    placeholder="Ngày/Tháng/Năm"
                    disabled={!isUpdate}
                  />
                </CustomItem>
                {/* </>
                )} */}
              </div>

              <div className="right">
                <div className="content">
                  <div className="avatar" ref={avatarRef}>
                    <Avatar
                      data={dataAvatar}
                      onChange={handleChange}
                      disabled={!isUpdate}
                    />
                  </div>
                  <div>
                    <p className="title">Ảnh đại diện</p>
                    <div className="note">Dung lượng file tối đa 10 MB</div>
                    <div className="note mb-10">Định dạng: .JPG, .PNG</div>
                  </div>
                  {isUpdate && (
                    <Button
                      context="secondary"
                      color="default"
                      className="btn-sm"
                      onClick={handleClickTrigger}
                    >
                      Chọn ảnh
                    </Button>
                  )}
                </div>
              </div>
            </CustomSectionWrapper>
            <Item shouldUpdate>
              {isUpdate ? (
                <CustomRow className="justify-content-end">
                  <Col>
                    <Button
                      context="secondary"
                      color="default"
                      className="btn-sm"
                      style={{
                        marginRight: '12px',
                        color: 'white',
                        background: '#6C798F',
                        minWidth: '60px',
                      }}
                      onClick={handleCancel}
                    >
                      Hủy
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                      color="blue"
                      style={{
                        minWidth: '100px',
                        height: '32px',
                      }}
                      htmlType="submit"
                    >
                      {isLoading && (
                        <>
                          <LoadingOutlined />
                          &ensp;
                        </>
                      )}
                      Lưu
                    </Button>
                  </Col>
                </CustomRow>
              ) : (
                <CustomRow className="justify-content-end">
                  <Col>
                    <Button
                      color="blue"
                      style={{
                        minWidth: '100px',
                        height: '32px',
                      }}
                      onClick={goUpdate}
                    >
                      Chỉnh sửa
                    </Button>
                  </Col>
                </CustomRow>
              )}
            </Item>
          </Form>
        </Spin>
      </CustomPageWrapper>
      <CustomModal
        title={t(messages.changepass())}
        name="modal_changepass"
        visible={visible}
        footer={null}
        className="login-form"
        onCancel={onClose}
      >
        <Form
          form={form2}
          name="form-change-pass"
          onFinish={onFinishChangePass}
        >
          <Item
            name="old_password"
            rules={[
              {
                required: true,
                message: 'Nhập lại mật khẩu cũ của bạn',
              },
            ]}
          >
            <Input.Password
              className="odii-input"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder={t(messages.old_password())}
            />
          </Item>
          <Item
            name="password"
            dependencies={['old_password']}
            rules={[
              {
                required: true,
                message: 'Nhập lại mật khẩu mới của bạn',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('old_password') !== value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('Mật khẩu mới không được trùng mật khẩu cũ !!!'),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              className="odii-input"
              prefix={<LockOutlined type="lock" />}
              type="password"
              placeholder={t(messages.new_password())}
            />
          </Item>

          <Item
            name="confirmpassword"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: 'Nhập lại mật khẩu mới của bạn',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      'Mật khẩu xác nhận không trùng với mật khẩu mới !!!',
                    ),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              className="odii-input"
              prefix={<LockOutlined type="lock" />}
              type="password"
              placeholder={t(messages.confirm_password())}
            />
          </Item>

          <Item>
            <Button
              type="primary"
              className="btn-md btn-changepass"
              color="blue"
              htmlType="submit"
              width={'100%'}
            >
              {isLoadingInterval && (
                <>
                  <LoadingOutlined />
                  &ensp;
                </>
              )}
              {t(messages.changepass())}
            </Button>
          </Item>
          {messageError && (
            <div className="alert">
              <Alert message={messageError} type="error" />
            </div>
          )}
        </Form>
      </CustomModal>
    </>
  );
}
const CustomPageWrapper = styled(PageWrapper)`
  .mb-10 {
    margin-bottom: 10px;
  }
  .ant-input[disabled] {
    color: #333333;
  }
  .ant-picker-input > input[disabled] {
    color: #333333;
  }
  .ant-radio-disabled + span {
    color: #333333;
  }
  .ant-tabs-nav {
    background: white;
    padding: 0 20px 24px;
  }
  .TitleProfile {
    font-weight: 900;
    font-size: 22px;
    line-height: 26px;
    color: #3d56a6;
    margin: 24px 0 16px;
  }
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: #3d56a6;
  }
`;
const CustomSectionWrapper = styled(SectionWrapper)`
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: unset;
  display: flex;
  justify-content: space-between;
  .hide {
    visibility: hidden;
  }
  .left {
    padding: 32px 40px;
    .linkChangePass {
      margin-bottom: 12px;
      font-size: 14px;
      line-height: 16px;
      text-decoration: underline;
      color: #2f80ed;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .right {
    min-width: 280px;
    border-left: 1px solid #e6e6e9;
    .content {
      margin-top: 100px;
      text-align: center;
      /* height: 100%; */
      .avatar {
        height: 80px;
        width: 80px;
        margin: 0 auto 14px auto;
        .ant-upload {
          background: white;
        }
        img {
          height: 80px;
          border-radius: 50%;
        }
      }
      .title {
        font-weight: bold;
        font-size: 16px;
        line-height: 19px;
        color: #333333;
        margin-bottom: 4px;
      }
      .note {
        font-size: 12px;
        line-height: 16px;
        text-align: center;
        letter-spacing: 0.05em;
        color: #828282;
      }
      button {
        margin: auto;
        border: 1px solid #3d56a6;
        color: #3d56a6;
        &:hover {
          color: white;
        }
      }
    }
  }
`;
const CustomInput = styled(Input)`
  min-width: 265px;
  &::placeholder {
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    color: #6c798f;
  }
`;
const CustomItem = styled(Item)`
  display: block;
  .ant-picker {
    min-width: 265px;
  }
  .ant-form-item-label {
    font-weight: bold;
  }
`;

const CustomRow = styled(Row)`
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

const CustomModal = styled(Modal)`
  .ant-modal-header,
  .ant-modal-content {
    border-radius: 6px;
  }
  .btn-changepass {
    margin-top: 20px;
  }
  .alert {
    /* color: red; */
    font-size: 12px;
  }
`;
