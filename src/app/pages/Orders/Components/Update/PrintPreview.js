import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  memo,
} from 'react';

export default memo(
  forwardRef(function PrintPreview({ data, ...rest }, ref) {
    const getContentStr = dataItem => {
      try {
        return decodeURIComponent(
          atob(dataItem)
            .split('')
            .map(function (c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join(''),
        );
      } catch {
        return 'Không tìm thấy nội dung để in';
      }
    };

    return (
      <div className="print-preview-wrapper" ref={ref}>
        {data?.map((item, index) => (
          <div
            key={index}
            className="print-preview-page print-preview--center"
            {...rest}
            dangerouslySetInnerHTML={{ __html: getContentStr(item) }}
          ></div>
        ))}
      </div>
    );
  }),
);
