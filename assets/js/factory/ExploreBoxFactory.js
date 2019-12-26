// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        boxPrefab: cc.Prefab,
        boxsParentNode: cc.Node,
        boxConfig: cc.JsonAsset
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    start() {
        this.canClear = true
        this.initGameState()
    },
    setGame(game) {
        this.game = game
    },
    initGameState() {
        this.scheduleOnce(function () {
            this.parentHeight = this.boxsParentNode.height
        }, 0.05)
        let lineCount = Math.floor(4 + this.level / 6)
        this.schedule(function () {
            this.createrLineBoxs(0)
        }, 2, lineCount, 0)
    },
    setLevel(level) {
        this.level = level
    },
    //创建一行方块
    createrLineBoxs(y) {
        let baseCount = 3
        if (this.level > 2) baseCount = 4
        let count = baseCount + Math.floor(Math.random() * 3)
        let arr = [];
        arr = this.getRandomNum(arr, count)
        for (let index in arr) {
            let box = this.getBoxByLevel(this.level, arr[index], y)
            this.boxsParentNode.addChild(box)
        }
    },
    getBoxByLevel(level, index_x, y) {
        let box = cc.instantiate(this.boxPrefab)
        let boxJs = box.getComponent("Box")
        boxJs.setExploreConfig(level - 1, index_x, y)
        let distance = -this.parentHeight - y + 140
        // let self = this
        // let callFunc = cc.callFunc(
        //     function () {
        //         if (self.canClear) {
        //             self.canClear = false
        //             self.clearAllBoxs()
        //         }
        //     }
        // )
        let ac1 = cc.moveBy(-distance / 70.0, 0, distance)
        // let action = cc.sequence(ac1, callFunc)
        box.runAction(cc.repeatForever(ac1))
        return box;
    },
    //获得一组不会重复的随机数
    getRandomNum(arr, count) {
        while (arr.length < count) {
            let num = Math.floor(Math.random() * 7)
            if (arr.indexOf(num) == -1) {
                arr.push(num)
            }
        }
        return arr
    },
    recycler(node) {
        cc.MainGame.coinStarAnim.addPatchAnim(cc.v2(node.x, node.y))
        node.active = false
        node.parent = null
    },
    clearAllBoxs() {
        for (let node of this.boxsParentNode.children) {
            if (node.name == 'Box') {
                cc.MainGame.coinStarAnim.addPatchAnim(cc.v2(node.x, node.y))
                node.stopAllActions()
                node.active = false
            }
        }
        this.scheduleOnce(function () {
            this.canClear = true
            this.game.failed()
        }, 1)
    },
    // update (dt) {},
});
