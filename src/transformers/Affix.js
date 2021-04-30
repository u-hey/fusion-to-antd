const _ = require('lodash')

module.exports = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source);
    root
        .find(j.JSXOpeningElement, { name: { name: 'Affix' } })
        .forEach((pathRoot) => {
            if (pathRoot.node.name.name === "Affix") {
                const attrsNameList = _.get(pathRoot, 'node.attributes', []).map(node => {
                return node.name.name
            })
                if (!attrsNameList.includes('offsetTop') && !attrsNameList.includes('offsetBottom')) {
                const node = j.jsxAttribute(j.jsxIdentifier("offsetTop"), j.jsxExpressionContainer(j.numericLiteral(0)))
                pathRoot.node.attributes.push(node)
            }
            }
        })
        .find(j.JSXAttribute)
        .forEach((path) => {
            const attr = path.node.name
            const attrVal = ((path.node.value || {}).expression || {}).value ? path.node.value.expression : path.node.value
            if (attr.name === "container") {
                attr.name = "target"
            }

            if (attr.name === "onAffix") {
                attr.name = "onChange"
            }

        });

    return root.toSource();
}
