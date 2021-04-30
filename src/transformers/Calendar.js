const _ = require('lodash')

module.exports = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source);
    root
        .find(j.JSXOpeningElement, { name: { name: 'Calendar' } })
        .find(j.JSXAttribute)
        .forEach(pathRoot => {
            const attr = pathRoot.node.name
            const attrVal = ((pathRoot.node.value || {}).expression || {}).value ? pathRoot.node.value.expression : pathRoot.node.value


            if (attr.name === 'shape') {
                if (attrVal.value === 'card') {
                    pathRoot.insertAfter(
                        j.jsxAttribute(
                            j.jsxIdentifier('fullscreen'),
                            j.jsxExpressionContainer(j.booleanLiteral(false))
                        ))
                }
            }
            if (attr.name === 'onModeChange') {
                attr.name = 'onPanelChange'
            }
        })
    return root.toSource()
}
