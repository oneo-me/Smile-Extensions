<template>
	<div id="app" :style="'width: ' + appWidth + 'px;height: ' + appHeight + 'px;'">
		<div class="icon" :class="{ enabled: icon.state }" v-for="icon in icons"
			:title="icon.title + '\n' + icon.description"
			@click="changeState(icon)">
			<img :src="minIcon(icon)">
		</div>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				icons: []
			}
		},
		methods: {
			minIcon: function(icon) {
				if (icon.images != null) {
					if (icon.images.length > 0) {
						return icon.images[0]["url"]
					}
				}
				return "res/default.png"
			},
			changeState: function(icon) {
				chrome.management.setEnabled(icon.id, !icon.state, function () {
					icon.state = !icon.state
				})
			}
		},
		computed: {
			appWidth: function() {
				var num = this.icons.length
				var column = 3
				if (num > 4 * 2 + 1) column = 4
				if (num > 5 * 2 + 1) column = 5
				if (num > 6 * 2 + 1) column = 6
				if (num > 7 * 2 + 1) column = 7
				return 38 * column
			},
			appHeight: function() {
				var num = this.icons.length
				var column = 3
				if (num > 4 * 2 + 1) column = 4
				if (num > 5 * 2 + 1) column = 5
				if (num > 6 * 2 + 1) column = 6
				if (num > 7 * 2 + 1) column = 7
				var row = (parseInt(num / column) + (num % column > 0 ? 1 : 0))
				return 38 * row
			}
		},
		created () {

			document.onselectstart = function (e) { return false }
			document.oncontextmenu = function (e) { return false }

			var app = this

			chrome.management.getAll(function (array)
			{
				// 清空
				app.icons = []
				// 排序
				array.sort(function (a, b)
				{
					return a["shortName"] > b["shortName"]
				})
				// 添加
				for (var i = 0; i < array.length; i++)
				{
					// 排除自身
					if (array[i]["shortName"] != "My Extension" && array[i]["type"] == "extension")
					{
						app.icons.push({
							id: array[i]["id"],
							title: array[i]["shortName"],
							description: array[i]["description"],
							state: array[i]["enabled"],
							images: array[i]["icons"]
						})
					}
				}
			})
		}
	}
</script>

<style>
	body
	{
		margin: 0;
		padding: 0;
	}
	#app
	{
		overflow: hidden;
	}
	#app .icon
	{
		cursor: pointer;
		width: 32px;
		height: 32px;
		margin: 2px;

		border-radius: 3px;
		background: rgba(0,0,0,0);
		border: 1px solid rgba(0,0,0,0);
		transition: all 0.3s;

		float: left;
	}
	#app .icon:hover
	{
		background: rgba(0,0,0,0.05);
		border: 1px solid rgba(0,0,0,0.15);
		transition: all 0.3s;
	}
	#app .icon img
	{
		width: 16px;
		height: 16px;
		margin: 8px;

		opacity: 0.3;
		filter: grayscale(100%);

		transition: all 0.2s;
	}
	#app .icon:active img
	{
		transform: scale(0.9,0.9);
		transition: all 0.2s;
	}
	#app .icon.enabled img
	{
		opacity: 1;
		filter: grayscale(0);

		transition: all 0.2s;
	}
</style>