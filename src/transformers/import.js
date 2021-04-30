const _ = require('lodash')
const { apiKeys } = require('./components/dic')
module.exports = (file, api, options) => {
    const j = api.jscodeshift;
    const root = j(file.source);
    let importKeys = []
    let hasIcon = false
    root
        .find(j.ImportDeclaration, { source: { value: '@ant-design/icons' } })
        .forEach(path => {
            hasIcon = true
        })
    root
        .find(j.ImportDeclaration, { source: { value: "@alifd/next" } })
        .forEach((path, i, items) => {

            path.node.source.value = "antd";
            if (!hasIcon) {
                const bool = path.node.specifiers.map(item => item.imported.name).includes('Icon')
                bool && path.insertAfter(j.importDeclaration( [j.importDefaultSpecifier(j.identifier('{ }'))], j.literal('@ant-design/icons')))
                bool && (hasIcon = true)
            }
        })
        .find(j.ImportSpecifier)
        .forEach((path) => {
            const imported = path.node.imported
            const key = imported.name

            if (apiKeys[key]) {
                imported.name = apiKeys[key]
            }
        })
    // 物料内转换
    root
        .find(j.ImportDeclaration, { source: { value: "@icedesign" } })
        .forEach((path, i, items) => {
            path.node.source.value = "antd";
        })
        .find(j.ImportSpecifier)
        .forEach((path) => {
            const imported = path.node.imported
            const key = imported.name

            if (apiKeys[key]) {
                imported.name = apiKeys[key]
            }
        })

    // 物料包名
    root
        .find(j.ImportDeclaration)
        .filter((path) => {
            return path.node.source && path.node.source.value === "@alife/fliggy-ice-material-count-down-timer";
        })
        .forEach((path) => {
            path.node.source.value = "antd";
            path.node.specifiers[0] = j.importSpecifier(j.identifier("Statistic"), j.identifier("Statistic"));
        });
    root
        .find(j.ImportDeclaration)
        .filter((path) => {
            return path.node.source && path.node.source.value === "@alife/fliggy-ice-material-fliggy-page-head-explain";
        })
        .forEach((path) => {
            path.node.source.value = "antd";
            path.node.specifiers[0] = j.importSpecifier(j.identifier("Statistic"), j.identifier("Statistic"));
        });
    root
        .find(j.ImportDeclaration)
        .filter((path) => {
            return path.node.source && path.node.source.value === "@alife/fliggy-ice-material-fliggy-page-head-explain";
        })
        .forEach((path) => {
            path.node.source.value = "antd";
            path.node.specifiers = [j.importSpecifier(j.identifier("PageHeader"))];
        });
    // 输出
    root
        .find(j.ImportDeclaration, { source: { value: "antd" } })
        .find(j.ImportSpecifier)
        .forEach(path => {
            importKeys = importKeys.concat((path.node.imported.name).split(', '))
        })
    api.report(`importKeys:${importKeys}`)
    return root.toSource();
}
