const _ = require('lodash')

module.exports = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source)
    root
        .find(j.JSXOpeningElement, { name: { name: 'Slider'  } })
        .forEach(path => { path.node.name.name = "Carousel" })
        .find(j.JSXAttribute)
        .forEach((pathRoot) => {
            const attr = pathRoot.node.name
            const attrVal = pathRoot.node.value
        });
    root
        .find(j.JSXClosingElement, { name: { name: 'Slider'  } })
        .forEach(path => { path.node.name.name = "Carousel" })
    return root.toSource()
}
