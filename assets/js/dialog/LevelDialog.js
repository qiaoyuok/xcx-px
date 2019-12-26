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
        targetSword: cc.Label,
        currentSword: cc.Label,
        downBtn: cc.Node
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
        this.target
        if (this.args == 1) {
            this.target = Global.userData.promotion //下一个段位
            this.downBtn.active = false
        } else {
            this.target = Global.userData.promotion - 1 //上一个段诶
            this.downBtn.active = true
        }
        this.currentSword.string = this.formatScore(cc.MainGame.getSword())
        this.targetSword.string = this.formatScore(6 * Math.pow(3, this.target))
    },
    promotionUp() {
        if (!this.clickable) return
        this.dismiss()
        cc.dialogManager.showGameDialog(null, "PromotionDialog")
    },
    promotionDown() {
        if (!this.clickable) return
        if (cc.MainGame.getSword() > (6 * Math.pow(3, this.target))) {
            cc.dialogManager.showGameDialogByArgs("ConfirmDialog", {
                title: '战力爆表，是否降低段位',
                confirm: () => {
                    this.adsManager.showAd({
                        success: () => {
                            Global.userData.promotion--
                            cc.dialogManager.showGameDialogByArgs("PromotionAnimDialog", Global.userData.promotion)
                        },
                        failed: () => {

                        }
                    })
                }
            })
        } else {
            this.adsManager.showAd({
                success: () => {
                    Global.userData.promotion--
                    cc.dialogManager.showGameDialogByArgs("PromotionAnimDialog", Global.userData.promotion)
                },
                failed: () => {

                }
            })
        }
        this.dismiss()
    },
    // update (dt) {},
});
