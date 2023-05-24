import styled from 'styled-components/macro';
// import { Dropdown, Menu, Modal as AntdModal, Select, Pagination } from 'antd';
import color from 'color';
// const { Item: MenuItem } = Menu;

export const ProductList = styled.div`
  display: flex;
  flex-wrap: wrap;
  /* margin: ${({ theme }) => theme.space.s4 * 4}px 0 0; */
`;

export const MainWrapper = styled.div`
  @media screen and (min-width: 1600px) {
    width: ${({ theme }) => `calc(1480px + ${theme.space.s4 * 4}px)`};
    margin: 0 auto;
  }
`;

export const ProductItem = styled.div`
  width: 250px;
  background-color: ${({ theme }) => theme.whitePrimary};
  border-radius: ${({ theme }) => theme.radius}px;
  margin-bottom: 28px;
  transition: all 0.3s, margin 0s;
  position: relative;
  border: solid 1px ${({ theme }) => theme.stroke};
  margin-right: 29px;

  @media screen and (max-width: 1599px) {
    &:nth-child(4n) {
      margin-right: 0;
    }
  }

  @media screen and (min-width: 1600px) {
    & {
      width: 280px;
    }
    &:nth-child(5n) {
      margin-right: 0;
    }
  }

  &:hover {
    box-shadow: 0px 5px 15px rgba(30, 70, 117, 0.15);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

    /* .action {
      opacity: 1 !important;
      height: 44px !important;

      button {
        transform: translateY(0px) !important;
        opacity: 1 !important;
      }
    } */
  }

  .thumb {
    width: 100%;
    padding-bottom: 100%;
    position: relative;
    cursor: pointer;
    border-top-left-radius: ${({ theme }) => theme.radius}px;
    border-top-right-radius: ${({ theme }) => theme.radius}px;
    overflow: hidden;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
    }

    .ant-image {
      position: unset;
      display: block;
    }
  }

  .info {
    padding: 0 ${({ theme }) => theme.space.s4}px 14px;
    height: 220px;

    .box-custom {
      padding: 4px 0 0 !important;
    }

    .name {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1; /* number of lines to show */
      -webkit-box-orient: vertical;
      /* min-height: ${({ theme }) =>
        theme.space.s4 * theme.lineHeight * 2}px; */
      /* max-height: ${({ theme }) =>
        theme.space.s4 * theme.lineHeight * 2}px; */
      cursor: pointer;

      &:hover {
        color: ${({ theme }) => color(theme.text).darken(0.5)};
      }
    }

    .supplier {
      display: flex;
      margin-bottom: ${({ theme }) => theme.space.s4}px;
      font-size: ${({ theme }) => theme.fontSizes.f1}px;
      a {
        color: ${({ theme }) => theme.text};
        &:hover {
          color: ${({ theme }) => theme.primary};
        }
      }
    }

    .price {
      margin-bottom: ${({ theme }) => theme.space.s4}px;
      margin-bottom: 10px;

      .text-right {
        text-align: right;
      }

      .text-item {
        font-size: 12px;
      }

      .price-item {
        font-weight: 500;
        margin-left: 5px;

        .price-suggest {
          display: flex;
          font-weight: normal;
          font-size: 13px;

          .percent {
            margin-left: 5px;
            font-size: 12px;
            font-weight: normal;
            line-height: 22px;
          }
        }
      }

      .price-left {
        display: flex;
        align-items: center;
      }
      .price-right {
        display: flex;
        align-items: center;
      }
    }

    .rating {
      margin-bottom: ${({ theme }) => theme.space.s4}px;

      .fa-star {
        &.active {
          background: linear-gradient(93.29deg, #ffbd2a 1.65%, #fd7659 178.67%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        &:not(.active) {
          color: #e0e0e0;
        }
      }

      .fa-star-half-alt {
        color: ${({ theme }) => theme.grayBlue};
        margin-right: ${({ theme }) => theme.space.s4 / 4}px;

        & + span {
          color: ${({ theme }) => theme.grayBlue};
          font-size: ${({ theme }) => theme.fontSizes.f1}px;
          font-style: italic;
        }
      }

      .vote-count {
        margin-left: ${({ theme }) => theme.space.s4 / 2}px;
        color: ${({ theme }) => theme.gray3};
      }
    }

    .more {
      display: flex;
      font-size: ${({ theme }) => theme.fontSizes.f1}px;
    }

    .variant {
      border-right: solid 1px ${({ theme }) => theme.stroke};
      /* padding-right: ${({ theme }) => theme.space.s4 * 1.5}px; */
      flex: 1;
      &-title {
        color: ${({ theme }) => theme.gray3};
      }

      &-info {
        display: flex;
        align-items: center;

        img {
          margin-right: ${({ theme }) => theme.space.s4 / 3}px;
        }
      }
    }

    .quantity {
      flex: 1;
      &-title {
        color: ${({ theme }) => theme.gray3};
      }

      .quantity-title {
        text-align: right;
      }
    }

    .action {
      position: absolute;
      width: 100%;
      top: 100%;
      left: 0;
      border-bottom-left-radius: ${({ theme }) => theme.radius}px;
      border-bottom-right-radius: ${({ theme }) => theme.radius}px;
      padding: ${({ theme }) => theme.space.s4}px;
      padding-top: 0;
      background-color: ${({ theme }) => theme.whitePrimary};
      box-shadow: 0px 15px 15px rgba(30, 70, 117, 0.15);
      opacity: 0;
      transition: visibility 0s, opacity 0.2s linear;
      z-index: 999;
      height: 0px;
      overflow: hidden;
      transition: height 0.3s ease-out 0s;

      button {
        width: 100%;
        opacity: 0;
        height: 30px;
        transform: translateY(-10px);
        transition: all 0.3s ease-out 0s;
      }
    }
  }
  .flex-col {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`;
