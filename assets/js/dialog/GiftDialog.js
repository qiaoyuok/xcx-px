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
        giftSpriteFrames: [cc.SpriteFrame],
        giftIcon: cc.Node
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

    // onLoad () {},

    start() {

    },
    onShow() {
        this.type = Math.floor(Math.random() * 2)
        this.giftIcon.getComponent(cc.Sprite).spriteFrame = this.giftSpriteFrames[this.type]
    },
    receiveFree() {
        if (!this.clickable) return
        this.adsManager.showAd({
            success: () => {
                this.showGift()
            },
            failed: () => {

            }
        })
    },
    receiveByStar() {
        if (!this.clickable) return
        if (cc.MainGame.addStar(-6)) {
            this.showGift()
        }
    },
    showGift() {
        if (!this.clickable) return
        this.dismiss()
        switch (this.type) {
            case 0:
                cc.dialogManager.showGameDialogByArgs("TurntableResultDialog", 1)
                for (let i = 0; i < 4; i++) {
                    cc.MainGame.addCannon(null, -2)
                }
                break
            case 1:
                cc.dialogManager.showGameDialogByArgs("TurntableResultDialog", 2)
                if (Global.userData.fiveTimesIncomeEndTime < Date.parse(new Date())) {
                    //加速已经过期
                    Global.userData.fiveTimesIncomeEndTime = Date.parse(new Date()) + 150 * 1000
                } else {
                    //加速未过期
                    Global.userData.fiveTimesIncomeEndTime += 150 * 1000
                }
                cc.MainGame.coinRainNode.active = true
                break

        }
    }
    // update (dt) {},
});
