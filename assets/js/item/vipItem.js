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
    extends: require("BaseUtils"),

    properties: {
        attackIcon: cc.Node,
        preferIcon: cc.Node,
        vipname: cc.Label,
        percentLab: cc.Label,
        instroduce: cc.Label,
        priceLab: cc.Label,
        buyBtn: cc.Node,
        unbuyBtn: cc.Node,
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
    setConfig(index) {
        this.index = index
    },
    onLoad() {
        this.pencents = [
            5, 5,
            15, 10,
            25, 20,
            35, 40,
            50, 70,
            55, 110,
            60, 160,
            65, 225,
            70, 500]
        this.level = Math.floor(this.index / 2) + 1

    },
    start() {
        if (this.index % 2 == 0) {
            this.attackIcon.active = false
            this.preferIcon.active = true
            this.vipname.string = `打折卡(lv${this.level})`
            this.instroduce.string = `所有机甲降价${this.pencents[this.index]}%`
            if (this.level == Global.userData.vipPreferBuyCount + 1) {
                //可购买
                this.buyBtn.active = true
                this.unbuyBtn.active = false
            } else if (Global.userData.vipPreferBuyCount >= this.level) {
                //已购买
                this.buyBtn.active = false
                this.unbuyBtn.active = true
                this.unbuyBtn.children[0].active = true
            } else {
                //前置未购买
                this.buyBtn.active = false
                this.unbuyBtn.active = true
                this.unbuyBtn.children[0].active = false
            }
        } else {
            this.attackIcon.active = true
            this.preferIcon.active = false
            this.vipname.string = `强化卡(lv${this.level})`
            this.instroduce.string = `所有机甲攻击力提升${this.pencents[this.index]}%`
            if (this.level == Global.userData.vipAttackBuyCount + 1) {
                //可购买
                this.buyBtn.active = true
                this.unbuyBtn.active = false
            } else if (Global.userData.vipAttackBuyCount >= this.level) {
                //已购买
                this.buyBtn.active = false
                this.unbuyBtn.active = true
                this.unbuyBtn.children[0].active = true
            } else {
                //前置未购买
                this.buyBtn.active = false
                this.unbuyBtn.active = true
                this.unbuyBtn.children[0].active = false
            }
        }
        this.percentLab.string = `${this.pencents[this.index]}%`
        this.price = Math.pow(4500, this.level)
        this.priceLab.string = this.formatScore(this.price)
    },
    buy() {
        if (cc.MainGame.addScore(-this.price)) {
            this.showToast('购买成功！')
            if (this.index % 2 == 0) {
                //打折卡
                Global.userData.vipPreferBuyCount++
                Global.userData.preferByVip = (100 - this.pencents[this.index]) / 100.0
                cc.observer.call('vip', 1)
            } else {
                //强化卡
                Global.userData.vipAttackBuyCount++
                Global.userData.attacKByVip = (100 + this.pencents[this.index]) / 100.0
                cc.observer.call('vip', 0)
            }
            cc.MainGame.saveUserData()
        } else {
            this.showToast('金币不足！')
        }
    }
    // update (dt) {},
});
