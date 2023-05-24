import React from 'react';

const WrapperModal = Component => ({ hidden, ...other }) => {
  if (hidden) {
    return null;
  }

  return <Component {...other} />;
};

export default WrapperModal;
