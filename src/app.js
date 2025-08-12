
import component1 from './libs/components/inputs/Input.js';
import component2 from './libs/components/forms/BasicForm.js';

document.querySelector('.fluig-style-guide').innerHTML = `
  ${component1()}
  ${component2()}
`;

