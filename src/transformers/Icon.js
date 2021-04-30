const _ = require('lodash')
const { iconMap } = require('./components/dic')

module.exports = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source)
    let iconList = []
    root
        .find(j.JSXOpeningElement, { name: { name: 'Icon' } })
        .find(j.JSXAttribute)
        .forEach((pathRoot) => {
            const openingEleNode = pathRoot.parentPath.parentPath.value
            const closingEleNode = pathRoot.parentPath.parentPath.parentPath.value.closingElement
            const attr = pathRoot.node.name
            const attrVal = ((pathRoot.node.value || {}).expression || {}).value ? pathRoot.node.value.expression : pathRoot.node.value

            if (attr.name === 'type') {
                if (attrVal.value && iconMap[attrVal.value]) {
                    openingEleNode.name.name = iconMap[attrVal.value]
                    if (closingEleNode) {
                        closingEleNode.name.name = iconMap[attrVal.value]
                    }
                    iconList.includes(iconMap[attrVal.value]) ? null : iconList.push(iconMap[attrVal.value])
                }
            }
        });
    root
        .find(j.ImportDeclaration, { source: { value: '@ant-design/icons' } })
        .forEach((path, i, items) => {
            if (i === (items.length-1)) {
                const hasKeys = path.node.specifiers.map(item => item.imported.name)
                const addKey = iconList.filter(val => !hasKeys.includes(val))
                addKey.forEach(key => {
                    path.node.specifiers.push(j.importSpecifier(j.identifier(key)))
                })
            }
        })
    return root.toSource()
}
