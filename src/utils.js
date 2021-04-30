#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const process = require('child_process')
const { apiMap, notSupportApiTxt } = require('./conf/dic')
// const { editFile } = require('./editFile')
function filterFiles (dir, ls = []) {
    const files = fs.readdirSync(dir)
    const reg = /\@alifd\/next/i
    files.forEach((item) => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory() && item !== 'node_modules' && item !== '.ice') {
            filterFiles(fullPath, ls);
        } else {
            if (path.extname(item) === '.js' || path.extname(item) === '.jsx') {
                const data = fs.readFileSync(fullPath, 'utf-8').toString();
                if (reg.test(data)) {
                    ls.push(fullPath)
                }
            }
        }
    })
    // ls = ['/Users/uhey/Documents/demo/src/pages/FeedbackFail/components/FailDetail/index.jsx']
    return ls
}

function initAntdPlugin(dir = global.projectPath) {
    const buildPath = path.join(dir, 'build.json')
    const files = fs.readFileSync(buildPath, 'utf-8')
    let hasAntdConf = false
    let newfiles = JSON.parse(files.toString())
    newfiles.plugins = Array.from(newfiles.plugins || {})

    console.log('- 即将安装antd和build-plugin-antd')
    process.exec('cd ' + dir + ' && tnpm install antd@4.9.2 build-plugin-antd @ant-design/icons --save-dev', function(err){
        if(err){
            console.error('- antd和build-plugin-antd安装失败');
        }
        console.log('- antd和build-plugin-antd安装完毕');
    })

    console.log('- 检查配置项build-plugin-antd')
    newfiles.plugins.forEach(item => {
        if (Array.isArray(item) && item[0] == 'build-plugin-antd') {
            if (!item[1]) {
                item[1] = {
                    themeConfig: {}
                }
            }
            if (!item[1].themeConfig) {
                item[1].themeConfig = {}
            }
            let themeConfig = item[1].themeConfig, keys = []
            keys = Object.keys(themeConfig)
            hasAntdConf = true

            if(!keys.includes("primary-color")) {
                themeConfig["primary-color"] = "#5050E6"
            }
            if(!keys.includes("border-radius-baser")) {
                themeConfig["border-radius-baser"] = "4px"
            }
            if(!keys.includes("font-size-base")) {
                themeConfig["font-size-base"] = "12px"
            }
            if(!keys.includes("text-color")) {
                themeConfig["text-color"] = "#333"
            }
            if(!keys.includes("text-color-secondary")) {
                themeConfig["text-color-secondary"] = "#999"
            }
        }
    })
    if (!hasAntdConf) {
        newfiles.plugins.push(['build-plugin-antd', {
            themeConfig: {
                "primary-color": "#5050E6",
                "border-radius-base": "4px",
                "font-size-base": "12px",
                "text-color": "#333",
                "text-color-secondary": "#999"
            }
        }])
    }
    fs.writeFileSync(buildPath, JSON.stringify(newfiles, null, 2), 'utf-8')
    console.log('- build-plugin-antd配置完毕');
}

function rplcApi (api) {
    if (apiMap[api]) {
        const content = notSupportApiTxt[api] || `不支持的组件${api}，建议手动替代脚本\n\r`
        log(content)
    }
    return {
        newApi: map[api] || api,
        oldApi: api,
        notSupportsMsg: notSupports[api]
    }
}

function copyFiles(copiedPath, printPath) {
    const dir = fs.readdirSync(copiedPath)
    dir.forEach((fileName) => {
        const copiedPathDir = path.join(copiedPath, fileName)
        const printPathDir = path.join(printPath, fileName)
        const stat = fs.statSync(copiedPathDir)
        if (stat.isDirectory()) {
            if (!fs.existsSync(printPathDir)) {
                fs.mkdirSync(printPathDir, { recursive: true })
            }
            copyFiles(copiedPathDir, printPathDir)
        } else {
            if (fs.existsSync(printPathDir)) {
                log(`文件冲突，请手动覆盖：${printPathDir}\n\r`)
                return
            }
            fs.copyFileSync(copiedPathDir, printPathDir)
            global.ALL_FILES_PATH.push(copiedPathDir)
        }
    })
}

function getfiles(projectPath = global.projectPath, exts = ['.js', '.jsx', '.ts', '.tsx']) {
    let res = []
    const traverse = (dir) => {
        const stats = fs.statSync(dir)
        if (stats.isDirectory()) {
            fs.readdirSync(dir).forEach((file)=>{
                const pathname = path.join(dir,file)
                const stat = fs.statSync(pathname)
                if(stat.isDirectory() && file !== 'node_modules' && file !== '.ice' && file !== '.umi'){
                    traverse(pathname)
                }else{
                    if (exts.includes(path.extname(pathname))) {
                        res.push(pathname)
                    }
                }
            })
        } else {
            if (exts.includes(path.extname(dir))) {
                res.push(dir)
            }
        }

    }
    traverse(projectPath)
    return res;
}

function log(content) {
    const logDir = path.join(global.printProjectPath, 'fta.log')

    if (!fs.existsSync(logDir)) {
        fs.writeFileSync(logDir, content)
    }
    fs.appendFileSync(logDir, content)

}

function hasFile(fileNames, dir) {
    // 返回指定路径下一级
}

function setImportKeys(key, val) {
    global[key] = val
    console.log(global[key])
}

module.exports =  {
    filterFiles,
    initAntdPlugin,
    rplcApi,
    hasFile,
    setImportKeys,
    copyFiles,
    log,
    getfiles
}
