cc.Class({
    extends: cc.Component,

    properties: {
        boxFrames: [cc.SpriteFrame],
        icon: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    setConfig(type) {
        this.type = type
        this.icon.getComponent(cc.Sprite).spriteFrame = this.boxFrames[type]
        this.icon.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.5, 1.3), cc.scaleTo(0.5, 1))))
        switch (type) {
            case 0://普通宝箱，一个炮台
                this.scheduleOnce(function () {
                    let parent = this.node.parent
                    this.node.parent = null
                    this.node.active = false
                    cc.MainGame.addCannon(null, -2, parent)
                }, 10)
                break
            case 1://豪华宝箱，4个炮台，需要看视频
                this.scheduleOnce(function () {
                    this.node.parent = null
                    this.node.active = false
                }, 20)
                break
        }
    },
    start() {

    },
    onClick() {
        switch (this.type) {
            case 0://普通宝箱，一个炮台
                let parent = this.node.parent
                this.node.parent = null
                this.node.active = false
                cc.MainGame.addCannon(null, -2, parent)
                break
            case 1://豪华宝箱，4个炮台，需要看视频
                this.node.parent = null
                this.node.active = false
                cc.dialogManager.showGameDialog(null, "GiftBoxDialog")
                break
        }
    },
    // update (dt) {},
});
