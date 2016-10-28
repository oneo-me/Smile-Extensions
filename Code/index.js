// 设置内容
document.onselectstart = function(e){ return false; }
document.oncontextmenu = function(e){ return false; }

// 设置状态
var setState = function(icon)
{
	var id = $(icon).attr("id");
	var state = $(icon).attr("state") == "true" ? true : false;
	chrome.management.setEnabled(id,!state,function()
	{
		$(icon).attr("state",!state);
	});
}

// 获取图标
var getIcon = function(icons)
{
	if (icons != null)
	{
		if (icons.length > 0)
		{
			return icons[0]["url"];
		}
	}
	return "res/default.png";
}

// 设置大小
var setSize = function(num)
{
	var column = 3;
	if (num > 4 * 2 + 1) column = 4;
	if (num > 5 * 2 + 1) column = 5;
	if (num > 6 * 2 + 1) column = 6;
	if (num > 7 * 2 + 1) column = 7;
	var row = (parseInt(num / column) + (num % column > 0 ? 1 : 0));

	$("#extension").css({
		"width": 38 * column + "px",
		"height": 38 * row + "px"
	});
}

// 获取全部扩展
chrome.management.getAll(function(array)
{
	// 设置高度，手动设置大小可以防止黑边出现
	setSize(array.length - 1);

	// 随便一个排序，防止禁用后的位置变化
	array.sort(function(a,b)
	{
		return a["shortName"] > b["shortName"];
	});

	// 添加
	for (var i = 0; i < array.length; i++)
	{
		// 排除自身，么么哒
		if (array[i]["shortName"] != "My Extension" && array[i]["type"] == "extension")
		{
			var html = "";
			html += "<div class='icon'" + " title='" + array[i]["shortName"] + "\n" + array[i]["description"] + "'" + " id='" + array[i]["id"] + "'" + " state='" + array[i]["enabled"] + "'" + ">";
			html += "	<img src='" + getIcon(array[i]["icons"]) + "'>";
			html += "</div>";
			$("#extension").append(html);
		}
	}

	// 设置点击功能
	$("#extension .icon").mouseup(function(e)
	{
		if (e.which == 1)
		{
			setState(this);
		}
	});
});