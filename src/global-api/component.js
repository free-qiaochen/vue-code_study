export default function initAssetRegisters (Vue) {
  Vue.component = function (id, definition) {
    definition.name = definition.name || id;
    definition = this.options._base.extend(definition);
    this.options['components'][id] = definition;
  }
}