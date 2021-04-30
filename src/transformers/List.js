const _ = require('lodash')
module.exports = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source);
    root
        .find(j.JSXOpeningElement)
        .filter(path => path.node.name.name === 'List')
        .forEach(pathRoot => {
            j(pathRoot)
                .find(j.JSXAttribute)
                .filter(path => path.node.name.name === 'size')
                .forEach(path => {
                    const value = path.node.value.value
                    const expValue = path.node.value.expression && path.node.value.expression.value
                    if(value === 'medium') {
                        path.node.value.value = 'default'
                    }
                    if(expValue === 'medium') {
                        path.node.value.expression.value = 'default'
                    }
                })
        })
    root
        .find(j.JSXOpeningElement)
        .filter(path => ((path.node.name.object|| {}).name) === 'List')
        .forEach((pathRoot) => {
            j(pathRoot)
                .filter(path => path.node.name.type === 'JSXMemberExpression')
                .forEach(path => {
                    path.node.name.property.name = 'Item.Meta'
                    j(path)
                        .find(j.JSXAttribute)
                        .filter(path => path.node.name.name === 'media')
                        .forEach(path => {
                            path.node.name.name = 'avatar'
                        })
                })

        });
    root
        .find(j.JSXClosingElement)
        .filter(path => (path.node.name.object || {}).name === "List")
        .forEach((path) => {
            path.node.name.property.name = 'Item.Meta'
        });
    root
        .find(j.JSXElement)
        .filter(path => ((path.node.openingElement.name.property|| {}).name) === 'Item.Meta')
        .forEach(path => {
            let attrs = []
            j(path)
                .find(j.JSXOpeningElement)
                .find(j.JSXAttribute)
                .filter(path => path.node.name.name === 'extra')
                .forEach(path => {
                    attrs = [path.node]
                })
            attrs.push(j.jsxAttribute(
                j.jsxIdentifier("description"),
                j.jsxExpressionContainer(j.jsxText('""'))
            ))
            const element = j.jsxElement(
                j.jsxOpeningElement(j.jsxIdentifier('List.Item'), attrs),
                j.jsxClosingElement(j.jsxIdentifier('List.Item')),
                [j.jsxText("\n\t"), path.node, j.jsxText("\n\t")]
            )
            j(path).replaceWith(element)
        })
    return root.toSource();
}
