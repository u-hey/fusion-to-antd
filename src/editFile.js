const path = require('path')
const fs = require('fs')
const execa = require('execa');
const jscodeshiftBin = require.resolve('.bin/jscodeshift');
const { getfiles } = require('../src/utils')


module.exports.editFile = async (src = '') => {
    // const parseSrc = path.parse(src)
    const transferDir = path.join(__dirname, 'transformers')
    const transferFiles = getfiles(transferDir)
    // console.log(`- 编译文件：${src}`)
    // 优先读写import
    const outdrr = await execa.sync(jscodeshiftBin, ['-t', path.join(transferDir, 'import.js'), src])
    const apiList = outdrr.stdout.match(/importKeys:(.+)/g)
    if (outdrr.failed) {
        console.log(`- 编译出错： ${outdrr}`)
    }
    // 修改对应组件
    if (apiList) {
        const astFiles = apiList[0].split('importKeys:')[1].split(',')
            .map(filename => path.join(transferDir, `${filename}.js`))
            .filter(fileDir => {
                return transferFiles.includes(fileDir)
            })
        console.log(`- 编译文件：${src}`)
        console.log(`- 修改组件：${apiList[0].split('importKeys:')[1].split(',')}`)
        astFiles.forEach(async (transferPath, i) => {
            const outdrr = await execa.sync(jscodeshiftBin, ['-t', transferPath, src])
            if (outdrr.failed) {
                console.log(`- 编译出错： ${outdrr}`)
            }
        })
    }

    return true
}
