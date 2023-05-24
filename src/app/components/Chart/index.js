import React from 'react';
import { CustomStyle } from 'styles/commons';
import styled from 'styled-components';
import { formatCash, formatMoney } from 'utils/helpers';

import {
  ResponsiveContainer,
  LineChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
} from 'recharts';

export const COLORS = ['#219737', '#EF5816'];

const formatterToolTip = (value, name) => [formatCash(value), name];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <CustomStyle className="tooltip-chart">
        <div className="label">{label}</div>
        {payload.map(item => (
          <CustomStyle className="item">
            <div className="item-left">
              <div
                className="dot"
                style={{ background: `${item.color}` }}
              ></div>
              {item.name}
            </div>
            <div className="item-right">
              {item.dataKey == 'revenue' ? formatMoney(item.value) : item.value}
            </div>
          </CustomStyle>
        ))}
      </CustomStyle>
    );
  }

  return null;
};

const renderLegend = props => {
  const { payload } = props;

  if (payload) {
    return (
      <CustomStyle className="legend-chart">
        {payload.map((entry, index) => (
          <>
            {entry.value && (
              <div key={`item-${index}`} className="item">
                <div
                  className="icon-dot"
                  style={{ background: `${entry.color}` }}
                ></div>
                {entry.value}
              </div>
            )}
          </>
        ))}
      </CustomStyle>
    );
  }
};

export default function Chart(props) {
  const { data, lineData, hideY, animation } = props;

  return (
    <ChartCustom>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            // left: 20,
          }}
          width={400}
          height={300}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={lineData[0].name} />
          <YAxis
            tickFormatter={tick => {
              return formatCash(tick);
            }}
            label={{
              value: '',
              angle: -90,
              position: 'insideLeft',
            }}
            hide={hideY}
            yAxisId="left"
          />
          <YAxis
            tickFormatter={tick => {
              return formatCash(tick);
            }}
            label={{
              value: '',
              angle: -90,
              position: 'insideLeft',
            }}
            hide={hideY}
            yAxisId="right"
            orientation="right"
          />
          <Tooltip formatter={formatterToolTip} content={<CustomTooltip />} />
          <Legend content={renderLegend} />
          {lineData.map((fieldInfo, index) => (
            <Line
              type="linear"
              dataKey={fieldInfo.key}
              stroke={COLORS[index % COLORS.length]}
              name={fieldInfo.label}
              activeDot={{ r: 5 }}
              strokeWidth={1.5}
              dot={{ strokeWidth: 1 }}
              yAxisId={fieldInfo.location}
            />
          ))}
          <Bar />
        </LineChart>
      </ResponsiveContainer>
    </ChartCustom>
  );
}

const ChartCustom = styled.div`
  overflow: hidden;
  overflow-x: scroll;
  width: 100%;
  overflow-y: scroll;
  height: 367px;
  .scroll-item {
    width: 100%;
    min-width: ${props => props.scrollItemWidth}px;
    height: 100%;
  }

  .recharts-legend-item {
    &:last-child {
      display: none !important;
    }
  }
  .tooltip-chart {
    background: rgba(28, 28, 28, 0.8);
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.25);
    border-radius: 6px;
    padding: 16px;
    color: #fff;
    font-size: 14px;
    width: 223px;

    .label {
      font-weight: 600;
    }

    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 10px;

      .item-left {
        display: flex;
        align-items: center;

        .dot {
          width: 12px;
          height: 12px;
          border: 1px solid #fff1f1;
          border-radius: 18px;
          margin-right: 8px;
        }
      }

      .item-right {
        font-weight: 500;
      }
    }
  }
  .recharts-legend-wrapper {
    bottom: 0 !important;
  }
  .legend-chart {
    display: flex;
    align-items: center;
    justify-content: center;

    .item {
      &:not(:last-child) {
        margin-right: 25px;
      }
      display: flex;
      align-items: center;
      color: #000000;
      font-size: 12px;

      .icon-dot {
        width: 10px;
        height: 10px;
        border: 1px solid #fff1f1;
        border-radius: 18px;
        margin-right: 7px;
      }
    }
  }
`;
