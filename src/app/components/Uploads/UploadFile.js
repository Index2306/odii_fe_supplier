import React, { useState, useRef, useEffect } from 'react';
import { Upload, message } from 'antd';
import { Button } from 'app/components';
import { UploadOutlined } from '@ant-design/icons';
import { uploadFile } from 'utils/request';
// import { PreviewPdf } from 'components/modal';

const getUploadedFileName = (url = '') => {
  const indexSlash = url?.lastIndexOf('/');
  const fileName = url?.slice(indexSlash + 1);

  return fileName;
};
export default function UploadFile({
  files,
  isUploaded,
  folder,
  onSaveFile,
  disabled,
  id,
  className,
  filePDF,
  lengthFile,
  errorFile,
}) {
  const filesRef = useRef([]);
  const pdfRef = useRef(null);
  const [state, _setState] = useState({
    fileList: filesRef.current,
    sizeAllFile: 0,
  });
  const setState = _state => {
    _setState(currentState => ({
      ...currentState,
      ...(_state || {}),
    }));
  };
  useEffect(() => {
    const currentFile = files;
    if (
      !currentFile ||
      currentFile?.length === 0 ||
      !Array.isArray(currentFile)
    )
      return;
    filesRef.current = currentFile
      .filter(d => d)
      .map(item => ({
        status: 'done',
        uid: item,
        name: item,
        url: item,
      }));

    setState({
      fileList: filesRef.current,
    });
  }, [files]);

  useEffect(() => {
    // In case: Append new UploadFile component
    if (isUploaded) {
      filesRef.current = [];
      setState({
        fileList: [],
      });
    }
  }, [isUploaded]);

  const onPreviewPdf = file => {
    if (pdfRef.current) {
      pdfRef.current.show(file);
    }
  };

  const handlePreview = async file => {
    if (file.url.endsWith('.pdf')) {
      onPreviewPdf(file);
      return;
    }
  };

  const { fileList } = state;
  const uploadButton = (
    <div>
      <Button
        closable="false"
        className="mt-3 btn-sm"
        context="primary"
        color="green"
        disabled={disabled}
      >
        <UploadOutlined className="mr-1" /> Tải lên
      </Button>
    </div>
  );
  const onUploadFile = file => {
    uploadFile(file, folder)
      .then(s => {
        const x = filesRef.current.find(item => item.uid === file.uid);
        if (x) {
          if (s?.code === 0 && s.data?.length) {
            const url = s.data[0];
            x.status = 'done';
            x.url = url;
            handleOnSaveFile();
          } else {
            x.status = 'error';
          }
          setState({
            fileList: filesRef.current,
          });
        }
      })
      .catch(() => {
        const x = filesRef.current.find(item => item.uid === file.uid);
        if (x) {
          x.status = 'error';
          setState({
            fileList: filesRef.current,
          });
        }
      });
  };
  const handleOnSaveFile = () => {
    const url = filesRef.current
      .filter(item => item.status === 'done')
      .map(item => item.url);
    if (onSaveFile) onSaveFile(url);
  };
  // const hasPdfFile = fileList.some(d => d?.url?.endsWith('.pdf'));
  return (
    <div className="clearfix custom-upload">
      <Upload
        id={id}
        disabled={disabled}
        fileList={fileList.map(item => {
          const item2 = {
            uid: item.uid,
            name: getUploadedFileName(item.url),
            url: item.url,
            status: item.status,
            linkProps: '{"download": "image"}',
          };
          if (item2.url) {
            const exts = item2.url.split('.');
            const ext = exts[exts.length - 1].toLowerCase();
            switch (ext) {
              case 'doc':
              case 'docx':
              case 'xlsx':
              case 'xls':
              case 'ppt':
              case 'pptx':
                item2.url = `https://docs.google.com/viewer?url=${item2.url.absoluteFileUrl()}&embedded=true`;
                break;
              default:
                item2.url = item2.url.absoluteFileUrl();
            }
          }

          return item2;
        })}
        onPreview={handlePreview}
        onRemove={file => {
          filesRef.current = filesRef.current.filter(
            item => item.uid !== file.uid,
          );
          setState({
            fileList: filesRef.current,
          });
          handleOnSaveFile();
        }}
        customRequest={({ onSuccess, onError, file }) => {
          file.status = 'uploading';
          const exts = file.name.split('.');
          const ext = exts[exts.length - 1].toLowerCase();
          if (filePDF && ext !== 'pdf') {
            message.success('Vui lòng tải file PDF', 'danger');
            return;
          }
          const sizeAllFile = state.sizeAllFile + file.size;
          if (file.size > 5242880) {
            message.error(
              'File tải lên vượt quá dung lượng 5MB, vui lòng kiểm tra lại.',
              'danger',
            );
            return;
          }
          if (sizeAllFile > 7864320) {
            message.show(
              'Các file tải lên có tổng dung lượng không được vượt quá 7.5MB, vui lòng kiểm tra lại.',
              'danger',
            );
            return;
          }
          filesRef.current.push(file);
          setState({
            sizeAllFile,
            fileList: filesRef.current,
          });
          onUploadFile(file);
        }}
        accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.rar,.7z,.zip,.pdf,.txt"
        className={className}
      >
        {fileList.length >= lengthFile ? null : uploadButton}
      </Upload>
      {errorFile && (
        <div className="has-error">
          <div className="ant-form-explain">Vui lòng chọn file!</div>
        </div>
      )}
      {/* {hasPdfFile && <PreviewPdf ref={pdfRef} />} */}
    </div>
  );
}

// UploadFile.propTypes = {
//   files: PropTypes.array.isRequired,
//   onSaveFile: PropTypes.func,
//   lengthFile: PropTypes.number,
//   errorFile: PropTypes.bool,
//   filePDF: PropTypes.bool,
//   disabled: PropTypes.bool,
//   isUploaded: PropTypes.bool,
//   folder: PropTypes.string.isRequired,
//   className: PropTypes.string,
//   id: PropTypes.string,
// };
