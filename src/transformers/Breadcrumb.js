const _ = require('lodash')

module.exports = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source);
    root
        .find(j.JSXOpeningElement, { name: { name: 'Breadcrumb' } })
        .forEach(path => {
            const bool = path.node.attributes
                .some(path => path.name.name === 'separator')
            if (!bool) {
                path.node.attributes.push(
                    j.jsxAttribute(
                        j.jsxIdentifier('separator'),
                        j.literal(">")
                    )
                )
            }
        })
    root
        .find(j.JSXOpeningElement, { name: { object: {name: 'Breadcrumb' }, property: { name: 'Item' } } })
        .find(j.JSXAttribute)
        .forEach((path) => {
            const attr = path.node.name
            const attrVal = ((path.node.value || {}).expression || {}).value ? path.node.value.expression : path.node.value
            if (attr.name === 'link') {
                attr.name = 'href'
            }
        });


    return root.toSource()
}
