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
    extends: require("BaseDialog"),

    properties: {
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
        turntable: cc.Node,
        freeCountLab: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    onShow() {
        if (this.getTodayDate() > Global.userData.lastTurntableDate) {
            Global.userData.turntableFreeCount = 3
        }
        this.freeCountLab.string = Global.userData.turntableFreeCount + "/3"
    },
    turnFree() {
        if (Global.userData.turntableFreeCount > 0) {
            this.adsManager.showAd({
                success: () => {
                    Global.userData.lastTurntableDate = this.getTodayDate()
                    this.freeCountLab.string = --Global.userData.turntableFreeCount + "/3"
                    this.turn()
                },
                failed: () => {

                }
            })
        } else {
            cc.MainGame.showToast("免费次数不足")
        }
    },
    turnByStar() {
        if (!this.clickable) return
        if (cc.MainGame.addStar(-6)) {
            this.turn()
        }
    },
    turn() {
        if (!this.clickable) return
        this.clickable = false
        this.result = Math.floor(Math.random() * 6)
        let min = 8
        let max = 14
        let number = min + Math.floor(Math.random() * (max - min))
        let rotation = number * 360 + this.result * 60 - 30 + Math.random() * 60
        let ac1 = cc.rotateTo(5, rotation)
        ac1.easing(cc.easeExponentialInOut());
        let self = this
        let call = cc.callFunc(function () {
            self.clickable = true
            self.showResult()
        })
        let action = cc.sequence(ac1, call)
        this.turntable.runAction(action)
    },
    showResult() {
        cc.dialogManager.showGameDialogByArgs("TurntableResultDialog", this.result)
        switch (this.result) {
            case 0://星星*20
                cc.MainGame.addStar(20)
                break
            case 1://机甲*4
                for (let i = 0; i < 4; i++) {
                    cc.MainGame.addCannon(null, -1)
                }
                break
            case 2://coin收益 *5
                if (Global.userData.fiveTimesIncomeEndTime < Date.parse(new Date())) {
                    //加速已经过期
                    Global.userData.fiveTimesIncomeEndTime = Date.parse(new Date()) + 150 * 1000
                } else {
                    //加速未过期
                    Global.userData.fiveTimesIncomeEndTime += 150 * 1000
                }
                cc.MainGame.coinRainNode.active = true
                break
            case 3://一天收益
                let score = 3 * 5 * Math.pow(1.1, Global.userData.maxLevel) * 3600 * 24//基础参数3*基础收益5*1.6^level*3600s*24h
                // score = score * 30 * 24
                cc.MainGame.addScore(score)
                cc.MainGame.coinStarAnim.AddGoldAnim(null, 1)
                break
            case 4://射击速度*2
                if (Global.userData.speedUpEndTime < Date.parse(new Date())) {
                    //加速已经过期
                    Global.userData.speedUpEndTime = Date.parse(new Date()) + 150 * 1000
                } else {
                    //加速未过期
                    Global.userData.speedUpEndTime += 150 * 1000
                }
                break
            case 5://4小时收益
                let score2 = 3 * 5 * Math.pow(1.1, Global.userData.maxLevel) * 3600 * 4//基础参数3*基础收益5*1.6^MaxLevel*3600s*4h
                // score2 = score2 * 30 * 24
                cc.MainGame.addScore(score2)
                cc.MainGame.coinStarAnim.AddGoldAnim(null, 1)
                break
        }
    }
    // update (dt) {},
});
