const { getStringEle } = require('./components/utils')

module.exports = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source)
    root
        .find(j.JSXOpeningElement, { name: { name: 'Card' } })
        .find(j.JSXAttribute)
        .forEach(pathRoot => {
            const attr = pathRoot.node.name
            const attrVal = ((pathRoot.node.value || {}).expression || {}).value ? pathRoot.node.value.expression : pathRoot.node.value

            if (attr.name === 'subTitle') {
                attr.name = 'description'
            }
            if (attr.name === 'media') {
                attr.name = 'cover'
            }
            if (attr.name === 'actions') {
                // 判断必须为对象值
                if (pathRoot.node.value.expression) {
                    const childrenEleStr = getStringEle(j(attrVal).toSource())
                    j(pathRoot).replaceWith(j.jsxIdentifier(
                        `actions={[${childrenEleStr.replace(/<><\/>/g, ',')}]}`
                    ))
                }

            }
        })
    // Card.Media
    root
        .find(j.JSXOpeningElement, { name: { object: { name: 'Card' }, property: { name: 'Media' } } })
        .forEach(pathRoot => {
            let children = pathRoot.parentPath.value.children
            const childrenEleStr = getStringEle(j(children).toSource())
            let parentEle = j(pathRoot).closest(j.JSXElement, { openingElement: { name: { name: 'Card' } } })
            let parentOpenEle = parentEle.__paths[0].node.openingElement

            parentOpenEle.attributes.push(
                j.jsxAttribute(
                    j.jsxIdentifier(`cover={<>${childrenEleStr}</>}`)
                )
            )
            j(pathRoot.parentPath).remove()
        });
    // Card.Header
    root
        .find(j.JSXOpeningElement, { name: { object: { name: 'Card' }, property: { name: 'Header' } } })
        .forEach((pathRoot) => {
            pathRoot.node.name.property.name = 'Meta'
            let attributes = pathRoot.node.attributes
            let parentEle = j(pathRoot).closest(j.JSXElement, { openingElement: { name: { name: 'Card' } } })
            let parentOpenEle = parentEle.__paths[0].node.openingElement

            attributes.forEach((item, i) => {
                const attr = item.name
                if (attr.name === 'subTitle') {
                    attr.name = 'description'
                }
                if (attr.name === 'extra') {
                    parentOpenEle.attributes.push(item)
                    delete attributes[i]
                }
            })
        })
        .find(j.JSXClosingElement, { name: { object: { name: 'Card' }, property: { name: 'Header' } } })
        .forEach((pathRoot) => {
            pathRoot.node.name.property.name = 'Meta'
        });
    root
        .find(j.JSXElement, { openingElement: { name: { object: { name: 'Card' }, property: { name: 'Actions' } }} })
        .forEach((pathRoot) => {
            let children = pathRoot.node.children
            let childrenEleStr = getStringEle(j(children).toSource())
            let parentEle = j(pathRoot).closest(j.JSXElement, { openingElement: { name: { name: 'Card' } } })
            let parentOpenEle = parentEle.__paths[0].node.openingElement

            parentOpenEle.attributes.push(
                j.jsxAttribute(
                    j.jsxIdentifier(`actions={[${childrenEleStr.replace(/<><\/>/g, ',')}]}`)
                )
            )
            j(pathRoot).remove()
        });
    // Card.Content
    root
        .find(j.JSXOpeningElement, { name: { object: { name: 'Card' }, property: { name: 'Content' } } })
        .forEach(pathRoot => {
            pathRoot.node.name = 'div'
        })
    root
        .find(j.JSXClosingElement, { name: { object: { name: 'Card' }, property: { name: 'Content' } } })
        .forEach(pathRoot => {
            pathRoot.node.name = 'div'
        })
    return root.toSource()
}
