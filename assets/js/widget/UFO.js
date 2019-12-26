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
    extends: cc.Component,

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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.timeInterval = 20
        this.scheduleOnce(function () {
            this.startAnim()
        }, this.timeInterval)
        let rep1 = cc.moveBy(1, 0, 100)
        let rep2 = cc.moveBy(1, 0, -100)
        let repeat = cc.repeatForever(cc.sequence(rep1, rep2))
        this.node.runAction(repeat)
    },
    startAnim() {
        let actions = []
        let rotationTime = 0.6
        let moveTime1 = 6
        let moveTime = 5
        actions.push(cc.rotateTo(rotationTime, 0))
        let actFirst = cc.moveBy(moveTime1, -1158, 0)
        actions.push(actFirst)
        for (let i = 0; i < 5; i++) {
            let ac1 = cc.rotateTo(rotationTime, 60)
            let ac2 = cc.moveBy(moveTime, 660, 0)
            let ac3 = cc.rotateTo(rotationTime, 0)
            let ac4 = cc.moveBy(moveTime, -660, 0)
            actions.push(ac1)
            actions.push(ac2)
            actions.push(ac3)
            actions.push(ac4)
        }
        actions.push(cc.rotateTo(rotationTime, 60))
        let actLast = cc.moveBy(moveTime1, 1158, 0)
        actions.push(actLast)
        let self=this
        let call = cc.callFunc(function () {
            self.finished()
        })
        actions.push(call)
        let action = cc.sequence(actions)
        this.node.runAction(action)
    },
    finished() {
        this.scheduleOnce(function () {
            this.startAnim()
        }, this.timeInterval)
    },
    onClick() {
        this.node.x = 828
        this.node.y = -1185
        this.node.stopAllActions()
        this.finished()
        let rep1 = cc.moveBy(1, 0, 100)
        let rep2 = cc.moveBy(1, 0, -100)
        let repeat = cc.repeatForever(cc.sequence(rep1, rep2))
        this.node.runAction(repeat)
        cc.dialogManager.showGameDialog(null, "GiftDialog")
    }
    // update (dt) {},
});
