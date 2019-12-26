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
        icon: cc.Node,
        speedProgressBar: cc.ProgressBar,
        attackProgressBar: cc.ProgressBar
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
        this.config = cc.cannonFactory.config[this.args]
        this.icon.getComponent(cc.Sprite).spriteFrame = cc.cannonFactory.cannonFrames[this.args]
        this.speedProgressBar.progress = 0.05 / this.config.fireInterval
        this.attackProgressBar.progress = Math.sqrt(this.config.attack) / 1000
        cc.MainGame.setNextPrice()
    },
    receiveStar() {
        if (!this.clickable) return
        cc.MainGame.addStar(3)
        this.dismiss()
    }
    // update (dt) {},
});
