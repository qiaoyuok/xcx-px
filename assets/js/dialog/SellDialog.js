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
        icon: cc.Sprite,
        price: cc.Label
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
        this.icon.spriteFrame = cc.cannonFactory.cannonFrames[this.args._level - 1]
        this.scoreTx = this.formatScore(this.args._score * 0.5)
        this.price.string = this.scoreTx
    },
    confirm() {
        cc.MainGame.savePosition(0, this.args._node);
        //删除
        cc.cannonFactory.recycler(this.args._node);
        cc.MainGame.addScore(this.args._score * 0.5)
        cc.MainGame.showToast(`卖出炮台获得${this.scoreTx}金币`)
        this.dismiss()
    },
    // update (dt) {},
});
