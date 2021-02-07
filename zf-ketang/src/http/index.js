import axios from 'axios';

class HttpRequest {
  constructor() {
    this.baseURL = process.env.NODE_ENV !== 'production' ? 'http://localhost:7001' : '/'
    this.timeout = 3000;
    this.queue = {}
  }
  setInterceptor (instance, url) {
    instance.interceptors.request.use((config) => {
      // 开启loading，自己找地方显示
      if (Object.keys(this.queue).length === 0) {
        // 开loading
      }
      let token = localStorage.getItem('token');
      if (token) {
        config.headers.authorization = token;
      }
      // 可以记录请求的取消函数
      let CancelToken = axios.CancelToken;
      // xhr.abort() 取消请求方法
      config.cancelToken = new CancelToken((c) => {
        // 存到vuex中，页面切换的时候，组件销毁时执行；c就是当前请求取消的token
        store.commit(Types.SET_TOKEN, c);
      })
      this.queue[url] = true;
      return config // 扩展的配置返回
    })
    instance.interceptors.response.use((res) => {
      delete this.queue[url]; // 一旦响应了，就从队列删除
      if (Object.keys(this.queue).length === 0) {
        // close loading
      }
      if (res.data.err == 0) {
        return res.data.data  // 接口里自定义成功状态码
      } else {
        return Promise.reject(res.data);  // 失败排抛出异常
      }

    }, (err) => {
      delete this.queue[url];
      if (Object.keys(this.queue).length == 0) {
        // close loading
      }
      return Promise.reject(err)
    })
  }
  request (options) {  // 通过request方法来进行请求操作，
    // 每次请求可以创建一个新的实例，如果业务不复杂可以不创建实例，直接使用axios
    let instance = axios.create();
    let config = {
      baseURL: this.baseURL,
      timeout: this.timeout,
      ...options,
    }
    this.setInterceptor(instance, config.url)
    return instance(config);  // 产生的是一个promise axios()
  }
  get (url, data = {}) {
    return this.request({
      url,
      method: 'get',
      ...data
    })
  }
  post(url, data = {}) {
    return this.request({
      url,
      method: 'post',
      data
    })
  }
}

// ab 用的是同一个实例
// a axios里面的请求有独立的拦截器
// b axios里面也有拦截器

export default new HttpRequest