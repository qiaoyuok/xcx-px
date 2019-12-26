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
        countDownLabel: cc.Label,
        positionNode: cc.Node
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

    onLoad() {
        this.time = 0
    },

    start() {

    },
    freshAutoMegraCountDown() {
        let remain = (Global.userData.autoMegraEndTime - Date.parse(new Date())) / 1000
        if (remain > 0) {
            let m = Math.floor(remain / 60)
            let s = remain % 60
            this.countDownLabel.string = (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s)
            this.megra()
        } else {
            this.node.active = false;
        }
    },
    megra() {
        for (let i = 0; i < this.positionNode.childrenCount; i++) {
            let position1 = this.positionNode.children[i]
            if (position1.childrenCount > 0 && position1.children[0].group === "cannon") {
                for (let j = i + 1; j < this.positionNode.childrenCount; j++) {
                    let position2 = this.positionNode.children[j]
                    if (position2.childrenCount > 0 && position2.children[0].group === "cannon") {
                        let cannon1 = position1.children[0]
                        let cannon2 = position2.children[0]
                        if (cannon1.getComponent("Cannon").level < 30 && cannon1.getComponent("Cannon").level == cannon2.getComponent("Cannon").level) {
                            let ac = cc.moveBy(0.3, cannon1.parent.x - cannon2.parent.x, cannon1.parent.y - cannon2.parent.y)
                            ac.easing(cc.easeBackIn())
                            let call = cc.callFunc(function () {
                                cc.cannonFactory.recycler(cannon2)
                                cannon1.getComponent("Cannon").levelUp()
                            })
                            let action = cc.sequence(ac, call)
                            cannon2.runAction(action)
                            return
                        }
                    }
                }
            }
        }
    },
    update(dt) {
        this.time += dt
        if (this.time > 1) {
            this.time = 0
            this.freshAutoMegraCountDown()
        }
    },
    // update (dt) {},
});
