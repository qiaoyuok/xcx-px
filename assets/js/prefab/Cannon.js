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
        bulletSpeed: 3000,
        sound: {
            type: cc.AudioSource,
            default: null
        }
    },
    setConfig(level) {
        this.node.scaleX = 0
        this.node.scaleY = 0
        this.inited = true
        this.level = level;
        this.config = cc.cannonFactory.cannonJson.json.cannons[this.level - 1]
        this.node.getComponent(cc.Sprite).spriteFrame = cc.cannonFactory.cannonFrames[this.level - 1]
        let action = cc.scaleTo(0.3, 1)
        action.easing(cc.easeBackOut())
        this.node.runAction(action)
    },
    // LIFE-CYCLE CALLBACKS:
    setExploreConfig() {
        this.isExplore = true
    },
    onLoad() {
        this.time = 0
    },

    start() {
        if (!this.inited) cc.log("未初始化炮台")
    },
    update(dt) {
        if (!this.isExplore) {
            this.normalCannonUpdate(dt)
        } else {
            this.exploreCannonUpdate(dt)
        }
    },
    //普通模式下炮台的逻辑
    normalCannonUpdate(dt) {
        this.time += dt
        if (cc.touchAim.isTouch && this.position <= 4) {
            this.node.stopAllActions()
            this.targetNode = null
            let rotation = this.getTargetRotation(cc.touchAim.touchPos, this.node.parent)
            this.node.angle = -rotation
        }
        if (!this.inited) return
        if (this.time > this.config.fireInterval / cc.MainGame.getSpeed()) {
            this.time = 0
            if (cc.MainGame.pause) return
            if (!this.fire) return
            this.position = this.node.parent.getComponent("Position").position
            // this.position = parseInt(this.node.parent.name)
            if (this.position > 4) return
            if (!cc.touchAim.isTouch) {
                if (typeof (this.targetNode) == "undefined" || this.targetNode === null) {
                    this.findTarget()
                } else if (!this.targetNode.getComponent("Box").isTarget) {
                    this.findTarget()
                }
            }
            for (let i = 0; i < this.config.bulletCount; i++) {
                let bullet = cc.bulletFactory.getBulletByLevel(this.level, this.config.attack)
                let bulletRotation = -this.node.angle
                this.setSpeedByrotation(bulletRotation, bullet, this.bulletSpeed * (60 / cc.gameFrame))
                bullet.x = this.config.bulletPosX[i]
                bullet.y = this.node.height / 2 + this.config.bulletPosY[i]
                bullet.angle = 0
                this.node.addChild(bullet)
                bullet.parent = this.node.parent.parent
                bullet.setSiblingIndex(0)
            }
            this.playSound()
        }
    },
    //冒险模式下炮台的逻辑
    exploreCannonUpdate(dt) {
        this.time += dt
        if (cc.touchAim.isTouch) {
            this.node.stopAllActions()
            this.targetNode = null
            let rotation = this.getTargetRotation(cc.touchAim.touchPos, this.node.parent)
            this.node.angle = -rotation
        }
        if (!this.inited) return
        if (this.time > this.config.fireInterval) {
            this.time = 0
            for (let i = 0; i < this.config.bulletCount; i++) {
                let bullet = cc.bulletFactory.getBulletByLevel(this.level, this.config.attack)
                let bulletRotation = -this.node.angle
                this.setSpeedByrotation(bulletRotation, bullet, this.bulletSpeed)
                bullet.x = this.config.bulletPosX[i]
                bullet.y = this.node.height / 2 + this.config.bulletPosY[i]
                bullet.angle = 0
                this.node.addChild(bullet)
                bullet.parent = this.node.parent.parent
                bullet.setSiblingIndex(0)

            }
            this.playSound()
        }
    },
    //寻找最近的攻击目标
    findTarget() {
        let children = cc.boxFactory.boxsParentNode.children
        if (children.length == 0) return
        let minDistance = 1000000
        let minIndex = 0
        for (let i in children) {
            let box = children[i]
            let offsetX = box.x - this.node.parent.x
            let offsetY = box.y - this.node.parent.y
            let distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY)
            if (distance < minDistance) {
                minDistance = distance
                minIndex = i
            }
        }
        this.targetNode = children[minIndex]
        this.targetNode.getComponent("Box").isTarget = true
        let rotation = this.getTargetRotation(this.targetNode, this.node.parent)
        this.node.runAction(cc.rotateTo(0.5, rotation))
    },
    //通过角度计算出速度
    setSpeedByrotation(rotation, node, speed) {
        let speedX = Math.sin(rotation * Math.PI / 180)
        let speedY = Math.cos(rotation * Math.PI / 180)
        node.getComponent(cc.RigidBody).linearVelocity = cc.v2(speed * speedX, speed * speedY)//初始化速度
    },
    //获得方块的方向
    getTargetRotation(target, self) {
        let offsetX = target.x - self.x
        let offsetY = target.y - self.y
        let rotation = Math.atan(offsetY == 0 ? 0 : offsetX / offsetY) * 180 / Math.PI
        if (offsetY < 0) {
            rotation += 180
        }
        return rotation
    },
    stopFire() {
        this.fire = false
        try {
            this.targetNode.getComponent("Box").isTarget = false
        } catch (e) {

        }
    },
    startFire() {
        this.fire = true
    },
    levelUp() {
        let self = this
        let call = cc.callFunc(function () {
            self.setConfig(++self.level)
            cc.MainGame.savePosition(1, self.node)
            if (self.level > Global.userData.maxLevel) {
                cc.MainGame.maxLevelChanged(self.level)
            }
        })
        let ac = cc.sequence(cc.scaleTo(0.05, 0), call, cc.scaleTo(0.15, 1))
        this.node.runAction(ac)
    },
    playSound() {
        if (Global.userConfig.isSound)
            this.sound.play()
    },
});
