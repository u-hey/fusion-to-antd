const apiKeys = {
    Overlay: "Tooltip",
    Nav: "Menu",
    Paragraph: "Typography",
    Search: "Input",
    SplitButton: "Dropdown",
    AddTag: "Select",
    DynamicIcon: "Icon",
    Balloon: "Popover, Tooltip",
    Box: "Row, Col",
    CascaderSelect: "Cascader",
    Dialog: "Modal",
    Loading: "Spin",
    MenuButton: "Menu",
    NumberPicker: "InputNumber",
    Range: "Slider",
    Rating: "Rate",
    ResponsiveGrid: "Row, Col",
    Shell: "Layout",
    Step: "Steps",
    Message: "message, Alert",
    Grid: "Row, Col",
    Tab: "Tabs",
    Slider: "Carousel"
}
const placement = {
    t: 'top',
    r: 'right',
    b: 'bottom',
    l: 'left',
    tl: 'leftTop',
    tr: 'topRight',
    bl: 'bottomLeft',
    br: 'bottomRight',
    lt: 'leftTop',
    lb: 'leftBottom',
    rt: 'rightTop',
    rb: 'rightBottom'
}

const iconMap = {
    prompt: 'InfoCircleOutlined',
    warning: 'WarningOutlined',
    search: 'SearchOutlined',
    success: 'CheckCircleOutlined',
    error: 'CloseCircleOutlined',
    edit: 'EditOutlined',
    add: 'PlusOutlined',
    ellipsis: 'EllipsisOutlined',
    ashbin: 'DeleteOutlined',
    eye: 'EyeOutlined',
    'eye-close': 'EyeInvisibleOutlined',
    account: 'UserOutlined',
    close: 'CloseCircleOutlined'
}
const shapes = {
    pure: 'line',
    wrapped: 'card',
    text: 'line',
    capsule: 'card'
}
module.exports = {
    apiKeys,
    placement,
    iconMap,
    shapes
}
