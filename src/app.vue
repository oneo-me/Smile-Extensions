<template>
    <div id="app" :style="'width: ' + appWidth + 'px'">
        <span class="icon" v-for="item in items" :title="item['shortName']" :class="{ enabled: item['enabled'] }" @click="changeState(item)">
            <img :src="icon(item)">
        </span>
    </div>
</template>

<script>
export default {
    data() {
        return {
            items: []
        }
    },
    methods: {
        icon: function (item) {
            if (item["icons"] != null) {
                if (item["icons"].length > 0) {
                    return item["icons"][item["icons"].length - 1]["url"]
                }
            }
            return "./res/defaultIcon16@3x.png"
        },
        changeState: function (item) {
            chrome.management.setEnabled(item["id"], !item["enabled"], function () {
                item["enabled"] = !item["enabled"]
            })
        }
    },
    computed: {
        appWidth: function () {
            var num = this.items.length
            var column = 3
            var minColumn = 3
            var maxColumn = 7
            for (var i = maxColumn; i >= minColumn; i--) {
                if (num > i * 2 + 1) {
                    column = i
                    break
                }
            }
            return column * 30
        }
    },
    created() {
        document.onselectstart = function (e) { return false }
        document.oncontextmenu = function (e) { return false }

        var app = this

        chrome.management.getAll(function (array) {
            app.items = []
            array.sort(function (a, b) {
                return a["shortName"].localeCompare(b["shortName"])
            })
            array.forEach(function (item) {
                if (item["shortName"] != "Smile Extensions" && item["type"] == "extension") {
                    app.items.push(item)
                }
            })
        })
    }
}
</script>

<style lang="stylus">
    html,body
        margin 0
        padding 0
    #app
        margin 2px
        .icon
            filter grayscale(100%)
            opacity 0.3
            &.enabled
                filter grayscale(0)
                opacity 1
            img
                width 20px
                height @width
                margin 5px
                &:active
                    transform scale(0.9,0.9)
</style>