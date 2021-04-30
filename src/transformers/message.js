module.exports = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source);
    root
        .find(j.JSXOpeningElement, { name: { name: 'Message' } })
        .forEach(pathRoot => {
            pathRoot.node.name.name = 'Alert'
            pathRoot.node.attributes.push(j.identifier('showIcon'))
        })
        .forEach((pathRoot) => {
            const attr = pathRoot.node.name
            const attrVal = pathRoot.node.value

            if(attr.name === 'title') {
                attr.name = 'message'
            }
            if(attr.name === 'children') {
                attr.name = 'description'
            }
            if(attr.name === 'closeable') {
                attr.name = 'closable'
            }
            if(attr.name === 'type'){
                const value = attrVal.value
                if(value === 'notice' || value === 'help' || value === 'loading') {
                    attrVal.value = 'info'
                }
            }
        })
    root
        .find(j.JSXClosingElement, { name: { name: 'Message' } })
        .forEach((path) => {
            path.node.name.name = 'Alert';
        })

    root
        .find(j.CallExpression, { callee: { object: { name: 'Message' } } })
        .forEach(path => {
            path.node.callee.object.name = 'message'
            const property = path.node.callee.property

            if (property.name === 'notice' || property.name === 'help' || property.name === 'show') {
                property.name = 'info'
            }
            if (path.node.arguments && path.node.arguments.length){
                const argumentsLs = path.node.arguments
                argumentsLs.forEach(path => {
                    if (path.type === 'ObjectExpression') {
                        path.properties.forEach((path, i, properties) => {
                            if (path.key.name === 'type') {
                                const keyVal = path.value.value
                                if (keyVal === 'notice' || keyVal === 'help') {
                                    path.value.value = 'info'
                                } else {
                                    property.name = keyVal
                                }
                            }
                            if (path.key.name === 'duration') {
                                const keyVal = path.value.value
                                if (typeof keyVal === 'number') {
                                    path.value.value = parseInt(path.value.value/1000)
                                }
                            }
                            if (path.key.name === 'title' && !properties.filter(item => item.key.name === 'content').length) {
                                path.key.name = 'content'
                            }
                        })
                    }
                })
            }

        })
    return root.toSource();
}
