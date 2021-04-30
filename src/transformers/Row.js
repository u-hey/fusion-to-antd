const _ = require('lodash')

module.exports = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source)
    root
        .find(j.JSXOpeningElement, { name: { name: 'Box' } })
        .forEach(path => {
            path.node.name.name = 'Row'
        })
        .find(j.JSXAttribute)
        .forEach(pathRoot => {
            const attr = pathRoot.node.name
            const attrVal = ((pathRoot.node.value || {}).expression || {}).value ? pathRoot.node.value.expression : pathRoot.node.value

            if (attr.name === 'spacing') {
                attr.name = 'gutter'
            }
            if (attr.name === 'justify') {
                if (attrVal.value === 'flex-start') {
                    attrVal.value = 'start'
                }
                if (attrVal.value === 'flex-end') {
                    attrVal.value = 'end'
                }
            }
            if (attr.name === 'align') {
                if (attrVal.value === 'center') {
                    attrVal.value = 'middle'
                }
                if (attrVal.value === 'flex-end') {
                    attrVal.value = 'bottom'
                }
            }
        })

    root
        .find(j.JSXClosingElement, { name: { name: 'Box' } })
        .forEach(path => {
            path.node.name.name = 'Row'
        })
    return root.toSource()
}
