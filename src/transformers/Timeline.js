const _ = require('lodash')

module.exports = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source)
    const stateKey = {
        'done': 'gray',
        'process': 'blue',
        'error': 'red',
        'success': 'green',
    }

    root
        .find(j.JSXOpeningElement, { name: { name: 'Timeline' } })
        .find(j.JSXAttribute)
        .forEach((pathRoot) => {
            const attr = pathRoot.node.name
            const attrVal = ((pathRoot.node.value || {}).expression || {}).value ? pathRoot.node.value.expression : pathRoot.node.value

            if (attr.name === 'timeLeft') {
                attr.name = 'label'
            }
            if (attr.name === 'state') {
                if (stateKey[attrVal.value]) {
                    attr.name = 'color'
                    attrVal.value = stateKey[attrVal.value]
                }

            }
        })
    return root.toSource()
}
