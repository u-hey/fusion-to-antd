const _ = require('lodash')

module.exports = (file, api) => {
    const j = api.jscodeshift;
    const root = j(file.source)
    root
        .find(j.JSXOpeningElement)
        .filter(path => _.get(path, 'node.name.name', null) === "CountDownTimer")
        .forEach((path) => {
            path.node.name.name = "Statistic.Countdown";
            j(path)
                .find(j.JSXAttribute)
                .forEach((path) => {
                    if (path.node.name.name === "value" && typeof path.node.value.expression.value === 'number') {
                        path.node.value.expression.value = path.node.value.expression.value*10
                    }
                });
    });
    root
        .find(j.JSXClosingElement)
        .filter(path => _.get(path, 'node.name.name', null) === "CountDownTimer")
        .forEach((path) => {
            path.node.name.name = "Statistic.Countdown";
    });

    return root.toSource()
}
