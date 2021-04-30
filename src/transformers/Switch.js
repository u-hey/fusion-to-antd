const _ = require('lodash')

module.exports = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source)
    root
        .find(j.JSXOpeningElement, { name: { name: 'Switch'  } })
        .find(j.JSXAttribute)
        .forEach((pathRoot) => {
            const attr = pathRoot.node.name
            const attrVal = pathRoot.node.value

            if (attr.name === 'size') {
                if (attrVal.value === 'medium') {
                    attrVal.value = 'default'
                }
                if ((attrVal.expression || {}).value === 'medium') {
                    attrVal.expression.value = 'default'
                }
            }

            if (attr.name === 'readAs') {
                attr.name = 'tooltips'
            }
        });
    return root.toSource()
}
