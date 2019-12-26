cc.Class({
    extends: cc.Component,

    properties: {
        aimIcon: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        if (!cc.touchAim) {
            cc.touchAim = {
                isTouch: false,
                touchPos: cc.v2(0, 0)
            }
        }
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this)
    },
    _onTouchStart(touchEvent) {
        cc.touchAim.isTouch = true
        this.aimIcon.active = true
        this.world = this.node.convertToNodeSpaceAR(cc.v2(0, 0))
        let pos = touchEvent.touch._point
        this.aimIcon.x = pos.x + this.world.x
        this.aimIcon.y = pos.y + this.world.y
        cc.touchAim.touchPos = cc.v2(this.aimIcon.x, this.aimIcon.y)
    },
    _onTouchEnd(touchEvent) {
        cc.touchAim.isTouch = false
        this.aimIcon.active = false
        this.aimIcon.x = this.world.x
        this.aimIcon.y = this.world.y
    },
    _onTouchMove(touchEvent) {
        let pos = touchEvent.touch._point
        let x = pos.x + this.world.x
        let y = pos.y + this.world.y
        if (x < -540 || x > 540 || y < (-this.node.height) || y > 0) {
            this.aimIcon.active = false
            cc.touchAim.isTouch = false
        } else {
            this.aimIcon.active = true
            cc.touchAim.isTouch = true
            cc.touchAim.touchPos = cc.v2(x, y)
        }
        this.aimIcon.x = x
        this.aimIcon.y = y
        // this.playerFrame.rotation = rotation - this.player.rotation
        // let speedX = Math.sin(rad) * (node.x >= 0 ? 1 : -1)
        // let speedY = Math.cos(rad) * (node.y >= 0 ? 1 : -1)
        // this.player.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.playerbBulletSpeed * speedX, this.playerbBulletSpeed * speedY)//初始化速度
    },
    // update (dt) {},
});
