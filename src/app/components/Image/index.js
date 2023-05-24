import React, { memo } from 'react';
import { Image } from 'antd';
import { defaultImage } from 'assets/images';

export default memo(function ImageCustom({ src, size = '500x500', ...res }) {
  const handleUrl = function () {
    if (!src) return '';
    if (src.startsWith('http') || src.startsWith('blob')) {
      return src;
    }
    // if (
    //   !src.endsWith('.jpg') ||
    //   !src.endsWith('.png') ||
    //   src.endsWith('.JPG') ||
    //   src.endsWith('.PNG') ||
    //   !src.endsWith('.gif')
    // ) {
    //   return src;
    // }
    return `${process.env.REACT_APP_FILE_STATIC_HOST}/${size}/${src}`;
  };

  return (
    <Image fallback={defaultImage} preview={false} src={handleUrl()} {...res} />
  );
});
