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
        touchMovehNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.levelCap = 30
        this.nextNodes = new Array();
        this.addTouchEvent()

    },
    addTouchEvent() {
        let lastX = 0
        let lastY = 0
        let positionCheckFunc = function () {
            if (this.node.x == lastX && this.node.y == lastY) {
                //不动了
                this.recover()
                this.node.off(cc.Node.EventType.TOUCH_MOVE, touchMove, this)
                this.unschedule(positionCheckFunc)
                cc.log('检测位置异常：true')
            } else {
                lastX = this.node.x
                lastY = this.node.y
                cc.log('检测位置异常：false')
            }
        }
        var touchStart = function (event) {
            this.touchx = event.touch.getLocationX();
            this.touchy = event.touch.getLocationY();
            this.node.getComponent("Cannon").stopFire()
            this.node.on(cc.Node.EventType.TOUCH_MOVE, touchMove, this)
            this.schedule(positionCheckFunc, 0.3)
        }
        var touchMove = function (event) {
            this.node.x = (this.node.x + event.touch.getLocationX() - this.touchx);
            this.node.y = (this.node.y + event.touch.getLocationY() - this.touchy);
            this.touchx = event.touch.getLocationX();
            this.touchy = event.touch.getLocationY();
        }
        var touchEnd = function touchEnd(event) {
            this.node.off(cc.Node.EventType.TOUCH_MOVE, touchMove, this)
            this.unschedule(positionCheckFunc)
            this.node.getComponent("Cannon").startFire();
            let thisPos = parseInt(this.node.parent.name)
            if (this.nextNodes.length > 0) {
                //碰撞过的位置列表
                var next = this.nextNodes[this.nextNodes.length - 1];
                var nextNode = this.nextNodes[this.nextNodes.length - 1].node;
                if (next.tag < 15) {
                    //坑的位置
                    var levelChildCount = next.tag > 4 ? 0 : 2;
                    if (nextNode.childrenCount > levelChildCount) {
                        //如果坑里面已经有人物，开始升级判定
                        var nodeChild = nextNode.children[next.tag > 4 ? 0 : 1];
                        if (nodeChild.group != 'cannon') {
                            //类型不同
                            this.recover()
                        } else if (nodeChild.getComponent("Cannon").level >= this.levelCap) {
                            //等级上限，无法提升
                            console.log("已经到达等级上限,无法升级");
                            this.recover()
                        } else if (nodeChild != this.node && nodeChild.getComponent("Cannon").level == this.node.getComponent("Cannon").level) {
                            //合成动画结束后的回调
                            cc.cannonFactory.recycler(this.node);
                            nodeChild.getComponent("Cannon").levelUp();
                            cc.MainGame.guideExecute()
                        } else {
                            //将当前节点与目标节点的炮台交换位置
                            this.node.stopAllActions()
                            nodeChild.stopAllActions()

                            nodeChild.parent = this.node.parent
                            this.node.parent = nextNode
                            nodeChild.setSiblingIndex(parseInt(nodeChild.parent.name) <= 4 ? 1 : 0)
                            this.node.setSiblingIndex(parseInt(this.node.parent.name) <= 4 ? 1 : 0)
                            cc.MainGame.savePosition(1, this.node);
                            cc.MainGame.savePosition(1, nodeChild);
                            let index = parseInt(this.node.parent.name)
                            this.node.angle = index > 4 ? -45 : 0;
                            this.node.x = index > 4 ? -39 : 0;
                            this.node.y = index > 4 ? -39 : 20;

                            index = parseInt(nodeChild.parent.name)
                            nodeChild.angle = index > 4 ? -45 : 0;
                            nodeChild.x = index > 4 ? -39 : 0;
                            nodeChild.y = index > 4 ? -39 : 20;
                        }
                    } else {
                        //没有人物
                        this.node.stopAllActions()
                        cc.MainGame.savePosition(0, this.node);
                        this.node.parent = null;
                        this.node.parent = nextNode
                        cc.MainGame.savePosition(1, this.node);
                        this.node.angle = next.tag > 4 ? -45 : 0;
                        this.node.x = next.tag > 4 ? -39 : 0;
                        this.node.y = next.tag > 4 ? -39 : 20;
                        this.node.setSiblingIndex(parseInt(this.node.parent.name) <= 4 ? 1 : 0)
                        this.node.runAction(cc.moveTo(0.3, next.tag > 4 ? -39 : 0, next.tag > 4 ? -39 : 20))
                        this.node.runAction(cc.rotateTo(0.3, next.tag > 4 ? 45 : 0))
                        cc.MainGame.guideExecute()
                        // this.control.game.savePosition();
                    }
                } else if (next.tag == 20) {
                    let level = this.node.getComponent("Cannon").level
                    let buyCount = cc.MainGame.buyCountMap.get(level)
                    let score = cc.MainGame.getCannonPrice(level, buyCount)
                    cc.dialogManager.showGameDialogByArgs('SellDialog', { _level: level, _score: score, _node: this.node })
                    this.recover()
                } else {
                    this.recover()
                }
            } else {
                this.recover()
            }
        };
        var touchCancel = (event) => {
            this.node.off(cc.Node.EventType.TOUCH_MOVE, touchMove, this)
            this.unschedule(positionCheckFunc)
            this.recover()
        }
        this.node.on(cc.Node.EventType.TOUCH_START, touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, touchCancel, this)
    },
    recover() {
        this.node.getComponent("Cannon").startFire();
        let thisPos = parseInt(this.node.parent.name)
        this.node.runAction(cc.moveTo(0.2, thisPos > 4 ? -39 : 0, thisPos > 4 ? -39 : 20));
    },
    /**
 * 获得当前等级炮台几个
 * @param {*} level 
 * @param {*} buyCount 已购买次数
 */
    getCannonPrice(level, buyCount) {
        let price
        if (!buyCount) {
            price = Math.pow(20, level - 1) * 100
            cc.MainGame.buyCountMap.set(level, 0)
        } else {
            price = Math.pow(20, level - 1) * 100 * Math.pow(1.07, buyCount)
        }
        return price
    },
    /**
    * 当碰撞产生的时候调用
    * @param  {Collider} other 产生碰撞的另一个碰撞组件
    * @param  {Collider} self  产生碰撞的自身的碰撞组件
    */
    onCollisionEnter(other, self) {
        if (this.nextNodes)
            this.nextNodes.push(other);
    },
    /**
    * 当碰撞结束后调用
    * @param  {Collider} other 产生碰撞的另一个碰撞组件
    * @param  {Collider} self  产生碰撞的自身的碰撞组件
    */
    onCollisionExit(other, self) {
        for (var i = 0; i < this.nextNodes.length; i++) {
            if (this.nextNodes[i] == other) {
                this.nextNodes.splice(i, 1);
            }
        }
    }
    // update (dt) {},
});
