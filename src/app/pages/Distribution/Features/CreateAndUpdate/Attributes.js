import React from 'react';
import { Row, Col } from 'antd';
import styled from 'styled-components/macro';
import { isEmpty } from 'lodash';
import { Input, Form, Select, Button } from 'app/components';
import { CustomSectionWrapper } from './styled';
//*[@id="4482815970"]/div/div/div[2]/div/a[4]/div[2]/div[2]
//*[@id='4482815970']/div/div/div[2]/div/a[1]/div[2]/div[2]
const Item = Form.Item;

function isMultiValue(attr) {
  return (
    attr.input_type === 'multiEnumInput' || attr.input_type === 'multiSelect'
  );
}

function Attributes({ data, attributes, arrayDataAttributes }) {
  const [listRequired, setListRequired] = React.useState([]);
  const [listFullRequired, setListFullRequired] = React.useState([]);
  const [listOptions, setListOptions] = React.useState([]);
  const [showOption, setShowOption] = React.useState(false);

  React.useEffect(() => {
    if (isEmpty(listFullRequired) && !isEmpty(listRequired)) {
      setListFullRequired(listRequired);
    }
    if (attributes.warranty_type === 'No Warranty') {
      setListRequired(listRequired.filter(item => item.name !== 'warranty'));
    } else if (!isEmpty(listFullRequired)) {
      setListRequired(listFullRequired);
      // setListFullRequired([]);
    }
  }, [attributes.warranty_type]);

  React.useEffect(() => {
    if (!isEmpty(data)) {
      // const { listR, listO } = data.reduce(
      //   (final, item) => {
      //     if (
      //       item.is_mandatory &&
      //       item.is_sale_prop === 1 &&
      //       item.attribute_type === 'sku' &&
      //       isMultiValue(item)
      //     ) {
      //       // yêu cầu nhập trường này ở list variation (Rất ít cat yêu cầu cái này)
      //     } else {
      //       if (item.is_mandatory) {
      //         // Hiện thị form nhập ở section product (Không phải trong list variation)
      //         final.listR.push(item);
      //         return final;
      //       }
      //       if (item.label == 'Warranty Period') {
      //         const newListR = [];
      //         for (const v of final.listR) {
      //           if (v.label == 'Warranty Type') {
      //             newListR.push(v);
      //             newListR.push(item);
      //           } else newListR.push(v);
      //         }

      //         final.listR = newListR;
      //         return final;
      //       }

      //       if (!item.is_mandatory) {
      //         // hiển thị ở section product, "Xem thêm" thì mới hiển thị những trường này
      //         final.listO.push(item);
      //       }
      //     }
      //     return final;
      //   },
      //   { listR: [], listO: [] },
      // );

      // setFinalData(finalData.filter(item => item.name))
      const listR = data.slice(0, 6);
      const listO = data.slice(6);
      let handleListR = [...listR];
      if (
        arrayDataAttributes?.find(v => v.label === 'warranty_type')?.value ===
          'No Warranty' ||
        arrayDataAttributes?.find(v => v.label === 'Warranty Type')?.value ===
          'No Warranty' ||
        attributes.warranty_type === 'No Warranty' ||
        !arrayDataAttributes
      ) {
        handleListR = listR.filter(item => item.name !== 'warranty');
        setListFullRequired(listR);
      }
      setListRequired(handleListR);
      setListOptions(listO);
    } else {
      setListRequired([]);
      setListOptions([]);
    }
    setShowOption(false);
  }, [data]);

  const handleShowOption = () => {
    setShowOption(!showOption);
  };

  const renderInput = value => {
    const { input_type, options, attribute_type } = value;
    switch (input_type) {
      case 'text':
      case 'richText':
      case 'numeric':
        return <Input />;
      case 'enumInput':
      case 'singleSelect':
      case 'multiSelect':
      case 'multiEnumInput':
        let handleOption = options;

        // if (name === 'color_family') {
        //   handleOption = warranties;
        // }
        const isSingle =
          input_type === 'singleSelect' ||
          (input_type === 'enumInput' && attribute_type !== 'sku');
        return (
          <Select
            mode={isSingle ? '' : 'multiple'}
            // defaultValue={text}
            // value={newStatus?.id === detail?.id ? newStatus?.name : text}
            // style={{ width: 120 }}
            // onSelect={handleShowConfirm(record)}
            // filterOption={(input, option) =>
            //   option.props.children
            //     .toLowerCase()
            //     .indexOf(input.toLowerCase()) >= 0
            // }
          >
            {handleOption?.map(v => (
              <Select.Option key={v.name} value={v.name}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        );

      default:
        break;
    }
  };

  return (
    <div>
      <CustomSectionAttribute mt={{ xs: 's4' }}>
        <div className="title">Các thuộc tính thêm theo danh mục đã chọn</div>
        <div className="">
          <Row gutter={24}>
            {listRequired?.map(item => (
              <Col xs={24} lg={12} key={item.name}>
                <Item
                  name={['attributes', item.name]}
                  label={item.label_vi || item.label}
                  // {...layout}
                  rules={[
                    {
                      required: item.is_mandatory || item.name === 'warranty',
                      message: `Vui lòng nhập ${item.label_vi || item.label}!`,
                    },
                  ]}
                >
                  {renderInput(item)}
                </Item>
              </Col>
            ))}
          </Row>

          {showOption && (
            <Row gutter={24}>
              {listOptions?.map(item => (
                <Col xs={24} lg={12} key={item.name}>
                  <Item
                    name={['attributes', item.name]}
                    label={item.label_vi || item.label}
                    rules={[
                      {
                        required: item.is_mandatory || item.name === 'warranty',
                        message: `Vui lòng nhập ${
                          item.label_vi || item.label
                        }!`,
                      },
                    ]}
                  >
                    {renderInput(item)}
                  </Item>
                </Col>
              ))}
            </Row>
          )}
          {isEmpty(listOptions) || (
            <Row>
              <Col>
                <Button
                  className="btn-sm"
                  color="green"
                  mb={{ xs: 's5' }}
                  onClick={handleShowOption}
                >
                  {showOption ? 'Thu gọn' : 'Xem thêm'}
                </Button>
              </Col>
            </Row>
          )}
        </div>
      </CustomSectionAttribute>
    </div>
  );
}

const CustomSectionAttribute = styled(CustomSectionWrapper)`
  background: transparent;
  margin-top: -20px;
  border-top: none;
  border-radius: 0px 0px 3px 3px;
  /* background: #f4f6fd; */
`;

export default React.memo(Attributes);
