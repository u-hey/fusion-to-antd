
module.exports = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source);
    root
        .find(j.JSXOpeningElement, { name: { name: 'Step' } })
        .forEach(path => { path.node.name.name = 'Steps' })
        .find(j.JSXAttribute)
        .forEach((path) => {
            const attr = path.node.name
            const attrVal = ((path.node.value || {}).expression || {}).value ? path.node.value.expression : path.node.value

            if (attr.name === "shape") {
                attr.name = 'type'
                if (attrVal.value === 'arrow') {
                    attrVal.value = 'navigation'
                }
                if (attrVal.value === 'dot') {
                    attrVal.value = 'default'
                    path.insertAfter(j.jsxAttribute(j.jsxIdentifier('progressDot')))
                }

            }
            if ( attr.name === 'direction' || attr.name === 'labelPlacement' ) {
                if (attrVal.value === 'hoz') {
                    attrVal.value = 'horizontal'
                }
                if (attrVal.value === 'ver') {
                    attrVal.value = 'vertical'
                }
            }

        });
    root
        .find(j.JSXClosingElement, { name: { name: 'Step' } })
        .forEach(path => { path.node.name.name = 'Steps' })
    // step.item
    root
        .find(j.JSXOpeningElement, { name: { object: { name: 'Step' }, property: { name: 'Item' } } })
        .forEach(path => {
            path.node.name.object.name = 'Steps'
            path.node.name.property.name = 'Step'
        })
        .find(j.JSXAttribute)
        .forEach((path) => {
            const attr = path.node.name
            const attrVal = ((path.node.value || {}).expression || {}).value ? path.node.value.expression : path.node.value
            const parentElePath = j(path).closest(j.JSXElement, { openingElement: { name: { name: 'Steps' } } }).__paths[0]


            if (attr.name === 'content') {
                attr.name = 'description'
            }
            if (attr.name === 'percent') {
                const parentOpenEle = parentElePath.node.openingElement
                parentOpenEle.attributes.push(path.node)
                j(path).remove()
            }

        })
    root
        .find(j.JSXClosingElement, { name: { object: { name: 'Step' }, property: { name: 'Item' } } })
        .forEach(path => {
            path.node.name.object.name = 'Steps'
            path.node.name.property.name = 'Step'
        })
    return root.toSource();
}
