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
        score: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    onShow() {
        let offLineTime = Math.floor((Date.parse(new Date()) - Global.userData.lastSyncTime) / 1000)
        this.offlineScore = Math.floor(3 * 5 * Math.pow(1.6, Global.userData.maxLevel) * offLineTime)
        this.score.string = this.formatScore(this.offlineScore)
    },
    treble() {
        if (!this.clickable) return
        if (cc.MainGame.addStar(-3)) {
            cc.MainGame.addScore(this.offlineScore * 3)
            this.dismiss()
        } else {
            this.showToast('星星不足')
        }
    },
    onDismiss() {
        cc.MainGame.saveUserData()
    },
    single() {
        if (!this.clickable) return
        cc.MainGame.addScore(this.offlineScore)
        this.dismiss()
    },
    double() {
        if (!this.clickable) return
        this.adsManager.showAd({
            success: () => {
                cc.MainGame.addScore(this.offlineScore * 2)
                this.dismiss()
            },
            failed: () => {

            }
        })
    },
    // update (dt) {},
});
