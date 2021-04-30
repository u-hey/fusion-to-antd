const _ = require('lodash')
const { placement } = require('./components/dic')

module.exports = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source)
    root
        .find(j.JSXOpeningElement, { name: { object: { name: "Balloon" }, property: { name: "Tooltip" } } })
        .forEach(path => {
            path.node.name = j.jsxIdentifier('Tooltip')
        })
    root
        .find(j.JSXOpeningElement, { name: { name: "Tooltip" } })
        .find(j.JSXAttribute)
        .forEach(pathRoot => {
            const attr = pathRoot.node.name
            const attrVal = ((pathRoot.node.value || {}).expression || {}).value ? pathRoot.node.value.expression : pathRoot.node.value

            if (attr.name === 'trigger') {
                attr.name = 'title'
                let parentEle = j(pathRoot).closest(j.JSXElement, { openingElement: { name: { name: 'Tooltip' } } }).__paths[0]
                let parentChildEle = parentEle.node.children

                const children = parentChildEle.filter(item => {
                    if (item.type === 'JSXText') {
                        const bool = item.value.replace(/[\r\n\ ]/g, "").length
                        bool && (item.value = `"${item.value.replace(/(^\s*)|(\s*$)/g, "")}"`)
                        return bool
                    }
                    return true
                })
                pathRoot.node.value = j(children).toSource()
                parentEle.value.children = [attrVal]
            }

            if (attr.name === 'closable')
            {
                j(pathRoot).remove()
            }

            if (attr.name === 'type') {
                attr.name = "color"
            }

            if (attr.name === 'triggerType') {
                attr.name = "trigger"
            }

            if (attr.name === 'delay') {
                attr.name = "trigger"
            }

            if (attr.name === 'align') {
                attr.name = "placement"
                if (placement[attrVal.value]) {
                    attrVal.value = placement[attrVal.value]
                }
            }

        })
    root
        .find(j.JSXClosingElement, { name: { object: { name: "Balloon" }, property: { name: "Tooltip" } } })
        .forEach(path => {
            path.node.name = j.jsxIdentifier('Tooltip')
        })

    return root.toSource()
}
