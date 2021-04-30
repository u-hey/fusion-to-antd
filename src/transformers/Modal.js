const _ = require('lodash')

module.exports = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source)
    root
        .find(j.JSXOpeningElement, { name: { name: 'Dialog' } })
        .forEach((pathRoot) => {
            pathRoot.node.name.name = 'Modal'
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
            if (attr.name === 'hasMask') {
                attr.name = 'mask'
            }
            if (attr.name === 'closeable') {
                attr.name = 'closable'
                pathRoot.insertAfter(j.jsxAttribute(j.jsxIdentifier('closable'), j.jsxExpressionContainer(j.booleanLiteral(false))))
                pathRoot.insertAfter(j.jsxAttribute(j.jsxIdentifier('maskClosable'), j.jsxExpressionContainer(j.booleanLiteral(false))))
            }
        });
    root
        .find(j.JSXClosingElement, { name: { name: 'Dialog' } })
        .forEach((pathRoot) => {
            pathRoot.node.name.name = 'Modal'
        })
    // ExpressionStatement
    root
        .find(j.ExpressionStatement, { expression: { callee: { object: { name: 'Dialog' } } } })
        .forEach((pathRoot) => {
            pathRoot.node.expression.callee.object.name = 'Modal'
        });
    root
        .find(j.ExpressionStatement, { expression: { callee: { object: { name: 'Modal' }, property: { type: 'Identifier' } } } })
        .forEach((pathRoot) => {
            let property = pathRoot.node.expression.callee.property
            if (property.name === 'alert') {
                property.name = 'info'
            }
        });

    return root.toSource()
}
