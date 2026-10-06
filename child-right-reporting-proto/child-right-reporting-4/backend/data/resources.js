// In-memory resource store. Resets on restart.
const resources = [
  { id: 1, type: 'helpline', title: 'Childline India', description: 'Free, 24-hour emergency helpline for children in need of care and protection.', contact: '1098', link: 'https://www.childlineindia.org.in' },
  { id: 2, type: 'helpline', title: 'Police Emergency', description: 'Call if a child is in immediate danger.', contact: '112', link: '' },
  { id: 3, type: 'helpline', title: 'Women & Child Helpline', description: 'Support for women and children facing abuse or violence.', contact: '181', link: '' },
  { id: 4, type: 'legal', title: 'POCSO Act, 2012', description: 'Protection of Children from Sexual Offences Act. Reporting a suspected offence is a legal duty.', contact: '', link: 'https://www.indiacode.nic.in' },
  { id: 5, type: 'legal', title: 'Right to Education Act', description: 'Free and compulsory education for children aged 6 to 14.', contact: '', link: 'https://www.education.gov.in' },
  { id: 6, type: 'guide', title: 'Talking to a child who has been hurt', description: 'Listen calmly, do not ask leading questions, and do not promise to keep it secret.', contact: '', link: '' },
];

let nextId = 7;
const nextResourceId = () => nextId++;

module.exports = { resources, nextResourceId };
