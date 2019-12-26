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
    extends: require("BaseDialog"),

    properties: {
        score: cc.Label,
        starCount: cc.Label,
        tabSpriteFrames: [cc.SpriteFrame],
        tab: cc.Sprite,
        cannonListNode: cc.Node,
        privilegeListNode: cc.Node,
        cannonListContent: cc.Node,
        privilegeListContent: cc.Node,
        cannonIten: cc.Prefab,
        privilegeItem: cc.Prefab,
        tabLab1: cc.Node,
        tabLab2: cc.Node,
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
        // cannonList: require('SVBetter'),
        // vipList: require('SVBetter'),
    },
    //切换标签
    changeTab(context, index) {
        index = parseInt(index)
        switch (index) {
            case 0:
                this.tab.spriteFrame = this.tabSpriteFrames[0]
                this.cannonListNode.active = true
                this.privilegeListNode.active = false
                this.tabLab1.color = new cc.color(255, 255, 255, 255);
                this.tabLab2.color = new cc.color(255, 255, 255, 70);
                break
            case 1:
                this.tab.spriteFrame = this.tabSpriteFrames[1]
                this.cannonListNode.active = false
                this.privilegeListNode.active = true
                this.tabLab1.color = new cc.color(255, 255, 255, 70);
                this.tabLab2.color = new cc.color(255, 255, 255, 255);
                break
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    },
    onShow() {
        this.score.string = this.formatScore(Global.userData.score)
        this.starCount.string = Global.userData.star
        if (this.cannonListContent.childrenCount == 0) {
            let cannons = cc.cannonFactory.cannonJson.json.cannons
            for (let i in cannons) {
                let cannonConfig = cannons[i]
                let cannon = cc.instantiate(this.cannonIten)
                cannon.getComponent("cannonItem").setConfig(i, cannonConfig)
                this.cannonListContent.addChild(cannon)
            }
            for (let j = 0; j < 18; j++) {
                let prefer = cc.instantiate(this.privilegeItem)
                prefer.getComponent("vipItem").setConfig(j)
                this.privilegeListContent.addChild(prefer)
            }
        } else {
            for (let cannon of this.cannonListContent.children) {
                cannon.getComponent("cannonItem").start()
            }
        }
        let self = this
        this.scoreListener = {
            key: 'score',
            call(params) {
                self.score.string = self.formatScore(params)
            }
        }
        this.starListener = {
            key: 'star',
            call(params) {
                self.starCount.string = params
            }
        }
        this.maxLevelListener = {
            key: 'maxLevel',
            call(params) {
                for (let cannon of self.cannonListContent.children) {
                    cannon.getComponent("cannonItem").start()
                }
            }
        }
        this.vipBuyListener = {
            key: 'vip',
            call(params) {
                if (params == 1) {//购买打折卡后要刷新商店价格
                    for (let cannon of self.cannonListContent.children) {
                        cannon.getComponent("cannonItem").start()
                    }
                }
                for (let cannon of self.privilegeListContent.children) {
                    cannon.getComponent("vipItem").start()
                }
            }
        }
        cc.observer.subscribe(this.scoreListener)
        cc.observer.subscribe(this.starListener)
        cc.observer.subscribe(this.maxLevelListener)
        cc.observer.subscribe(this.vipBuyListener)
    },
    onDismiss() {
        cc.observer.unsubscribe(this.scoreListener)
        cc.observer.unsubscribe(this.starListener)
        cc.observer.unsubscribe(this.maxLevelListener)
        cc.observer.unsubscribe(this.vipBuyListener)
    },
    start() {
        //不知道为啥不做延迟的话，第一个显示的列表会出现异常，估计是CC的bug？
        this.scheduleOnce(function () {
            this.changeTab(null, 0)
        }, 0)
    },

    // update (dt) {},
});
