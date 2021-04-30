const _ = require('lodash')

module.exports = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source)
    root
        .find(j.JSXOpeningElement, { name: { name: 'Select' } })
        .find(j.JSXAttribute)
        .forEach((pathRoot) => {
            const attr = pathRoot.node.name
            const attrVal = pathRoot.node.value

            if (attr.name === 'filterLocal') {
                attr.name = 'filterOption'
            }

            if (attr.name === 'dataSource') {
                attr.name = 'options'
            }

        });

    return root.toSource()
}
