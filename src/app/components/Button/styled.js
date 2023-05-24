import styled from 'styled-components';
import { themes } from 'styles/theme/themes';
import { styledSystem } from 'styles/theme/utils';

const { light: theme } = themes;

const buttonPrimary = ({
  color,
  backgroundColor,
  hoverBackgroundColor,
  focusBorderColor,
}) => `
  color: ${color};
  background-color: ${backgroundColor};
  border-color: ${backgroundColor};

  &:hover {
    color: white;
    background-color: ${hoverBackgroundColor};
    border-color: ${hoverBackgroundColor};
  }

  &:disabled,
  &.disabled {
    color: ${theme.gray1};
    border-color: ${theme.grayPrimary};
    background-color: ${theme.grayPrimary};
    cursor: not-allowed;
    opacity: 1;
  }
`;

const buttonSecondary = ({
  color = theme.blackPrimary,
  borderColor = theme.blackPrimary,
  backgroundColor = 'transparent',
  hoverBackgroundColor = theme.greenMedium,
  focusBorderColor = theme.greenMedium,
  hoverColor = 'white',
}) => `
  color: ${color};
  background-color: ${backgroundColor};
  border: 1px solid ${borderColor};

  &:hover,
  &.active {
    color: ${hoverColor};
    background-color: ${hoverBackgroundColor};
    border-color: ${hoverBackgroundColor};
  }

  &:focus {
    border-color: transparent;
    box-shadow: 0 0 0 2pt ${focusBorderColor};
  }
  &:disabled,
  &.disabled {
    color: ${theme.gray1};
    border-color: ${theme.grayPrimary};
    background-color: ${theme.grayPrimary};
    cursor: not-allowed;
    opacity: 1;
  }
`;

const PRIMARY = {
  red: {
    color: theme.whitePrimary,
    backgroundColor: theme.secondary2,
    hoverBackgroundColor: theme.pinkPrimary,
    focusBorderColor: theme.pinkPrimary,
  },
  blue: {
    color: theme.whitePrimary,
    backgroundColor: theme.primary,
    hoverBackgroundColor: theme.darkBlue2,
    focusBorderColor: theme.darkBlue3,
  },
  green: {
    color: theme.whitePrimary,
    backgroundColor: theme.greenMedium1,
    hoverBackgroundColor: theme.greenMedium,
    focusBorderColor: theme.greenMedium,
  },
  grayBlue: {
    color: theme.whitePrimary,
    backgroundColor: theme.grayBlue,
    hoverBackgroundColor: theme.gray3,
    focusBorderColor: theme.gray1,
  },
  white: {
    backgroundColor: theme.whitePrimary,
    // color: theme.greenMedium1,
    color: theme.text,
    hoverBackgroundColor: theme.darkBlue1,
    borderColor: theme.stroke,
  },
  transparent: {
    borderColor: theme.stroke,
    color: theme.text,
    hoverColor: theme.greenMedium,
    hoverBackgroundColor: theme.darkBlue1,
    backgroundColor: 'transparent',
    focusBorderColor: 'transparent',
  },
};

const SECONDARY = {
  red: {
    color: theme.redPrimary,
    borderColor: theme.redPrimary,
    hoverBackgroundColor: theme.redPrimary,
    focusBorderColor: theme.redPrimary,
  },
  blue: {
    color: theme.primary,
    borderColor: theme.primary,
    hoverBackgroundColor: theme.primary,
    focusBorderColor: theme.primary,
  },
  green: {
    color: theme.greenMedium1,
    borderColor: theme.greenMedium1,
    hoverBackgroundColor: theme.greenMedium1,
    focusBorderColor: theme.greenMedium1,
  },
  white: {
    color: theme.whitePrimary,
    borderColor: theme.whitePrimary,
    hoverBackgroundColor: theme.greenMedium1,
    focusBorderColor: theme.greenMedium1,
  },
  orange: {
    color: theme.orangePrimary,
    borderColor: theme.orangePrimary,
    backgroundColor: theme.whitePrimary,
    hoverColor: theme.whitePrimary,
    hoverBackgroundColor: theme.orangePrimary,
  },
  default: {
    borderColor: theme.stroke,
    color: theme.text,
    backgroundColor: theme.whitePrimary,
    hoverColor: theme.whitePrimary,
    hoverBackgroundColor: theme.primary,
    focusBorderColor: theme.stroke,
  },
  transparent: {
    color: theme.primary,
    borderColor: 'transparent',
    // color: 'transparent',
    hoverColor: theme.blackPrimary,
    hoverBackgroundColor: 'transparent',
    focusBorderColor: 'transparent',
  },
};

const btnStyles = (context, color) => {
  switch (context) {
    case 'primary':
      return buttonPrimary(PRIMARY[color]);
    case 'secondary':
      return buttonSecondary(SECONDARY[color]);
    default:
      return buttonPrimary(PRIMARY.red);
  }
};

const ButtonWrapper = styledSystem(styled.button`
  && {
    text-align: center;
    font-weight: normal;
    font-size: 14px;
    border-radius: ${props => (props['data-rounded'] ? '999px' : '4px')};
    /* box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.043); */
    cursor: pointer;
    border-width: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
    width: ${props => props.width};

    &:focus {
      outline: none;
    }

    &.btn-sm {
      height: 32px;
      padding: 0 15px;
      font-size: 14px;
      font-weight: normal;
    }

    &.btn-md {
      padding: 0 20px;
      height: 40px;
    }

    &.btn-lg {
      height: 50px;
      padding: 0 25px;
    }
    ${({ context, color }) => btnStyles(context, color)};
  }
`);

export { ButtonWrapper };
