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
        coin: cc.Label,
        star: cc.Label
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
        this.currentCoin = Global.userData.savingPotCoinCount
        this.currentCoinString = this.formatScore(this.currentCoin)
        this.currentStar = Math.floor(2 + Global.userData.promotion * 0.8)
        this.coin.string = this.currentCoinString
        this.star.string = "x" + this.currentStar
    },
    receive() {
        if (!this.clickable) return
        if (cc.MainGame.addStar(-this.currentStar)) {
            cc.MainGame.addScore(this.currentCoin)
            cc.MainGame.coinStarAnim.AddGoldAnim(null, 1)
            Global.userData.savingPotCoinCount -= this.currentCoin
            this.dismiss()
        } else {
            cc.MainGame.showToast("星星不足")
        }
    }
    // update (dt) {},
});
