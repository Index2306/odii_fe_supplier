import React, { useState, useEffect, useRef, memo } from 'react';
import { Modal, Spin } from 'antd';
import { useReactToPrint } from 'react-to-print';
import PDFMerger from 'pdf-merger-js/browser';
import request from 'utils/request';
import styled from 'styled-components/macro';
import PrintPreview from '../Update/PrintPreview';
import { downloadFile } from 'utils/request';

export default memo(function PrintProgress({
  selectedOrders,
  onFinish,
  ...rest
}) {
  const [isProgressing, setProgressing] = useState(false);
  const [printData, setPrintData] = useState([]);
  const [executedNum, setExecutedNum] = useState(0);
  const printRef = useRef(null);
  const totalNum = selectedOrders?.metadata?.print_count;

  useEffect(() => {
    handleProgress();
  }, []);

  const handlePrint = useReactToPrint({
    removeAfterPrint: true,
    content: () => printRef.current,
    onAfterPrint: () => {
      setPrintData([]);
    },
  });

  // const updateShippingProvider = async order => {
  //   const orderId = parseInt(order.id);
  //   try {
  //     await request(`oms/supplier/orders/${orderId}/set-pack`, {
  //       method: 'put',
  //       data: { shipping_provider: 'B2B' },
  //     });
  //     return true;
  //   } catch {
  //     return false;
  //   }
  // };

  const handleProgress = async () => {
    setProgressing(true);
    const printData = [];
    const { items } = selectedOrders;
    let successNumber = 0;
    let executedNumber = 0;
    const pdfPages = [];
    const fetchPrintContentTiktok = async order => {
      try {
        let documentType = 1;
        if (order?.shop_status === '111') documentType = 2;
        const blob = await downloadFile(
          `oms/supplier/orders/${order.id}/${documentType}/print-tiktok-order-pdf`,
          'get',
          {},
          {},
          { responseType: 'arraybuffer' },
          { type: 'application/pdf' },
        );
        if (!blob) {
          return null;
        }
        return blob;
      } catch (error) {
        console.log('fetchPrintContentTiktok', error);
        return null;
      }
    };
    const fetchPrintContent = async order => {
      try {
        const orderId = parseInt(order.id);
        const response = await request(
          `oms/supplier/orders/${orderId}/get-shipping-label`,
          {
            method: 'get',
          },
        );
        return response.data.file;
      } catch {
        return null;
      }
    };

    const printShipingLabelShopee = async orders => {
      try {
        const blob = await downloadFile(
          `oms/supplier/orders/${orders.id}/download-shipping-document`,
          'get',
          {},
          {},
          { responseType: 'arraybuffer' },
          { type: 'application/pdf' },
        );
        if (!blob) {
          return null;
        }
        return blob;
        // var URL = window.URL || window.webkitURL;
        // var dataUrl = URL.createObjectURL(blob);
        // window.open(dataUrl, '_blank');
      } catch (error) {
        console.log(error);
      }
    };

    const fetchPrintGHTKContent = async orders => {
      try {
        const response = await request(
          `oms/supplier/orders/${orders.id}/print-ghtk-label-pdf`,
          {
            method: 'get',
          },
        );
        let byteCharacters = atob(response.data);
        let byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        return byteArray;
      } catch (error) {
        console.log('fetchPrintGHTKContent error', error);
      }
    };

    // const shopeePromises = [];
    let orderPlatform = '';

    for (let order of items) {
      console.log('order print', order);
      if (!order?.actions.print && !order?.actions.print_pack_list) {
        continue;
      }
      orderPlatform = order?.platform;
      let isSuccess = true;
      // if (order.isEnableUpdatePacking) {
      //   isSuccess &= await updateShippingProvider(order);
      // }
      if (isSuccess) {
        if (order.platform === 'lazada') {
          const printDataItem = await fetchPrintContent(order);
          if (printDataItem) {
            successNumber++;
            printData.push(printDataItem);
          }
        } else if (order.platform === 'tiktok') {
          const pdfBuffer = await fetchPrintContentTiktok(order);
          console.log('add pdf buffer', pdfBuffer);
          if (pdfBuffer) {
            pdfPages.push(pdfBuffer);
            successNumber++;
          }
        } else if (order.platform === 'shopee') {
          const pdfBuffer = await printShipingLabelShopee(order);
          console.log('add pdf buffer', pdfBuffer);
          if (pdfBuffer) {
            pdfPages.push(pdfBuffer);
            successNumber++;
          }
          // shopeePromises.push(printShipingLabelShopee(order.id));
          // successNumber++;
        } else {
          const pdfBuffer = await fetchPrintGHTKContent(order);
          console.log('add pdf buffer', pdfBuffer);
          if (pdfBuffer) {
            pdfPages.push(pdfBuffer);
            successNumber++;
          }
        }
      }
      executedNumber++;
      setExecutedNum(executedNumber);
    }

    // Promise.all(shopeePromises);
    setTimeout(async () => {
      setProgressing(false);
      if (successNumber) {
        if (orderPlatform === 'lazada') {
          setPrintData(printData);
          handlePrint();
        } else if (
          (orderPlatform === 'tiktok' || orderPlatform === 'shopee') &&
          pdfPages.length > 0
        ) {
          const merger = new PDFMerger();
          for (const file of pdfPages) {
            await merger.add(file);
          }
          const mergedPdf = await merger.saveAsBlob();
          var URL = window.URL || window.webkitURL;
          const url = URL.createObjectURL(mergedPdf);
          console.log('merger url', url);
          window.open(url, '_blank');
        } else if (!orderPlatform) {
          const merger = new PDFMerger();
          for (const file of pdfPages) {
            let filepdf = new Blob([file], { type: 'application/pdf;base64' });
            await merger.add(filepdf);
          }
          const mergedPdf = await merger.saveAsBlob();
          var URL = window.URL || window.webkitURL;
          const url = URL.createObjectURL(mergedPdf);
          console.log('merger url', url);
          window.open(url, '_blank');
        }
      }
      onFinish();
    }, 250);
  };

  return (
    <>
      {isProgressing && (
        <PrintProgressModal
          width={270}
          closable={false}
          className="box-df"
          centered={true}
          title={null}
          footer={null}
          {...rest}
        >
          <div className="print-progress-content">
            <div>
              <Spin />
            </div>
            <span>
              <i className="loading-icon far fa-spinner-third fa-spin"></i>
              <span className="progress-title">Đang xử lý đơn hàng:</span>
            </span>
            <span>
              {executedNum} / {totalNum}
            </span>
          </div>
        </PrintProgressModal>
      )}
      <PrintPreview ref={printRef} data={printData}></PrintPreview>
    </>
  );
});

export const PrintProgressModal = styled(Modal)`
  .print-progress-content {
    display: flex;
    justify-content: space-between;
    .progress-title {
      margin-left: 10px;
    }
    .loading-icon {
      color: ${({ theme }) => theme.primary};
    }
  }
`;
