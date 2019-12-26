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
        guides: [cc.Node],
        pos1_2: cc.Node,
        pos2_1: cc.Node,
        pos2_2: cc.Node,
        buyBtn: cc.Node,
        hand1: cc.Node,
        hand2: cc.Node,
        hand3: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.tempParent1
        this.tempParent2
        this.tempParent3
        this.counter = 0
    },
    setStep(step) {
        this.step = step
        let currentGuideNode
        let tempNode
        for (let index in this.guides) {
            if (index == `${step - 1}`) {
                currentGuideNode = this.guides[index]
                tempNode = currentGuideNode.children[2]
                currentGuideNode.active = true
            } else {
                this.guides[index].active = false
            }
        }
        switch (step) {
            case 1:
                //保存购买按钮的父节点
                this.tempParent1 = this.buyBtn.parent
                //将购买按钮的父节点设置为引导1
                this.buyBtn.parent = tempNode
                this.hand1.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.5, 1.2), cc.scaleTo(0.5, 0.82))))
                break
            case 2:
                //恢复购买按钮的原父节点
                this.buyBtn.parent = this.tempParent1
                //保存两个位置的父节点
                this.tempParent1 = this.pos2_1.parent
                this.tempParent2 = this.pos2_2.parent
                //将两个位置按钮的父节点设置为引导上
                this.pos2_1.parent = tempNode
                this.pos2_2.parent = tempNode
                this.hand2.runAction(cc.repeatForever(cc.sequence(cc.moveBy(0.7, -200, 0), cc.moveBy(0.1, 200, 0))))
                break
            case 3:
                //恢复位置节点的父节点
                this.pos2_1.parent = this.tempParent1
                this.pos2_2.parent = this.tempParent2
                this.pos2_1.setSiblingIndex(0)
                this.pos2_2.setSiblingIndex(1)
                //保存两个位置的父节点
                this.tempParent1 = this.pos2_1.parent
                //将两个位置按钮的父节点设置为引导上
                this.pos2_1.parent = tempNode
                this.hand3.runAction(cc.repeatForever(cc.sequence(cc.moveBy(0.7, 185, 235), cc.moveBy(0.1, -185, -235))))
                break
            case 4:
                Global.firstRun = false
                this.pos2_1.parent = this.tempParent1
                this.pos2_1.setSiblingIndex(0)
                this.node.active = false
                break
        }
    },
    execute() {
        this.counter++
        switch (this.step) {
            case 1:
                if (this.counter >= 2) {
                    this.counter = 0
                    this.setStep(2)
                }
                break
            case 2:
                if (this.counter >= 1) {
                    this.counter = 0
                    this.setStep(3)
                }
                break
            case 3:
                if (this.counter >= 1) {
                    this.counter = 0
                    this.setStep(4)

                }
                break
        }
    },
    // update (dt) {},
});
