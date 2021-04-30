const _ = require('lodash')

module.exports = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source)

    root
        .find(j.JSXOpeningElement, { name: { name: 'Loading' } })
        .forEach(path => {
            path.node.name.name = 'Spin'
        })
        .find(j.JSXAttribute)
        .forEach((pathRoot) => {
            const attr = pathRoot.node.name
            const attrVal = ((pathRoot.node.value || {}).expression || {}).value ? pathRoot.node.value.expression : pathRoot.node.value

            if (attr.name === 'size') {
                if (attrVal.value === 'medium') {
                    attrVal.value = 'default'
                }
            }
            if (attr.name === 'visible') {
                attr.name = 'spinning'
            }
        });
    root
        .find(j.JSXClosingElement, { name: { name: 'Loading' } })
        .forEach((path) => {
            path.node.name.name = "Spin"
        })
    return root.toSource()
}
