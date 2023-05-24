import React, { memo, useState, useEffect } from 'react';
import { Upload, message } from 'antd';
import styled from 'styled-components/macro';
import { Image } from 'app/components';
import { uploadImage } from 'utils/request';
import { isEmpty } from 'lodash';
import { withFormContext } from 'app/components/DataEntry/Form/withFormContext';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

export default withFormContext(
  memo(function Avatar({ data, onChange, disabled, type }) {
    const [state, setState] = useState({
      loading: false,
      imageUrl: data?.location || '',
    });

    useEffect(() => {
      if (!isEmpty(data)) setState({ imageUrl: data?.location });
    }, [data]);

    function getBase64(img, callback) {
      const reader = new FileReader();
      reader.addEventListener('load', () => callback(reader.result));
      reader.readAsDataURL(img);
    }
    const handleChange = info => {
      // let fileList = [...info.fileList];
      if (info.file.status === 'uploading') {
        setState({ loading: true });
        return;
      }
      if (info.file.status === 'error') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl =>
          setState({
            // imageUrl,
            loading: false,
          }),
        );
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl =>
          setState({
            imageUrl: info.file.response.origin,
            loading: false,
          }),
        );
        onChange(info.file.response);
      }
    };

    function beforeUpload(file) {
      const isJpgOrPng =
        (file.type === 'image/jpeg' || file.type === 'image/png') &&
        /.png|.jpeg|.jpg/.test(file.name);
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
      }
      const isLimit = file.size / 1024 / 1024 < 2;
      if (!isLimit) {
        message.error(
          'File tải lên vượt quá dung lượng 2MB, vui lòng kiểm tra lại!',
        );
      }
      return isJpgOrPng && isLimit;
    }

    const { imageUrl, loading } = state;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        {/* <div style={{ marginTop: 8 }}>Upload</div> */}
      </div>
    );

    const dummyRequest = ({ file, onSuccess }) => {
      uploadImage(file, null, { source: 'supplier', type: type })
        .then(result => {
          onSuccess(result?.data);
        })
        .catch(err => {});
    };
    return (
      <div>
        <CustomUpload
          name="avatar"
          listType="picture-card"
          iconRender
          hasImage={!!imageUrl}
          className="avatar-uploader"
          showUploadList={false}
          // action={upLoad}
          customRequest={dummyRequest}
          disabled={disabled}
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {imageUrl ? (
            <Image src={imageUrl} size={type ? '' : '500x500'} alt="avatar" />
          ) : (
            uploadButton
          )}
        </CustomUpload>
      </div>
    );
  }),
);

const CustomUpload = styled(Upload)`
  .ant-upload-select {
    width: 100%;
    margin: 0 auto;
    height: auto;
    border-width: ${({ hasImage }) => (hasImage ? '0px' : '1px')};
    border-radius: 4px;
    border-color: ${({ theme }) => theme.grayBlue};
    span.ant-upload {
      color: ${({ theme }) => theme.grayBlue};
      font-size: 20px;
      position: relative;
      display: block;
      padding-bottom: 100%;
      width: 100%;
      height: 0px;
      > * {
        top: 50%;
        left: 50%;
        width: 100%;
        position: absolute;
        /* right: 50%;
        bottom: 50%; */
        transform: translate(-50%, -50%);
      }
      img {
        /* width: 100%; */
        /* position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0; */
        border-radius: 4px;
        max-width: 400px;
        max-height: 311px;
        object-fit: cover;
      }
    }
  }
`;
