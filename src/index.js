chrome.management.getAll(array => {
    var app = document.getElementById("app")
    var items = []

    // 禁用选择与右键菜单
    document.onselectstart = e => { return false }
    document.oncontextmenu = e => { return false }

    // 获取全部扩展
    array.forEach(item => {
        if (item["shortName"] != "Smile Extensions" && item["type"] == "extension") {
            items.push(item)
        }
    })
    items.sort((a, b) => {
        return a["shortName"].localeCompare(b["shortName"])
    })

    // 计算合适的宽度
    var num = items.length
    var column = 3
    var minColumn = 3
    var maxColumn = 10
    for (var i = maxColumn; i >= minColumn; i--) {
        if (num > i * 2 + 1) {
            column = i
            break
        }
    }
    app.style.width = column * 30 + "px"

    // 添加内容
    items.forEach(item => {
        var span = document.createElement("span")
        var img = document.createElement("img")

        span.title = item["shortName"]
        span.className = item["enabled"] ? "enabled" : ""
        img.src = (item["icons"] != null && item["icons"].length > 0) ? item["icons"][item["icons"].length - 1]["url"] : "./defaultIcon.png"

        // 点击切换状态
        img.onclick = (t, e) => {
            chrome.management.setEnabled(item["id"], !item["enabled"], function () {
                item["enabled"] = !item["enabled"]
                span.className = item.enabled ? "enabled" : ""
            })
        }

        span.appendChild(img)
        app.appendChild(span)
    })
})