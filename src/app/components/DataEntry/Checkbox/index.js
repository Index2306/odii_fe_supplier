import styled from 'styled-components/macro';
import { Checkbox as C } from 'antd';
import { withFormContext } from '../Form/withFormContext';

const Checkbox = withFormContext(styled(C)``);
Object.keys(C).map(key => (Checkbox[key] = C[key]));
export default Checkbox;
