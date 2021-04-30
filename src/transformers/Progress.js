const _ = require('lodash')

module.exports = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source)
    root
        .find(j.JSXOpeningElement, { name: { name: 'Progress'  } })
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

            if (attr.name === 'shape') {
                attr.name = 'type'
            }
            if (attr.name === 'state') {
                attr.name = 'status'
                if (attrVal.value === 'error') {
                    attrVal.value = 'exception'
                }
                if ((attrVal.expression || {}).value === 'error') {
                    attrVal.expression.value = 'exception'
                }
            }

        });
    return root.toSource()
}
