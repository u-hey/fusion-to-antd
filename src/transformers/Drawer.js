const _ = require('lodash')

module.exports = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source);
    root
        .find(j.JSXOpeningElement, { name: { name: 'Drawer' }})
        .find(j.JSXAttribute)
        .forEach((pathRoot) => {
            const attr = pathRoot.node.name
            const attrVal = ((pathRoot.node.value || {}).expression || {}).value ? pathRoot.node.value.expression : pathRoot.node.value
            if (attr.name === 'hasMask') {
                attr.name = 'mask'
            }
            if (attr.name === 'closeable') {
                if (attrVal.value === false) {
                    pathRoot.insertAfter(
                        j.jsxAttribute(
                            j.jsxIdentifier('maskClosable'),
                            j.jsxExpressionContainer(j.booleanLiteral(false))
                        )
                    )
                    pathRoot.insertAfter(
                        j.jsxAttribute(
                            j.jsxIdentifier('closable'),
                            j.jsxExpressionContainer(j.booleanLiteral(false))
                        )
                    )

                    pathRoot.insertAfter(
                        j.jsxAttribute(
                            j.jsxIdentifier('keyboard'),
                            j.jsxExpressionContainer(j.booleanLiteral(false))
                        )
                    )
                    j(pathRoot).remove()

                }
            }

        });
    return root.toSource()
}
