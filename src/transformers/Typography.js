const _ = require('lodash')

module.exports = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source);
    root
        .find(j.JSXOpeningElement, { name: { name: 'Paragraph' }})
        .forEach(pathRoot => {
            pathRoot.name.name = 'Typography.Paragraph'
        })
        .find(j.JSXAttribute)
        .forEach((pathRoot) => {
            const attr = pathRoot.node.name
            const attrVal = pathRoot.node.value

            if (attr.name === 'type') {
                j(pathRoot).remove()
                if (attrVal.value === 'short' || (attrVal.expression || {}).value === 'short') {
                    pathRoot.insertAfter(
                        j.jsxAttribute(
                            j.jsxIdentifier('ellipsis'),
                            j.jsxExpressionContainer(
                                j.objectExpression(
                                    [
                                        j.objectProperty(
                                            j.jsxIdentifier('rows'),
                                            j.numericLiteral(2)
                                        ),
                                        j.objectProperty(
                                            j.jsxIdentifier('expandable'),
                                            j.booleanLiteral(true)
                                        ),
                                        j.objectProperty(
                                            j.jsxIdentifier('expandable'),
                                            j.jsxIdentifier('查看更多')
                                        )
                                    ]
                                )

                            )
                        )
                    )
                }
            }
        });
    root
        .find(j.JSXClosingElement, { name: { name: 'Paragraph' }})
        .forEach(pathRoot => {
            pathRoot.name.name = 'Typography.Paragraph'
        })
    return root.toSource()
}
