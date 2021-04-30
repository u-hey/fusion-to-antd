#! /usr/bin/env node

const fs = require('fs')
const path = require('path')
// const { copyFiles, initAntdPlugin } = require('../src/utils')
const { initAntdPlugin, getfiles } = require('../src/utils')
const { editFile } = require('../src/editFile')

async function main() {
    global.cliType = process.argv[2]
    global.projectPath = path.join(process.cwd(), process.argv[3] || '')
    global.printProjectPath = process.argv[4] || process.argv[3] || ''
    global.ALL_FILES_PATH = []

    const result = await domain(global.cliType)
    if (result) {
        console.log(result)
    }
}

async function domain(type) {
    let bool = false
    switch (type) {
        case 'copy':
            bool = !!(global.projectPath && global.printProjectPath)
            if (bool) {
                initFilesToNewProject()
            }
            return bool ? false : `缺少必要参数 eg: npx fusion-to-antd copy [拷贝项目地址<必填>]`
        case 'plugin':
            bool = !!(global.projectPath)
            if (bool) {
                initAntdPlugin()
            }
            return bool ? false : `缺少必要参数 eg: npx fusion-to-antd plugin [根目录<选填>]`
        case 'replace':
            bool = !!(global.projectPath)
            if (bool) {
                initFilesToLocalProject()
            }
            return bool ? false : '无效指令 eg: npx fusion-to-antd <start|plugin|replace> [..args]'
        default:
            return '无效指令 eg: npx fusion-to-antd <start|plugin|replace> [..args]'
    }
}

function initFilesToNewProject() {
    const projectPath = global.projectPath, printProjectPath = global.printProjectPath
    const srcPath = path.join(projectPath, 'src')
    const srcPathDir = fs.readdirSync(srcPath)
    srcPathDir.forEach(file => {
        if (/^routes./.test(file)) {
            const publicDir = path.join(printProjectPath, 'config')
            const fileType = file.split('.')[1]
            const routesDir = path.join(publicDir, `routes_fusion.${fileType}`)
            if (!fs.existsSync(publicDir)) {
                fs.mkdirSync(publicDir)
            }
            fs.writeFileSync(routesDir, fs.readFileSync(path.join(srcPath, file)))
            global.ALL_FILES_PATH.push(routesDir)
        }
        if (file === 'pages') {
            copyFiles(path.join(srcPath, 'pages'), path.join(printProjectPath, '/src/pages'))
        }
        if (file === 'components') {
            copyFiles(path.join(srcPath, 'components'), path.join(printProjectPath, '/src/components'))
        }
    })
    // global.ALL_FILES_PATH.forEach(path => {
        console.log(global.ALL_FILES_PATH)
    //     editFile(path)
    // })
    editFile('/Users/uhey/Documents/task/umiapp/src/components/Guide/index.tsx')

}

function initFilesToLocalProject() {
    const readDir = (() => {
        if (global.projectPath === '.') {
            return path.join(global.projectPath, 'src')
        } else {
        const stat = fs.statSync(global.projectPath)
            if (stat.isDirectory() || stat.isFile()) {
                return path.join(global.projectPath)
            } else {
                return null
            }
        }
    })()
    global.ALL_FILES_PATH = readDir ? getfiles(readDir) : []
    console.log('- 文件转译列表')
    console.log(global.ALL_FILES_PATH)
    console.log('- 即将转译...')
    global.ALL_FILES_PATH.forEach(async (fileDir, i) => {
        await editFile(fileDir)
        i === global.ALL_FILES_PATH.length-1 && console.log(`- 转译结束`)
    })
}


module.exports = {
    main
}
