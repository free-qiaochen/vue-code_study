import axios from 'axios';

class HTTP {
  constructor() {
    this.baseURL = process.env.NODE_ENV !== 'production' ? 'http://localhost:7001' : '/'
    this.timeout = 3000;
    this.queue = {}
  }
  setInterceptor (instance, url) {

  }
}