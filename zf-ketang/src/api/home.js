import axios from '@/http/index';

// 设置接口  state -> action-types -> api -> actions -> mutations
export const fecthSlides = () => axios.get('/api/slider');