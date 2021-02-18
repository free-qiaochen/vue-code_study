import axios from '@/http/index';

// ?
export const toLogin = (data) => axios.post('/api/login', data);
// ??
export const validate = () => axios.get('/api/validate');