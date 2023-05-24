import React, { useState, useEffect, memo } from 'react';
import { RightOutlined, DownOutlined } from '@ant-design/icons';
import request from 'utils/request';
// import { useHistory, useLocation } from 'react-router-dom';
import { Form, Input } from 'app/components';
import iconExclamationMark from 'assets/images/exclamationMark.svg';
import { PicturesWall } from 'app/components/Uploads';
import styled from 'styled-components';
import { iconIsHadImg, MoreIcon } from 'assets/images';
import { isEmpty } from 'lodash';

const Item = Form.Item;

export default memo(function InfoCategory({
  layout,
  data,
  isMissCategory,
  idsSelected,
  setIdsSelected,
  licenseImages,
  setLicenseImages,
}) {
  const [categories, setCategories] = useState([]);
  const [isHadImg, setIsHadImg] = useState(false);
  const [isShowUpload, setisShowUpload] = useState(true);
  const [isShowMoreCategory, setIsShowMoreCategory] = useState(false);

  useEffect(() => {
    if (!isEmpty(data)) {
      setIdsSelected(data.category_ids);
    }
  }, [data]);

  useEffect(() => {
    const fetchCategories = async () => {
      const url =
        'product-service/categories-listing?page=1&page_size=100&is_top=true';
      const response = await request(url, {
        method: 'get',
        requireAuth: false,
      })
        .then(response => response)
        .catch(error => error);

      if (!isEmpty(response.data)) {
        const categoriesClone = response?.data?.map(item => {
          if (idsSelected?.find(item2 => item2 === item.id)) {
            return {
              ...item,
              isSelected: true,
            };
          } else
            return {
              ...item,
              isSelected: false,
            };
        });
        setCategories(categoriesClone);
      }
    };
    fetchCategories();
  }, [idsSelected]);

  const handleChangeCategoriesSelected = category => {
    let newIdsSelected = idsSelected || [];
    if (idsSelected.find(id => id === category.id)) {
      newIdsSelected = idsSelected.filter(id => id !== category.id);
      setIdsSelected(newIdsSelected);
    } else {
      setIdsSelected(newIdsSelected.concat([category.id]));
    }
  };

  const handleChangeLicenseImages = thumb => {
    setLicenseImages(thumb);
    setIsHadImg(true);
  };

  const no = () => {};

  return (
    <CustomSectionWrapper>
      <CustomItem
        name="name"
        label="Tên cửa hàng"
        rules={[
          {
            required: true,
            message: 'Vui lòng điền Tên cửa hàng của bạn ',
          },
        ]}
      >
        <Input placeholder="Tên gian hàng kinh doanh online của bạn" />
      </CustomItem>
      <CustomItem name="category" label="Ngành hàng" className="required">
        <CustomDivCategories
          className={
            isShowMoreCategory
              ? 'category-setting__list'
              : 'category-setting__list not-show-full'
          }
        >
          {categories &&
            categories.map(category => (
              <div
                className={`category-setting__item ${
                  category.isSelected ? 'selected' : ''
                }`}
                key={category.id}
                onClick={() =>
                  data?.register_status === 'active'
                    ? no()
                    : handleChangeCategoriesSelected(category)
                }
              >
                <div className="category-setting__item_thumb">
                  <img src={category.thumb?.origin} alt="" />
                </div>

                <div className="category-setting__item_name">
                  {category.name}
                </div>
              </div>
            ))}
          {categories.length > 7 && (
            <div
              className="show-more"
              onClick={() => setIsShowMoreCategory(!isShowMoreCategory)}
            >
              <div className="category-thumb-more">
                <img src={MoreIcon} alt="" />
              </div>
              {isShowMoreCategory ? 'Thu gọn' : 'Danh mục khác'}
            </div>
          )}
        </CustomDivCategories>
        {isMissCategory && <TxtRequired>Vui lòng chọn ngành hàng</TxtRequired>}
      </CustomItem>

      <CustomDiv>
        <div className="odii-form-label">Giấy phép kinh doanh</div>
        <div>
          Tải lên hình ảnh, tập tin các giấy tờ bắt buộc theo ngành hàng của
          bạn.
        </div>
      </CustomDiv>

      <CustomLicense>
        <div className="title__license">
          <div className="d-flex">
            <img
              className="iconLicense"
              src={isHadImg ? iconIsHadImg : iconExclamationMark}
              alt=""
            />
            {isHadImg ? (
              <div>Hình ảnh hợp lệ</div>
            ) : (
              <div>
                Vui lòng chọn ảnh chụp của giấy phép kinh doanh (Nếu có)
              </div>
            )}
          </div>
          {!isShowUpload ? (
            <RightOutlined onClick={() => setisShowUpload(!isShowUpload)} />
          ) : (
            <DownOutlined onClick={() => setisShowUpload(!isShowUpload)} />
          )}
        </div>
        {isShowUpload ? (
          <div className="odii-form-upload">
            <Item
              name="image_license"
              label=""
              valuePropName="data"
              // getValueFromEvent={normFile}
              {...layout}
            >
              <PicturesWall
                maxImages={7}
                url="common-service/upload-image-file?source=supplier"
                onChange={handleChangeLicenseImages}
              />
            </Item>
          </div>
        ) : (
          ''
        )}
      </CustomLicense>
    </CustomSectionWrapper>
  );
});

const CustomSectionWrapper = styled.div`
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
  .not-show-full {
    .category-setting__item:nth-child(n + 8) {
      display: none;
    }
  }
`;

const TxtRequired = styled.div`
  margin: -14px 10px 10px;
  color: #ff4d4f;
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

const CustomDivCategories = styled.div`
  display: flex;
  flex-wrap: wrap;
  .category-setting {
    &__item {
      border: solid 1px #ebebf0;
      width: 23%;
      display: inline-flex;
      align-items: center;
      padding: ${({ theme }) => (theme.space.s4 / 6) * 5}px
        ${({ theme }) => theme.space.s4}px;
      margin-bottom: 24px;
      border-radius: 4px;
      cursor: pointer;

      &:not(:nth-child(4n)) {
        margin-right: 24px;
      }

      &.selected {
        border-color: #3d56a6;
        color: #3d56a6;
        font-weight: 500;
        border-width: 2px;
        padding: ${({ theme }) => (theme.space.s4 / 6) * 5 - 1}px
          ${({ theme }) => theme.space.s4 - 1}px;
      }

      &_thumb {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        /* overflow: hidden; */
        margin-right: ${({ theme }) => theme.space.s4 / 3}px;

        img {
          width: 45px;
          height: 100%;
          border-radius: 50%;
          object-fit: contain;
          object-position: center center;
        }
      }
    }
  }
  .show-more {
    cursor: pointer;

    border: solid 1px #ebebf0;
    width: 23%;
    display: inline-flex;
    align-items: center;
    padding: ${({ theme }) => (theme.space.s4 / 6) * 5}px
      ${({ theme }) => theme.space.s4}px;
    margin-bottom: 24px;
    border-radius: 4px;
    cursor: pointer;

    .category-thumb-more {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      margin-right: ${({ theme }) => theme.space.s4 / 3}px;
      img {
        width: 45px;
        height: 45px;
        border-radius: 50%;
      }
    }
  }
`;

const CustomDiv = styled.div`
  padding-top: 24px;
  padding-bottom: 26px;
  border-top: 1px solid #ebebf0;
  border-bottom: 1px solid #ebebf0;
`;

export const CustomLicense = styled.div`
  padding: 14px 0 18px;
  border-bottom: 1px solid #ebebf0;
  .title__license {
    display: flex;
    justify-content: space-between;
  }
  .iconLicense {
    margin-right: 10px;
  }
  .anticon-right {
    margin-top: 6px;
  }
  .odii-form-upload {
    border: 1px dashed #ebebf0;
    margin-top: 16px;
    height: 128px;
    padding: 12px 0;
  }
  /* .ant-upload-select {
  max-width: 100%;
  max-height: 168px;
} */
`;
