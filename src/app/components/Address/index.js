import * as React from 'react';
import { Select } from 'antd';
import request from 'utils/request';
import Input from '../Input';

const { Option } = Select;

export default function Address(props) {
  const [countryOptions, setContryOptions] = React.useState([]);
  const [provinceOptions, setProvinceOptions] = React.useState([]);
  const [districtOptions, setDistrictOptions] = React.useState([]);
  const [wardOptions, setWardOptions] = React.useState([]);

  const requestURL = 'common-service/location-country';

  React.useEffect(() => {
    const fetchContryOptions = async () => {
      const { data } = await request(requestURL, {})
        .then(response => response)
        .catch(error => error);

      if (data) {
        const contries = data.map(item => {
          return {
            ...item,
            label: item.name,
            value: item.name,
          };
        });

        setContryOptions(contries);
      }
    };

    fetchContryOptions();
  }, []);

  const handleSelectCountry = async (value, option) => {
    const { data } = await request(
      `${requestURL}?parent_id=${option.id}&type=province`,
      {},
    )
      .then(response => response)
      .catch(error => error);

    if (data) {
      const provinces = data.map(item => {
        return {
          ...item,
          label: item.name,
          value: item.name,
        };
      });

      setProvinceOptions(provinces);

      props.onChange({ country: option.value, country_code: option.code });
    }
  };

  const handleSelectProvince = async (value, option) => {
    const { data } = await request(
      `${requestURL}?parent_id=${option.id}&type=district`,
      {},
    )
      .then(response => response)
      .catch(error => error);

    if (data) {
      const districts = data.map(item => {
        return {
          ...item,
          label: item.name,
          value: item.name,
        };
      });
      setDistrictOptions(districts);

      props.onChange({ province: option.value, province_code: option.id });
    }
  };

  const handleSelectDistrict = async (value, option) => {
    const { data } = await request(
      `${requestURL}?parent_id=${option.id}&type=ward`,
      {},
    )
      .then(response => response)
      .catch(error => error);

    if (data) {
      const wards = data.map(item => {
        return {
          ...item,
          label: item.name,
          value: item.name,
        };
      });
      setWardOptions(wards);

      props.onChange({ district_name: option.value, district_id: option.id });
    }
  };

  const handleSelectWard = async (value, option) => {
    props.onChange({ ward_name: option.value, ward_id: option.id });
  };

  const handleChangeAddress = e => {
    props.onChange({ address1: e.target.value.trim() });
  };

  return (
    <>
      <div className="odii-form-item">
        <div className="odii-form-label">Địa chỉ</div>

        <Input
          className="odii-input"
          onChange={handleChangeAddress}
          placeholder="Nhập địa chỉ"
        />
      </div>

      <div className="odii-form-item">
        <div className="odii-form-label">Quốc gia</div>

        <Select
          options={countryOptions}
          placeholder="Chọn quốc gia"
          onSelect={handleSelectCountry}
          className="odii-selector"
        >
          {countryOptions.map(country => (
            <Option value={country.code} key={country.code}>
              {country.name}
            </Option>
          ))}
        </Select>
      </div>

      <div className="odii-form-item">
        <div className="odii-form-label">Tỉnh / Thành phố</div>

        <Select
          options={provinceOptions}
          placeholder="Chọn tỉnh / thành phố"
          onSelect={handleSelectProvince}
          className="odii-selector"
        >
          {provinceOptions.map(province => (
            <Option value={province.code} key={province.id}>
              {province.name}
            </Option>
          ))}
        </Select>
      </div>

      <div className="odii-form-item">
        <div className="odii-form-label">Quận / Huyện</div>

        <Select
          options={districtOptions}
          placeholder="Chọn quận / huyện"
          onSelect={handleSelectDistrict}
          className="odii-selector"
        >
          {districtOptions.map(district => (
            <Option value={district.code} key={district.id}>
              {district.name}
            </Option>
          ))}
        </Select>
      </div>

      <div className="odii-form-item">
        <div className="odii-form-label">Phường / Xã</div>

        <Select
          options={wardOptions}
          placeholder="Chọn phường / xã"
          onSelect={handleSelectWard}
          className="odii-selector"
        >
          {wardOptions.map(ward => (
            <Option value={ward.code} key={ward.id}>
              {ward.name}
            </Option>
          ))}
        </Select>
      </div>
    </>
  );
}
