import styled from 'styled-components/macro';
import { Dropdown as D } from 'antd';
import { withFormContext } from '../Form/withFormContext';

const Dropdown = withFormContext(styled(D)``);
Object.keys(D).map(key => (Dropdown[key] = D[key]));
export default Dropdown;
