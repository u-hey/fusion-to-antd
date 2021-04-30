const apiMap = {
    Overlay: "Tooltip",
    Nav: "Menu",
    Paragraph: "Typography",
    Search: "Input",
    SplitButton: "Dropdown",
    AddTag: "Select",
    DynamicIcon: "Icon",
    Balloon: "Popover",
    Box: "Grid",
    CascaderSelect: "Cascader",
    Dialog: "Modal",
    Loading: "Spin",
    MenuButton: "Menu",
    NumberPicker: "InputNumber",
    Range: "Slider",
    Rating: "Rate",
    ResponsiveGrid: "Grid",
    Shell: "Layout",
    Step: "Steps",
}
const notSupportApiTxt = {
    Animate: '不支持Animate动画，建议手动替代脚本\n\r',
    Field: '不支持Field表单辅助工具，建议手动替代脚本\n\r',
    Slider: '不支持Slider图片轮播，建议手动替代脚本\n\r',
    BoxSelector: '不支持BoxSelector块选择器，建议手动替代脚本\n\r',
    LightWangwang: '不支持LightWangwang旺旺点灯，建议手动替代脚本\n\r',
    StaffSelector: '不支持StaffSelector花名选择，建议手动替代脚本\n\r',
    TextEdit: '不支持TextEdit文字编辑，建议手动替代脚本\n\r',
    Img: '不支持Img图片组件，建议手动替代脚本\n\r',
    Qrcode: '不支持Qrcode二维码，建议手动替代脚本\n\r',
}

module.exports = {
    apiMap,
    notSupportApiTxt
}
