import React from 'react';
// import { useGlobalSlice } from 'app/pages/AppPrivate/slice';
import { selectCurrentModal } from 'app/pages/AppPrivate/slice/selectors';
import { useSelector } from 'react-redux';

const RootModalComponent = () => {
  const currentModal = useSelector(selectCurrentModal);
  const { modalType, modalProps } = currentModal;
  const ModalComponent = modalType;
  if (!ModalComponent) return null;
  return <ModalComponent {...modalProps} />;
};

export default RootModalComponent;
