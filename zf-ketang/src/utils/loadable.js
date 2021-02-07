import Loading from '@/components/loading';

const loadable = (asyncFunction) => {
  const component = () => ({
    component: asyncFunction(),
    loading: Loading
  })
  return {
    render (h) {
      return h(component)
    }
  }
}

// 路由切换，异步加载的loading
export default loadable