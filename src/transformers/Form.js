module.exports = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source)
    root
        .find(j.JSXOpeningElement, { name: { name: "Form" } })
        .find(j.JSXAttribute)
        .forEach(pathRoot => {
            const attr = pathRoot.node.name
            const attrVal = ((pathRoot.node.value || {}).expression || {}).value ? pathRoot.node.value.expression : pathRoot.node.value

            if (attr.name === 'inline') {
                j(pathRoot).replaceWith(j.jsxAttribute(
                    j.jsxIdentifier('layout="inline"')
                ))
            }

            if (attr.name === 'size') {
                if(attrVal.value === 'medium') {
                    attrVal.value = 'middle'
                }
            }
            if (attr.name === 'labelTextAlign') {
                attr.name = 'labelAlign'
            }
            if (attr.name === 'field') {
                j(pathRoot).replaceWith(j.jsxAttribute(
                    j.jsxIdentifier('ref={formRef}')
                ))
                root
                    .find(j.Program)
                    .find(j.ImportDeclaration, { source: { value: 'react' } })
                    .forEach(path => {
                        const formRef = j('const formRef = React.createRef();').nodes()[0].program.body[0]
                        path.insertAfter(formRef)
                    })
            }

            if (attr.name === 'onChange') {
                attr.name = 'onValuesChange'
            }

            if (attr.name === 'onSubmit') {
                attr.name = 'onFinish'
            }
        })
    root
        .find(j.JSXOpeningElement, { name: { object: { name: 'Form' }, property: { name: 'Item' } } })
        .find(j.JSXAttribute)
        .forEach(pathRoot => {
            const attr = pathRoot.node.name
            const attrVal = ((pathRoot.node.value || {}).expression || {}).value ? pathRoot.node.value.expression : pathRoot.node.value


            if (attr.name === 'validateState') {
                attr.name = 'validateStatus'
            }
            if (attr.name === 'labelTextAlign') {
                attr.name = 'labelAlign'
            }
        })
    root
        .find(j.JSXOpeningElement, { name: { object: { name: 'Form' }, property: { name: 'Error' } } })
        .forEach(path => { path.node.name.property.name = 'ErrorList' })
        .find(j.JSXClosingElement, { name: { object: { name: 'Form' }, property: { name: 'Error' } } })
        .forEach(path => { path.node.name.property.name = 'ErrorList' })
    return root.toSource()
}
