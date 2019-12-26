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
        before: cc.Node,
        after: cc.Node,
        promotionLabel: cc.Label,
        attackLabel: cc.Label,
        starLabel: cc.Label,
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
        this.beforeConfig = cc.MainGame.promotionJson.json.promotions[Global.userData.promotion]
        this.afterConfig = cc.MainGame.promotionJson.json.promotions[Global.userData.promotion + 1]
        this.before.getComponent(cc.Sprite).spriteFrame = cc.MainGame.promotionFrames[Global.userData.promotion]
        this.after.getComponent(cc.Sprite).spriteFrame = cc.MainGame.promotionFrames[Global.userData.promotion + 1]
        this.promotionLabel.string = this.afterConfig.name
        this.attackLabel.string = "+" + this.afterConfig.reward.attack + "%"
        this.starLabel.string = "+" + this.afterConfig.reward.star
        Global.userData.promotion++
    },
    onDismiss() {
        cc.dialogManager.showGameDialogByArgs("PromotionAnimDialog", Global.userData.promotion)
    },
    reward() {
        if (!this.clickable) return
        Global.userData._star += this.afterConfig.reward.star
        Global.userData.attackByPromotionUp = Global.userData.attackByPromotionUp * (100 + this.afterConfig.reward.attack) / 100.0
        this.dismiss()
    },
    rewardDouble() {
        if (!this.clickable) return
        this.adsManager.showAd({
            success: () => {
                Global.userData._star += (this.afterConfig.reward.star * 2)
                Global.userData.attackByPromotionUp = Global.userData.attackByPromotionUp * (100 + this.afterConfig.reward.attack * 2) / 100.0
                this.dismiss()
            },
            failed: () => {

            }
        })
    },
    // update (dt) {},
});
