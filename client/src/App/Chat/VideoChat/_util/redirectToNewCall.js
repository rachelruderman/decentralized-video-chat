import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

export const redirectToNewCall = () => history.push('/newcall');