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
    //方块位置报警以及方块触碰到底部的判断
    properties: {
        warningNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.contactCount = 0
        this.warning = false
        this.gameOver = false
        this.failedCount = 0
    },
    onBeginContact(contact, self, other) {
        switch (self.tag) {
            case 99://警告线
                this.contactCount++
                if (!this.warning) {
                    this.warning = true
                    this.warningNode.active = true
                    this.warningNode.opacity = 0
                    this.warningNode.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(0.5, 150), cc.fadeTo(0.5, 0))))
                }
                break
            case 100://碰到底部
                this.contactCount++
                if (!this.gameOver) {
                    this.failedCount++
                    if (this.failedCount > 3) {
                        this.failedCount = 0
                        cc.MainGame.showPromotionDownDialog()
                    }
                    this.gameOver = true
                    //调用清除所有方块的方法
                    cc.boxFactory.clearAllBoxs()
                }
                break
        }
    },
    // 只在两个碰撞体结束接触时被调用一次
    onEndContact(contact, selfCollider, otherCollider) {
        switch (selfCollider.tag) {
            case 99://警告线
                this.contactCount--
                if (this.contactCount == 0) {
                    this.warning = false
                    this.warningNode.opacity = 0
                    this.warningNode.stopAllActions()
                    this.warningNode.active = false
                }
                break
            case 100://碰到底部
                this.contactCount--
                if (this.contactCount == 0) {
                    this.gameOver = false
                }
                break
        }
    },

    // update (dt) {},
});
