const _ = require('lodash')

module.exports = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source)

    root
        .find(j.JSXOpeningElement, { name: { object: { name: 'Tag' }, property: { name: 'Closeable' } } })
        .forEach(path => {
            path.node.name.name = 'Tag'
            pathRoot.node.attributes.push(j.identifier('closable'))
        })
        .forEach(pathRoot => {
            const attr = pathRoot.node.name
            const attrVal = ((pathRoot.node.value || {}).expression || {}).value ? pathRoot.node.value.expression : pathRoot.node.value

            if (attr.name === 'size') {
                if (attrVal.value === 'medium') {
                    attrVal.value = 'default'
                }
            }
        })
    root
        .find(j.JSXClosingElement, { name: { object: { name: 'Tag' }, property: { name: 'Closeable' } } })
        .forEach(path => {
            path.node.name.name = 'Tag'
        })
    root
        .find(j.JSXOpeningElement, { name: { name: 'Tag' } })
        .find(j.JSXAttribute)
        .forEach((pathRoot) => {
            const attr = pathRoot.node.name
            const attrVal = ((pathRoot.node.value || {}).expression || {}).value ? pathRoot.node.value.expression : pathRoot.node.value

            if (attr.name === 'size') {
                if (attrVal.value === 'medium') {
                    attrVal.value = 'default'
                }
            }
        })
    root
        .find(j.JSXOpeningElement, { name: { object: { name: 'Tag' }, property: { name: 'Selectable' } } })
        .forEach(path => {
            path.node.name.property.name = 'CheckableTag'
        })
    root
        .find(j.JSXClosingElement, { name: { object: { name: 'Tag' }, property: { name: 'Selectable' } } })
        .forEach(path => {
            path.node.name.property.name = 'CheckableTag'
        })
    return root.toSource()
}
