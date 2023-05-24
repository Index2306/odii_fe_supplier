import React, { useEffect, useRef } from 'react';
import { Input, Form, Button } from 'app/components';
import { Row, Col } from 'antd';
import { styledSystem } from 'styles/theme/utils';
import styled from 'styled-components/macro';
// import { SectionWrapper } from 'styles/commons';
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
  isMiss,
  dataImageIdentityBefore,
  setDataImageIdentityBefore,
  dataImageIdentityAfter,
  setDataImageIdentityAfter,

  data,
}) {
  const handleChangeImageBefore = responThumb => {
    setDataImageIdentityBefore(responThumb);
  };
  const handleChangeImageAfter = responThumb => {
    setDataImageIdentityAfter(responThumb);
  };

  useEffect(() => {
    if (!isEmpty(data)) {
      setDataImageIdentityBefore(
        data?.metadata?.user_info?.images_representative_before,
      );
      setDataImageIdentityAfter(
        data?.metadata?.user_info?.images_representative_after,
      );
    }
  }, [data]);

  const identityImageBeforeRef = useRef();
  const identityImageAfterRef = useRef();
  const handleClickTrigger = type => {
    if (type === 'before') {
      identityImageBeforeRef.current
        .querySelector('span[class="ant-upload"]')
        .click();
    } else if (type === 'after') {
      identityImageAfterRef.current
        .querySelector('span[class="ant-upload"]')
        .click();
    }
  };

  return (
    <CustomSectionWrapper>
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
                    message: 'Vui lòng điền đầy đủ họ và tên',
                  },
                  {
                    max: 100,
                    message: 'Không vượt quá 100 ký tự',
                  },
                  { whitespace: true, message: 'Không được để trống' },
                ]}
              >
                <Input
                  showCount
                  // maxLength={100}
                  // minLength={10}
                  placeholder="Vui lòng nhập họ và tên người đại diện"
                />
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
                className="required"
              >
                <CustomDivImageIdentity gutter={24}>
                  <Col span={12}>
                    <div className="images">
                      <div className="item">
                        <div className="img" ref={identityImageBeforeRef}>
                          <Avatar
                            data={
                              data?.metadata?.user_info
                                ?.images_representative_before || {}
                            }
                            onChange={handleChangeImageBefore}
                          />
                        </div>

                        <div className="title-identity_image">Mặt trước</div>
                        <Button
                          context="primary"
                          // color="default"
                          onClick={() => handleClickTrigger('before')}
                          className="btn-sm btn-select-image"
                        >
                          Thay đổi
                        </Button>
                      </div>

                      <div className="item">
                        <div className="img" ref={identityImageAfterRef}>
                          <Avatar
                            data={
                              data?.metadata?.user_info
                                ?.images_representative_after || {}
                            }
                            onChange={handleChangeImageAfter}
                          />
                        </div>

                        <div className="title-identity_image">Mặt sau</div>
                        <Button
                          context="primary"
                          // color="default"
                          onClick={() => handleClickTrigger('after')}
                          className="btn-sm btn-select-image"
                        >
                          Thay đổi
                        </Button>
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
                      <img className="image_after" src={identityAfter} alt="" />
                    </div>
                    <div className="content">
                      Lưu ý: Ảnh chụp cần rõ nét, căn giữa CMND hoặc Căn Cước để
                      xem được đầy đủ thông tin
                    </div>
                  </Col>
                </CustomDivImageIdentity>
              </CustomItem>
            </Col>
            {isMiss && (
              <TxtRequired>
                Vui lòng tải lên ảnh chụp Mặt trước và Mặt sau của CMND / CCCD
              </TxtRequired>
            )}
          </Row>
        </Col>
      </Row>
    </CustomSectionWrapper>
  );
}

export default Info;

const CustomSectionWrapper = styledSystem(styled.div`
  label {
    font-weight: 500;
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
`);

const TxtRequired = styled.div`
  margin: -14px 10px 10px;
  color: #ff4d4f;
`;

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
        margin: 36px auto 0;
        width: 104px;
        /* height: 70px; */
        .ant-image-img {
          display: block;
          width: 100%;
          height: 74px;
        }
      }
      .hide {
        visibility: hidden;
      }
      .btn-select-image {
        margin: 8px auto 12px;
        height: 24px;
        font-size: 12px;
        padding: 0 8px;
      }
      .title-identity_image {
        /* margin-bottom: 12px; */
        text-align: center;
        color: #828282;
      }
      /* .ant-upload-select {
        height: 74px;
      }
      .anticon-plus {
        margin-bottom: 40px;
      }
      .ant-upload-select ruby-span.ant-upload {
        padding-bottom: 60%;
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
