const _ = require('lodash')

module.exports = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source)
    root
        .find(j.JSXOpeningElement, { name: { object: { name: 'Radio' }, property: { name: 'Group' } } })
        .find(j.JSXAttribute)
        .forEach((pathRoot) => {
            const attr = pathRoot.node.name
            const attrVal = pathRoot.node.value
            if (attr.name === 'size') {
                if (attrVal.value === 'medium') {
                    attrVal.value = 'middle'
                }
                if ((attrVal.expression || {}).value === 'medium') {
                    attrVal.expression.value = 'middle'
                }
            }

            if (attr.name === 'dataSource') {
                attr.name = 'options'
            }
            if (attr.name === 'value') {
                attr.name = 'defaultValue'
            }

        });
    return root.toSource()
}
