import * as React from 'react';
import { BoxColor } from 'app/components';

// import { isEmpty } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { formatDateRange } from 'utils/helpers';
import { useAccountDebtByPeriodSlice } from '../slice';
import { selectOverviewStats } from '../slice/selectors';
import moment from 'moment';

export function DebtPeriodInfo({ history, debtPeriodKey }) {
  const { actions } = useAccountDebtByPeriodSlice();
  const dispatch = useDispatch();
  const overviewStats = useSelector(selectOverviewStats);
  // const currDebtPeriod = useSelector(selectCurrDebtPeriod);

  React.useEffect(() => {
    fetchOverviewStats();
  }, []);

  const fetchOverviewStats = () => {
    dispatch(actions.getOverviewStats(debtPeriodKey));
  };

  const getPeriodStatus = (fromStr, toStr, titleAppend) => {
    if (!fromStr || !toStr) {
      return;
    }
    let color;
    let title;
    const fromTime = moment(fromStr);
    const toTime = moment(toStr);
    const now = moment();
    if (fromTime > now) {
      title = 'Chờ';
      color = 'secondary2';
    } else if (toTime < now) {
      title = 'Đã';
      color = 'greenMedium1';
    } else {
      title = 'Đang';
      color = 'darkBlue1';
    }

    return (
      <BoxColor className="payout-status" notBackground colorValue={color}>
        {title} {titleAppend}
      </BoxColor>
    );
  };

  return (
    <DebtPeriodInfoWrapper>
      <h3 className="overview__title">Chu kỳ</h3>
      <div className="overview__content">
        <div className="info-wrapper">
          <span className="info_title">Chu kỳ công nợ</span>
          <span className="info_value">
            {formatDateRange(
              overviewStats?.debt_period_start,
              overviewStats?.debt_period_end,
            )}
          </span>
        </div>
        <div className="info-wrapper">
          <span className="info_title">Chu kỳ thanh toán</span>
          <span className="info_value">
            {formatDateRange(
              overviewStats?.payout_period_start,
              overviewStats?.payout_period_end,
            )}
          </span>
        </div>
        <div className="info-wrapper">
          <span className="info_title">TT Đối soát</span>
          <span className="info_value">
            {getPeriodStatus(
              overviewStats?.debt_period_start,
              overviewStats?.debt_period_end,
              'đối soát',
            )}
          </span>
        </div>
        <div className="info-wrapper">
          <span className="info_title">TT Thanh toán</span>
          <span className="info_value">
            {getPeriodStatus(
              overviewStats?.payout_period_start,
              overviewStats?.payout_period_end,
              'thanh toán',
            )}
          </span>
        </div>
      </div>
    </DebtPeriodInfoWrapper>
  );
}

const DebtPeriodInfoWrapper = styled('div')`
  margin-top: 25px;
  margin-bottom: 5px;
  height: calc(100% - 30px);
  background: #ffffff;
  border: 1px solid #ebebf0;
  padding: 20px 25px 0 25px;
  border-radius: 4px;
  .info-wrapper {
    padding: 12px 0;
    display: flex;
    justify-content: space-between;
  }
  .overview__content .info-wrapper {
    border-bottom: 1px solid #ebebf0;
    .info_title {
      position: relative;
      color: #828282;
      padding-left: 15px;
      :before {
        content: '';
        position: absolute;
        width: 4px;
        height: 4px;
        top: 50%;
        background: #9b9b9b;
        border-radius: 100%;
        left: 0;
        transform: translateY(-50%);
      }
    }
    .info_value {
      color: #333333;
    }
  }
  .overview__content .info-wrapper:last-child {
    border-bottom: none;
  }
  .payout-status {
    font-size: 14px;
    white-space: nowrap;
    width: unset;
    top: 0;
    padding: 0;
  }
`;
