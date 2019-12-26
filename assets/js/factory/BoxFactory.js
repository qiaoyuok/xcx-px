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
        boxsParentNode: cc.Node
    },
    initPool() {
        this.pool = new cc.NodePool("Box")
        for (let i = 0; i < this.defaultPoolSize; i++) {
            let box = cc.instantiate(this.boxPrefab)
            this.pool.put(box)
        }
    },
    //创建初始方块
    createrStartBoxs() {
        for (let i = 0; i < 4; i++) {
            this.createrLineBoxs(-140 * i)
        }
    },
    //创建一行方块
    createrLineBoxs(y) {
        let count = 3 + Math.floor(Math.random() * 5)
        let arr = [];
        arr = this.getRandomNum(arr, count)
        for (let index in arr) {
            let box = this.getBoxByLevel(Global.userData.promotion, arr[index], y)
            this.boxsParentNode.addChild(box)
        }
    },
    getBoxByLevel(level, index_x, y) {
        if (this.pool == null) {
            cc.log("BoxFactory 未初始化")
            return
        }
        let box
        if (this.pool.size() > 0) {
            box = this.pool.get(this.pool)
        } else {
            box = cc.instantiate(this.boxPrefab)
        }
        let boxJs = box.getComponent("Box")
        boxJs.setConfig(level - 1, index_x, y)
        let distance = -this.parentHeight - y + 140
        let ac1 = cc.moveBy(-distance / 70.0, 0, distance)
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
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.canClear = true
        this.initGameState()
    },
    initGameState() {
        this.scheduleOnce(function () {
            this.parentHeight = this.boxsParentNode.height
            this.initPool()
            this.gaming = true
            this.createrStartBoxs()
            this.schedule(function () {
                this.createrLineBoxs(0)
            }, 2)
        }, 0.05)
    },
    //回收子弹入prefab池重复使用
    recycler(box) {
        box.getComponent("Box").isTarget = false
        box.stopAllActions()
        this.pool.put(box)
    },
    clearAllBoxs() {
        cc.MainGame.cameraShake(5)
        while (this.boxsParentNode.childrenCount > 0) {
            let box = this.boxsParentNode.children[0]
            box.getComponent("Box").toSavingPot()
            if (Math.random() > 0.7) {
                cc.MainGame.coinStarAnim.AddGoldAnim(cc.v2(box.x, box.y), 2)
                cc.MainGame.coinStarAnim.addPatchAnim(cc.v2(box.x, box.y))
            }
            this.recycler(box)
        }
        cc.MainGame.saveUserData()
        this.scheduleOnce(function () {
            this.canClear = true
        }, 1)
        cc.MainGame.resetProgress()
    }
    // update (dt) {},
});
