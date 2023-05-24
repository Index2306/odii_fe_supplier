/* eslint-disable no-unused-expressions */
import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { withFormContext } from 'app/components/DataEntry/Form/withFormContext';
import { ButtonWrapper } from './styled';

const Button = withFormContext(
  memo(function Button(props) {
    const [isDisable, setIsDisable] = useState(false);
    const {
      className,
      context,
      color,
      type,
      onClick,
      style,
      children,
      rounded,
      size,
      disabled,
      needWait,
      ...otherProps
    } = props;

    const handleClick = e => {
      setIsDisable(true);
      (async () => {
        try {
          await props.onClick(e);
          setTimeout(() => {
            setIsDisable(false);
          }, 500);
        } catch (err) {
          setIsDisable(false);
        }
      })();
    };
    return (
      <ButtonWrapper
        className={className}
        context={context}
        color={color}
        type={type}
        style={style}
        data-rounded={rounded}
        onClick={needWait ? handleClick : onClick}
        disabled={disabled || isDisable}
        size={size}
        {...otherProps}
      >
        {children}
      </ButtonWrapper>
    );
  }),
);

Button.defaultProps = {
  context: 'primary',
  color: 'blue',
  type: 'button',
  onClick: null,
  style: {},
};

Button.propTypes = {
  /** primary, secondary */
  context: PropTypes.string,
  type: PropTypes.string,
  /** red, blue */
  color: PropTypes.oneOf(['red', 'blue', 'white', 'green', 'transparent']),
  /** sm, md = default, lg */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  onClick: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  rounded: PropTypes.bool,
  disabled: PropTypes.bool,
  needWait: PropTypes.bool,
  children: PropTypes.node,
};
export default Button;
