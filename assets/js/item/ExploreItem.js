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
        icon: cc.Node,
        locked: cc.Node,
        passed: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    setParent(parent) {
        this.parent = parent
    },
    setConfig(index, frame, level) {
        this.index = index
        this.currentLevel = level
        if (index < level) {
            this.locked.active = false
            this.passed.active = true
            this.icon.getComponent(cc.Sprite).spriteFrame = null
        } else if (index == level) {
            this.locked.active = false
            this.passed.active = false
            this.icon.getComponent(cc.Sprite).spriteFrame = frame
        } else {
            this.locked.active = true
            this.passed.active = false
            this.icon.getComponent(cc.Sprite).spriteFrame = null
        }
    },
    onClick() {
        if (this.index == this.currentLevel) {
            this.parent.toGame()
        }
    }
    // update (dt) {},
});
