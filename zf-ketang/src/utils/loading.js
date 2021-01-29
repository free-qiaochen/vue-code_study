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

export default loadable