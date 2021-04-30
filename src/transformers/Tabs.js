const { shapes } = require('./components/dic')

module.exports = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source)
    root
        .find(j.JSXOpeningElement, { name: { name: 'Tab' } })
        .forEach(j.JSXOpeningElement, { name: { name: 'Tabs' } })
        .find(j.JSXAttribute)
        .forEach(pathRoot => {
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
            if (attr.name === 'shape') {
                attr.name = 'type'
                if (attrVal.value && shapes[attrVal.value]) {
                    attrVal.value = shapes[attrVal.value]
                }
                if ((attrVal.expression || {}).value && shapes[(attrVal.expression || {}).value]) {
                    attrVal.expression.value = shapes[(attrVal.expression || {}).value]
                }
            }
            if (attr.name === 'navStyle') {
                attr.name = 'tabBarStyle'
            }
            if (attr.name === 'animation') {
                attr.name = 'animated'
            }
            if (attr.name === 'onClick') {
                attr.name = 'onTabClick'
            }
            if (attr.name === 'onCloce') {
                attr.name = 'onEdit'
            }
        })
    root
        .find(j.JSXOpeningElement, { name: { object: { name: 'Tab' }, property: { name: 'Item' } } })
        .forEach(pathRoot => {
            pathRoot.node.name.object.name = 'Tabs'
            pathRoot.node.name.property.name = 'TabPane'
        })
        .find(j.JSXAttribute)
        .forEach(pathRoot => {
            const attr = pathRoot.node.name
            const attrVal = pathRoot.node.value

            if (attr.name === 'title') {
                attr.name = 'tab'
            }

        })
    return root.toSource()
}
