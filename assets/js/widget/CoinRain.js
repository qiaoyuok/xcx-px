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
        coin: cc.Prefab
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.time = 0
    },

    start() {
    },
    initPool() {
        if (!this.pool) {
            this.pool = new cc.NodePool("Coin")
            for (let i = 0; i < 30; i++) {
                let coin = cc.instantiate(this.coin)
                this.pool.put(coin)
            }
        }
    },
    show() {
        this.node.active = true
    },
    dismiss() {
        this.node.active = false
    },
    addCoin() {
        if (!this.pool) this.initPool()
        let coin
        if (this.pool.size() > 0) {
            coin = this.pool.get(this.pool)
        } else {
            coin = cc.instantiate(this.coin)
        }
        coin.x = -540 + Math.random() * 1080
        coin.y = 0
        this.node.addChild(coin)
        let self = this
        let func = cc.callFunc(function () {
            self.pool.put(coin)
        })
        let action = cc.moveBy(0.4 + Math.random() * 0.5, 0, -2500)
        coin.runAction(cc.sequence(action, func))
    },
    update(dt) {
        this.time += dt
        if (this.time > 0.2) {
            this.time = 0
            let currentTime = Date.parse(new Date())
            if (Global.userData.fiveTimesIncomeEndTime > currentTime) {
                this.addCoin()
            } else {
                this.dismiss()
            }
        }
    },
});
