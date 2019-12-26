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
        icon: cc.Node
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
        this.icon.getComponent(cc.Sprite).spriteFrame = cc.MainGame.promotionAnimFrames[Global.userData.promotion - 1]
        let actions = []
        this.icon.x = 0
        this.icon.y = -343
        this.icon.scaleX = 0
        this.icon.scaleY = 0
        let ac1 = cc.scaleTo(1, 1)
        ac1.easing(cc.easeElasticOut());
        actions.push(ac1)
        actions.push(cc.scaleTo(0.5, 1))
        let ac2 = cc.spawn(cc.moveTo(0.3, -480, -100), cc.scaleTo(0.3, 0))
        ac2.easing(cc.easeBackIn());
        actions.push(ac2)
        let self = this
        let call = cc.callFunc(function () {
            self.dismiss()
        })
        actions.push(call)
        this.icon.runAction(cc.sequence(actions))
    },
    onDismiss() {
        cc.MainGame.setPromotion()
        cc.boxFactory.clearAllBoxs()
    }
    // update (dt) {},
});
