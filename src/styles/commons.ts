import styled from 'styled-components';
import { styledSystem } from './theme/utils';

export const CustomH1 = styledSystem(
  styled.h1`
    font-weight: 700;
  `,
);
export const CustomH2 = styledSystem(
  styled.h2`
    font-weight: 700;
  `,
);
export const CustomH3 = styledSystem(
  styled.h3`
    font-weight: 700;
  `,
);
export const CustomH4 = styledSystem(
  styled.h4`
    font-weight: 700;
  `,
);

export const CustomTitle = styledSystem(styled.div``);
CustomTitle.defaultProps = {
  color: 'primary',
  fontWeight: 'black',
  fontSize: 'f6',
  mb: { xs: 's7' },
};

export const SectionWrapper = styledSystem(
  styled.div`
    background: #ffffff;
    margin-bottom: 20px;
    padding: 17px 20px;
    border: 1px solid #e6e6e9;
    border-radius: 4px;
  `,
);
export const SectionWrapperCustom = styledSystem(
  styled.div`
    background: #ffffff;
    margin-bottom: 20px;
    border-radius: 4px;
  `,
);
export const CustomStyle = styledSystem(styled.div``);
