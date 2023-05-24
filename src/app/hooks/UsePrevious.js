import { useEffect, useRef } from 'react';
import { isEmpty } from 'lodash';

export default function usePrevious(value) {
  const ref = useRef();
  const preValue = ref.current;
  useEffect(() => {
    // if (ref.current.id !== value.id) {
    //   ref.current = preValue;
    // } else {
    //   ref.current = value;
    // }
    ref.current = value;
  });
  // console.log(`ref`, ref.current, value);

  // let current
  // if (isEmpty(ref.current) || ref.current.id !== value.id) {
  //   return ref.current;
  // } else {
  //   return preValue;
  // }
  return preValue;
}
