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
        sprite: cc.Node
    },
    setConfig(level, attack) {
        this.sprite.getComponent(cc.Sprite).spriteFrame = cc.bulletFactory.bulletFrames[level - 1]
        this.attack = attack
        this.func = function () {
            cc.bulletFactory.recycler(this.node)
        }
        this.scheduleOnce(this.func, 5)
    },
    onBeginContact(contact, self, other) {
        switch (other.tag) {
            case 1://方块
                other.node.getComponent("Box").attacked(Math.floor(this.attack * Global.userData.attackByPromotionUp * Global.userData.attacKByVip))
                break
            case 3://地面
                this.unschedule(this.func)
                cc.bulletFactory.recycler(self.node)
                break
            default:
                this.setSpeedByrotation()
        }
    },
    // 只在两个碰撞体结束接触时被调用一次
    onEndContact(contact, selfCollider, otherCollider) {
        if (otherCollider.tag != 3) {
            let rotation = this.getRotationBySpeed(selfCollider.body.linearVelocity)
            selfCollider.node.children[0].angle = -(rotation + this.node.angle)
        }
    },

    // LIFE-CYCLE CALLBACKS:
    setSpeedByrotation() {

    },
    //获得玩家的方向
    getRotationBySpeed(speed) {
        let offsetX = speed.x
        let offsetY = speed.y
        let rotation = Math.atan(offsetY == 0 ? 0 : offsetX / offsetY) * 180 / Math.PI
        if (offsetY < 0) {
            rotation += 180
        }
        return rotation
    },
    // onLoad () {},

    start() {

    },

    // update (dt) {},
});
