/* eslint-disable no-unused-vars */
import React, { memo, useRef, useEffect } from 'react';
import { Row, Col, Spin, Tooltip } from 'antd';
import styled from 'styled-components/macro';
import { Form } from 'app/components';
import ReactQuill, { Quill } from 'react-quill';
import { uploadImage } from 'utils/request';
import 'react-quill/dist/quill.snow.css';
const Item = Form.Item;

var Clipboard = Quill.import('modules/clipboard');
let Inline = Quill.import('blots/inline');
let BlockEmbed = Quill.import('blots/block/embed');
var Delta = Quill.import('delta');

class LinkBlot extends Inline {
  static create(url) {
    let node = super.create();
    node.setAttribute('href', url);
    node.setAttribute('target', '_blank');
    return node;
  }

  static formats(node) {
    return node.getAttribute('href');
  }
}
LinkBlot.blotName = 'link';
LinkBlot.tagName = 'a';

class VideoBlot extends BlockEmbed {
  static create(url) {
    let node = super.create();
    node.setAttribute('src', url);
    // Set non-format related attributes with static values
    node.setAttribute('frameborder', '0');
    node.setAttribute('height', '400');
    node.setAttribute('width', '100%');
    node.setAttribute('allowfullscreen', true);

    return node;
  }

  static formats(node) {
    // We still need to report unregistered embed formats
    let format = {};
    if (node.hasAttribute('height')) {
      format.height = node.getAttribute('height');
    }
    if (node.hasAttribute('width')) {
      format.width = node.getAttribute('width');
    }
    return format;
  }

  static value(node) {
    return node.getAttribute('src');
  }

  format(name, value) {
    // Handle unregistered embed formats
    if (name === 'height' || name === 'width') {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name, value);
      }
    } else {
      super.format(name, value);
    }
  }
}
VideoBlot.blotName = 'video';
VideoBlot.tagName = 'iframe';
Quill.register(LinkBlot);
Quill.register(VideoBlot);

// var QuillReact = new Quill('#editor');

/*
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */

const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'align',
  'background',
  'color',
  'script',
];

const MyEditor = function MyEditor({ value, onChange, disabled = false }) {
  const [editorHtml, setEditorHtml] = React.useState(value);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    if (!editorHtml && value) setEditorHtml(value);
  }, [value]);

  const quill = useRef(null);
  const modules = useRef({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        // [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [
          { list: 'ordered' },
          { list: 'bullet' },
          { indent: '-1' },
          { indent: '+1' },
          { color: [] },
          { background: [] },
          { align: [] },
        ],
        ['link'],
        ['clean'],
      ],
      bounds: document.body,
      clipboard: {},
    },
  });

  const handleChange = value => {
    setEditorHtml(value);
    onChange(value);
  };

  return (
    <Spin tip="Đang tải..." spinning={isLoading}>
      <CustomEditor>
        <ReactQuill
          ref={quill}
          readOnly={disabled}
          theme="snow"
          modules={modules?.current}
          formats={formats}
          value={editorHtml || ''}
          placeholder="Nhập mô tả..."
          onChange={handleChange}
        />
      </CustomEditor>
    </Spin>
  );
};
export default memo(function Description({ layout, form }) {
  const { setFieldsValue } = form;
  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e;
  };

  return (
    <>
      <Item
        name="note"
        label="Mô tả khuyến mại"
        getValueFromEvent={normFile}
        valuePropName="value"
        {...layout}
        // rules={[
        //   {
        //     required: true,
        //     message: 'Vui lòng nhập mô tả !',
        //   },
        //   {
        //     max: 10000,
        //     message: 'mô tả nhiều nhất 10000 kí tự.',
        //   },
        // ]}
      >
        <MyEditor />
      </Item>
    </>
  );
});

const CustomEditor = styled.div`
  .ql-editor {
    height: 18em;
    .embed-container {
      position: relative;
      padding-bottom: 56.25%;
      height: 0;
      overflow: hidden;
      max-width: 100%;
    }
    .embed-container iframe,
    .embed-container object,
    .embed-container embed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  .ql-color,
  .ql-background,
  .ql-align {
    line-height: 16px;
    /* margin-bottom: 5px; */
  }
  .ql-video {
    /* width: 100%; */
    /* height: 400px; */
  }
`;
