import axios from 'axios';

class HTTP {
  constructor() {
    this.baseURL = process.env.NODE_ENV !== 'production' ? 'http://localhost:7001' : '/'
    this.timeout = 3000;
    this.queue = {}
  }
  setInterceptor (instance, url) {
    instance.interceptors.request.use((config) =>{
      // 开启loading，自己找地方显示
      if (Object.keys(this.queue).length === 0) {
        // 开loading
      }
    })
  }
}