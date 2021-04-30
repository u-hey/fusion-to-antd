
module.exports = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source)
    root
        .find(j.JSXOpeningElement, { name: { name: 'Collapse' }})
        .find(j.JSXAttribute)
        .forEach((pathRoot) => {
            const attr = pathRoot.node.name
            const attrVal = ((pathRoot.node.value || {}).expression || {}).value ? pathRoot.node.value.expression : pathRoot.node.value

            if (attr.name === 'defaultExpandedKeys') {
                attr.name = 'defaultActiveKey'
            }
            if (attr.name === 'expandedKeys') {
                attr.name = 'activeKey'
            }
            if (attr.name === 'disabled') {
                if (attrVal.value === true) {
                    pathRoot.insertAfter(
                        j.jsxAttribute(
                            j.jsxIdentifier('collapsible'),
                            j.stringLiteral('disabled')
                        )
                    )
                }
            }

        });
    root
        .find(j.JSXOpeningElement, { name: { object: { name: 'Collapse' }, property: { name: 'Panel' } } })
        .find(j.JSXAttribute)
        .forEach((pathRoot) => {
            const attr = pathRoot.node.name
            const attrVal = ((pathRoot.node.value || {}).expression || {}).value ? pathRoot.node.value.expression : pathRoot.node.value

            if (attr.name === 'defaultExpandedKeys') {
                attr.name = 'defaultActiveKey'
            }
            if (attr.name === 'expandedKeys') {
                attr.name = 'activeKey'
            }
            if (attr.name === 'disabled') {
                if (attrVal.value === true) {
                    pathRoot.insertAfter(
                        j.jsxAttribute(
                            j.jsxIdentifier('collapsible'),
                            j.stringLiteral('disabled')
                        )
                    )
                }
            }

        });
    return root.toSource()
}
