const _ = require('lodash')

module.exports = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source)
    root
        .find(j.JSXOpeningElement, { name: { object: { name: 'Checkbox' }, property: { name: 'Group' } } })
        .find(j.JSXAttribute)
        .forEach((pathRoot) => {
            const attr = pathRoot.node.name
            const attrVal = ((pathRoot.node.value || {}).expression || {}).value ? pathRoot.node.value.expression : pathRoot.node.value

            if (attr.name === 'dataSource') {
                attr.name = 'options'
            }
            if (attr.name === 'value') {
                attr.name = 'defaultValue'
            }
            if (attr.itemDirection === 'itemDirection' ) {

            }

        });
    return root.toSource()
}
