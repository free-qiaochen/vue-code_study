# zf-ketang

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## 记录

### 选择

```sh
 (*) Choose Vue version
 (*) Babel
 ( ) TypeScript
 (*) Progressive Web App (PWA) Support
 (*) Router
 (*) Vuex
 (*) CSS Pre-processors
 css 预编译语言选择 scss(dart-sass)
```

> dart-sass 性能更好,后续 sass 新的特性会优先支持，也解决了 node-sass 不稳定问题

### 安装依赖

```sh
# scss变量，暴露到全局,(增加全局scss变量)
vue add style-resources-loader
# rem布局
 cnpm i postcss-plugin-px2rem lib-flexible -S
 #
 cnpm i vant axios -S
```
