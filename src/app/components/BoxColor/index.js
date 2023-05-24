import styled from 'styled-components/macro';
import { styledSystem } from 'styles/theme/utils';
import Color from 'color';

export default styledSystem(styled.div`
  font-size: 12px;
  /* height: 20px; */
  line-height: 18px;
  display: inline-block;
  /* text-align: center; */
  padding: 4px 8px;
  border-radius: ${({ theme, colorValue, notBackground, notIcon }) =>
    notIcon ? '3px' : '20px'};
  color: ${({ theme, colorValue }) =>
    theme[colorValue || 'primary'] || colorValue};
  width: ${({ width }) => width || '100px'};
  background-color: ${({ theme, colorValue, notBackground }) =>
    notBackground
      ? ' transparent'
      : Color(theme[colorValue || 'primary'] || colorValue).alpha(0.2)};
  ::before {
    content: ' ';
    text-align: left;
    height: 7px;
    margin-right: 7px;
    width: 7px;
    background-color: ${({ theme, colorValue, notBackground }) =>
      theme[colorValue || 'primary'] || colorValue};
    border-radius: 50%;
    display: ${({ theme, colorValue, notBackground, notIcon }) =>
      notIcon ? ' none' : 'inline-block'};
  }
`);
