import React, { memo } from 'react';
import Color from 'color';
import { iconLamp } from 'assets/images';
import { CustomStyle } from 'styles/commons';
import { CustomSectionWrapper } from './styled';

export default memo(function SuggestName({ layout }) {
  return (
    <CustomSectionWrapper
      mt={{ xs: 's4' }}
      bg={`${Color('#FFD555').alpha(0.2)}`}
      color="#A65208"
    >
      <CustomStyle display="flex" justifyContent="space-between">
        <CustomStyle>
          <CustomStyle fontWeight="bold" mb={{ xs: 's4' }}>
            Gợi ý
          </CustomStyle>
          <CustomStyle fontWeight="bold" mb={{ xs: 's3' }}>
            Tên sản phẩm
          </CustomStyle>
        </CustomStyle>
        <img src={iconLamp} alt="" />
      </CustomStyle>
      <CustomStyle fontSize={{ xs: 'f1' }} mb={{ xs: 's6' }}>
        Sử dụng tiếng Việt có dấu, không viết tắt, tối thiểu 10 ký tự, 20 ký tự
        đối với Shop Mall. Độ dài tối đa của tên sản phẩm cho tất cả các Shop là
        120 ký tự (bao gồm cả khoảng trắng).
      </CustomStyle>
      {/* <CustomStyle fontSize={{ xs: 'f1' }}>
        Tham khảo quy định đặt tên
      </CustomStyle> */}
    </CustomSectionWrapper>
  );
});
