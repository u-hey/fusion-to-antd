const _ = require('lodash')

module.exports = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source);
    root
        .find(j.JSXOpeningElement, { name: { name: 'Divider' } })
        .find(j.JSXAttribute)
        .forEach(pathRoot => {
            const attr = pathRoot.node.name
            const attrVal = ((pathRoot.node.value || {}).expression || {}).value ? pathRoot.node.value.expression : pathRoot.node.value

            if (attr.name === 'direction') {
                attr.name = 'type'
                if (attrVal.value === 'hoz') {
                    attrVal.value = 'horizontal'
                }
                if (attrVal.value === 'ver') {
                    attrVal.value = 'vertical'
                }
            }
            if (attr.name === 'onModeChange') {
                attr.name = 'onPanelChange'
            }
        })
    return root.toSource()
}
