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
        resultFrames: [cc.SpriteFrame],
        resultSprite: cc.Sprite,
        band: cc.Node,
        text: cc.Node
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
        let postions = [[63, 64], [74, 43], [74, 43], [56, 103], [95, 78], [84, 99], [102, 71]]
        this.resultSprite.spriteFrame = this.resultFrames[this.args]
        this.text.active = this.args > 5 ? true : false
        this.resultSprite.node.x = -985
        this.resultSprite.node.y = -413
        let time1 = 0.3
        let time2 = 1
        let time3 = 0.3
        let bandAc1 = cc.fadeIn(time1)
        let bandAc2 = cc.moveBy(time2, 0, 0)
        let bandAc3 = cc.fadeOut(time3)
        let bandAction = cc.sequence(bandAc1, bandAc2, bandAc3)
        this.band.runAction(bandAction)

        let resultAc1 = cc.moveTo(0.5, postions[this.args][0], postions[this.args][1])
        resultAc1.easing(cc.easeExponentialInOut());
        let resultAc2 = cc.moveTo(0.6, postions[this.args][0], postions[this.args][1])
        let resultAc3 = cc.moveTo(0.5, 995, 571)
        resultAc3.easing(cc.easeExponentialInOut());
        let resultAction = cc.sequence(resultAc1, resultAc2, resultAc3)
        this.resultSprite.node.runAction(resultAction)

        this.scheduleOnce(function () {
            this.dismiss()
        }, time1 + time2 + time3)
    },
    // setResult(result) {
    //     this.resultSprite.spriteFrame = resultFrames[result]
    // }
    // update (dt) {},
});
