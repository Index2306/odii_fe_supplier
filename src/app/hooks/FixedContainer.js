import React, { memo, useRef, useEffect } from 'react';
import { StyleConstants } from 'styles/StyleConstants';

export default memo(function FixedContainer({
  top = 0,
  children,
  needFixWidth,
  topOffset,
}) {
  const contentRefScroll = useRef();

  useEffect(() => {
    window.addEventListener('scroll', calculatePosition);

    return () => {
      window.removeEventListener('scroll', calculatePosition);
    };
  }, []);

  const calculatePosition = () => {
    //150
    const current = contentRefScroll.current;

    if (!current) return;
    // const container = headingsContainerRef.current;
    // const fixedDivOffsetBottom =
    //   container.offsetTop + container.offsetHeight - 200;
    // const heightBody = document.getElementById('bodyOfTableOfContent')
    //   .offsetHeight;
    if (
      top < window.pageYOffset
      // || container.offsetTop + heightBody > window.pageYOffset
    ) {
      const parent = current.parentElement;
      const width =
        parent.clientWidth -
        parseInt(parent.style.paddingRight) -
        parseInt(parent.style.paddingLeft);
      current.style.cssText = `position:fixed;top:${
        topOffset || StyleConstants.headerHeight
      };width:${needFixWidth ? width : ''}px;`;
      current.classList.add('fix-position');
    } else {
      current.style.cssText = '';
      current.classList.remove('fix-position');
    }
  };
  return <div ref={contentRefScroll}>{children}</div>;
});
