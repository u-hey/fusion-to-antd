const getStringEle = (source) => {
    if (Array.isArray(source)) {
        let arr = []
        source.forEach((item, i, items) => {
            if (!item.replace(/\s+|\n/g, '').length && i!==0 && i!== (items.length - 1 )){
                arr.push('<></>')
            }
            arr.push(item)
        })
        return arr.join('')
    } else {
        return source
    }
}

module.exports = {
    getStringEle
}
