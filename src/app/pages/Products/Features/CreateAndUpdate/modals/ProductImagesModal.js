import React from 'react';
import styled from 'styled-components';
import { PicturesWall } from 'app/components/Uploads';
import { Modal } from 'app/components';

export default function ProductImagesModal({
  layout,
  product_images = [],
  setVariations,
  toggleImagesModal,
  setFieldsValue,
  variations,
  detailVariations,
  ...res
}) {
  const handlePickImage = thumb => () => {
    const newVariations = variations.slice(0);
    for (const iterator of detailVariations) {
      newVariations[iterator] = { ...newVariations[iterator], thumb };
    }
    setVariations(newVariations);
    toggleImagesModal();
  };

  const handleAddImage = listImage => {
    setFieldsValue({ product_images: listImage });
  };

  return (
    <div>
      <Modal
        {...res}
        title={`Chọn ảnh đại diện cho biến thể ${
          variations[detailVariations]?.option_1 || ''
        } ${variations[detailVariations]?.option_2 || ''}
         `}
        isOpen
        width={600}
        footer={null}
        callBackCancel={toggleImagesModal}
      >
        <PicturesWall
          maxImages={8}
          data={product_images}
          onChange={handleAddImage}
          url="product-service/product/upload-product-image"
          showUploadList={{ showRemoveIcon: false, showPreviewIcon: false }}
          itemRender={(originNode, file) => (
            <WrapperImage onClick={handlePickImage(file)}>
              {originNode}
            </WrapperImage>
          )}
        />
      </Modal>
    </div>
  );
}

const WrapperImage = styled.div`
  cursor: pointer;
`;
