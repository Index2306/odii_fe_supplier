import React, { memo, useState, useEffect } from 'react';
import { Upload, message, Modal } from 'antd';
import styled from 'styled-components/macro';
import { uploadImage } from 'utils/request';
import { isEmpty, cloneDeep } from 'lodash';
import { Image } from 'app/components';
import { withFormContext } from 'app/components/DataEntry/Form/withFormContext';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

export default withFormContext(
  memo(function PicturesWall({
    data,
    onChange = () => null,
    url,
    disabled,
    maxImages = 8,
    onRemove,
    ...res
  }) {
    const [state, setState] = useState({
      loading: false,
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      fileList: data || [],
    });

    useEffect(() => {
      if (!isEmpty(data)) setState({ fileList: data });
    }, [data]);

    const handleCancel = () => setState({ ...state, previewVisible: false });

    const handlePreview = async file => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }

      setState({
        ...state,
        previewImage: file.location || file.url || file.preview,
        previewVisible: true,
        previewTitle:
          file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
      });
    };

    function getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }

    const handleChange = ({ fileList, file }) => {
      if (fileList?.length > maxImages) {
        message.error(`Tối đa ${maxImages} ảnh!`);
        return;
      }

      if (
        file.status === 'removed' ||
        (file.status === 'done' &&
          !fileList.some(item => item.status === 'uploading'))
      ) {
        const handleFileList = fileList.reduce((finalList, item) => {
          if (item?.response) {
            finalList.push({ ...item.response });
          } else {
            finalList.push(item);
          }
          return finalList;
        }, []);
        onChange(handleFileList);
      }
      setState({ fileList: fileList });
    };

    function beforeUpload(file) {
      const isJpgOrPng =
        (file.type === 'image/jpeg' || file.type === 'image/png') &&
        /.png|.jpeg|.jpg/.test(file.name);
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
        return Upload.LIST_IGNORE;
      }
      const isLimit = file.size / 1024 / 1024 < 2;
      if (!isLimit) {
        message.error(
          'File tải lên vượt quá dung lượng 2MB, vui lòng kiểm tra lại!',
        );
        return Upload.LIST_IGNORE;
      }
      return isJpgOrPng && isLimit;
    }

    const dummyRequest = ({ file, onSuccess, onError, ...res }) => {
      uploadImage(file, url)
        .then(result => {
          onSuccess(result.data);
          // onSuccess(null, {});
          // setState({ fileList: [...fileList, result?.data] });
          // onChange([...data, result?.data]);
        })
        .catch(e => {
          message.error('Upload file không thành công');
          // const updatedDocuments = data.filter(record => record.uid !== file.uid);
          // onChange([...data, updatedDocuments]);
          onError(e);
        });
    };

    const {
      previewVisible,
      previewImage,
      fileList,
      previewTitle,
      loading,
    } = state;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        {/* <div style={{ marginTop: 8 }}>Upload</div> */}
      </div>
    );

    return (
      <div>
        <CustomUpload
          listType="picture-card"
          className="avatar-uploader"
          // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          // fileList={[...fileList]}
          fileList={(fileList || [])
            .filter(d => d)
            .map(item => {
              let item2 = cloneDeep(item);
              if (!item2.url) {
                item2.url = `${
                  item2?.host || process.env.REACT_APP_FILE_STATIC_HOST
                }/200x200/${item2?.response?.location || item2?.location}`;
                // item2.url = item2?.origin;
              }
              return item2;
            })}
          customRequest={dummyRequest}
          onRemove={onRemove}
          disabled={disabled}
          beforeUpload={beforeUpload}
          button={<LoadingOutlined />}
          // showUploadList={{ showRemoveIcon: false, showPreviewIcon: false }}
          onChange={handleChange}
          maxCount={maxImages} // get first item if > maxImages
          onPreview={handlePreview}
          {...res}
        >
          {disabled || fileList?.length >= maxImages ? null : uploadButton}
        </CustomUpload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <div className="d-flex justify-content-center">
            <Image alt="example" src={previewImage} />
          </div>
        </Modal>
      </div>
    );
  }),
);

const CustomUpload = styled(Upload)`
  /* padding-bottom: 100%; */
  /* width: 100%; */
  /* height: 0px; */
  /* min-width: 128px; */
  .ant-upload-select {
    border-color: ${({ theme }) => theme.grayBlue};
    &.ant-upload-list-item-error { 
      border-color: ${({ theme }) => theme.secondary2};
  }
  .anticon {
    color: ${({ theme }) => theme.grayBlue};
    font-size: 20px;
  }
  > .ant-upload {
    /* width: 100%; */
    /* width: 227px; */
    /* height: 227px; */
  }
  .ant-upload-list-picture-card-container,
  .ant-upload-select-picture-card {
    width: 100px;
    height: 100px;
  }
  .ant-upload-list-item {
    border: 1px solid #e6e6e9;
    padding: 0;
    border-radius: 4px;
  }
  img {
    border-radius: 3px;
  }
`;

// const fakeImage = [
//   {
//     uid: '-4',
//     name: 'image.png',
//     status: 'done',
//     url:
//       'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//   },
//   {
//     uid: '-xxx',
//     percent: 50,
//     name: 'image.png',
//     status: 'uploading',
//     url:
//       'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//   },
//   {
//     uid: '-5',
//     name: 'image.png',
//     status: 'error',
//   },
// ];
