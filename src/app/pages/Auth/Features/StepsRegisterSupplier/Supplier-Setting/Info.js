import React from 'react';
import { Input, Form } from 'app/components';
import { Row, Col } from 'antd';
import { styledSystem } from 'styles/theme/utils';
import styled from 'styled-components/macro';
import { SectionWrapper } from 'styles/commons';
import { identityAfter, identityBefore } from 'assets/images/identity';
import {
  Avatar,
  //  PicturesWall
} from 'app/components/Uploads';
import { isEmpty } from 'lodash';
import { validatePhoneNumberVN } from 'utils/helpers';

const Item = Form.Item;

function Info({
  layout,
  form,
  isMiss,
  dataImageIdentityBefore,
  setDataImageIdentityBefore,
  dataImageIdentityAfter,
  setDataImageIdentityAfter,

  dataSupplierSettingBack,
}) {
  const handleChangeImageBefore = responThumb => {
    setDataImageIdentityBefore(responThumb);
  };
  const handleChangeImageAfter = responThumb => {
    setDataImageIdentityAfter(responThumb);
    // console.log('responThumb:', responThumb);
  };

  React.useEffect(() => {
    if (!isEmpty(dataSupplierSettingBack)) {
      setDataImageIdentityBefore(
        dataSupplierSettingBack?.metadata?.user_info
          ?.images_representative_before,
      );
      setDataImageIdentityAfter(
        dataSupplierSettingBack?.metadata?.user_info
          ?.images_representative_after,
      );
    }
  }, [dataSupplierSettingBack]);

  return (
    <div>
      <CustomSectionWrapper mt={{ xs: 's4' }}>
        <Row>
          <Col xs={24}>
            <Row gutter={24}>
              <Col span={12}>
                <CustomItem
                  name="representative_name"
                  label="Họ và Tên người đại diện"
                  {...layout}
                  className="odii-form-item"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng điền đầy đủ họ và tên ',
                    },
                  ]}
                >
                  <Input placeholder="Vui lòng nhập họ và tên người đại diện" />
                </CustomItem>
                <CustomItem
                  name="contact_email"
                  label="Email liên hệ"
                  {...layout}
                  className="odii-form-item"
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
                  <Input placeholder="Nhập email liên hệ" type="email" />
                </CustomItem>
              </Col>
              <Col span={12}>
                <CustomItem
                  name="phone_number"
                  label="Số điện thoại"
                  {...layout}
                  className="odii-form-item"
                  rules={[
                    {
                      required: true,
                      message: 'Nhập số điện thoại',
                    },
                    validatePhoneNumberVN,
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" type="number" />
                </CustomItem>
                <CustomItem
                  name="identity_card"
                  label="Số CMND / Thẻ căn cước"
                  {...layout}
                  className="odii-form-item"
                  rules={[
                    {
                      required: true,
                      message: '9 số CMND hoặc 12 số thẻ căn cước',
                    },
                    {
                      min: 9,
                      max: 12,
                      message: 'Số CMND hoặc CCCD không hợp lệ',
                    },
                  ]}
                >
                  <Input
                    placeholder="9 số CMND hoặc 12 số thẻ căn cước"
                    type="number"
                  />
                </CustomItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <CustomItem
                  name="identity_image"
                  label="Upload ảnh CMND / Thẻ căn cước"
                  {...layout}
                  className="odii-form-item required"
                >
                  <CustomDivImageIdentity gutter={24}>
                    <Col span={12}>
                      <div className="images">
                        <div className="item">
                          <div className="img">
                            <Avatar
                              data={
                                dataSupplierSettingBack?.metadata?.user_info
                                  ?.images_representative_before || {}
                              }
                              onChange={handleChangeImageBefore}
                            />
                            {/* <PicturesWall
                              maxImages={1}
                              // onRemove={false}
                              data={
                                [
                                  dataSupplierSettingBack?.metadata?.user_info
                                    ?.images_representative_before,
                                ] || []
                              }
                              onChange={handleChangeImageBefore}
                            /> */}
                          </div>

                          <div className="title">Mặt trước</div>
                        </div>

                        <div className="item">
                          <div className="img">
                            <Avatar
                              data={
                                dataSupplierSettingBack?.metadata?.user_info
                                  ?.images_representative_after || {}
                              }
                              onChange={handleChangeImageAfter}
                            />
                            {/* <PicturesWall
                              maxImages={1}
                              // onRemove={false}
                              data={
                                [
                                  dataSupplierSettingBack?.metadata?.user_info
                                    ?.images_representative_after,
                                ] || []
                              }
                              onChange={handleChangeImageAfter}
                            /> */}
                          </div>
                          <div className="title">Mặt sau</div>
                        </div>
                      </div>
                    </Col>
                    <Col span={12} className="note">
                      <div className="image">
                        <img
                          className="image_before"
                          src={identityBefore}
                          alt=""
                        />
                        <img
                          className="image_after"
                          src={identityAfter}
                          alt=""
                        />
                      </div>
                      <div className="content">
                        Lưu ý: Ảnh chụp cần rõ nét, căn giữa CMND hoặc Căn Cước
                        để xem được đầy đủ thông tin
                      </div>
                    </Col>
                  </CustomDivImageIdentity>
                </CustomItem>
              </Col>
              {isMiss && (
                <div className="txt-required">
                  Vui lòng tải lên đủ ảnh Mặt trước và Mặt sau của CMND / CCCD
                </div>
              )}
            </Row>
          </Col>
        </Row>
      </CustomSectionWrapper>
    </div>
  );
}

const CustomDivImageIdentity = styled(Row)`
  .images {
    display: flex;
    height: 100%;
    .item {
      width: 50%;
      background: #ffffff;
      border: 1px solid #ebebf0;
      box-sizing: border-box;
      border-radius: 4px;
      &:first-child {
        margin-right: 24px;
      }
      .img {
        margin: 36px auto;
        width: 104px;
        height: 70px;
        .ant-image-img {
          display: block;
          width: 100%;
          height: 74px;
        }
      }
      .title {
        margin-top: 14px;
        text-align: center;
        color: #828282;
      }
      /* .ant-upload-select {
        height: 74px;
      }
      .anticon-plus {
        margin-bottom: 40px;
      } */
    }
  }
  .note {
    .image {
      text-align: center;
      .image_after {
        position: relative;
      }
      .image_before {
        position: absolute;
        top: 32px;
        left: 212px;
        z-index: 2;
      }
    }
    .content {
      margin-top: 51px;
      font-size: 12px;
      line-height: 19px;
      text-align: center;
    }
  }
`;

export default Info;

export const CustomSectionWrapper = styledSystem(styled(SectionWrapper)`
  padding: 16px;
  padding-bottom: 0;
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
    border-radius: 2px;
  }
  label {
    font-weight: 500;
  }
  .img-flag {
    margin-top: -2px;
  }
  .required {
    .ant-form-item-label {
      &::after {
        display: inline-block;
        color: #ff4d4f;
        font-size: 18px;
        font-family: SimSun, sans-serif;
        line-height: 1;
        content: '*';
      }
    }
  }
  .txt-required {
    margin: -14px 10px 10px;
    color: #ff4d4f;
  }
`);

const CustomItem = styled(Item)`
  display: block;
  .ant-form-item {
    &-label {
      margin-bottom: 6px;
      label {
        &::after {
          content: '';
        }
      }
      font-weight: 500;
      margin-bottom: $spacer/2;
    }
  }
  label.ant-form-item-required {
    height: unset;
    &::before {
      content: '' !important;
    }
    &::after {
      display: inline-block;
      margin-left: 4px;
      color: #ff4d4f;
      font-size: 18px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: '*';
    }
  }
`;
