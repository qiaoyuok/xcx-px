// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var localStorage = require('LocalStorage')
cc.Class({
    extends: require("BaseUtils"),

    properties: {
        coinBuyBtn: cc.Node,
        starBuyBtn: cc.Node,
        unBuyBtn: cc.Node,
        coinLabel: cc.Label,
        starLabel: cc.Label,
        icon: cc.Node,
        speedBar: cc.ProgressBar,
        attackBar: cc.ProgressBar,
        unknowIcon: cc.SpriteFrame
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
    setConfig(index, config) {
        this.index = parseInt(index)
        this.config = config
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    // updateUI(info) {
    //     this.config = info
    //     this.speedBar.progress = 0.05 / this.config.fireInterval
    //     this.attackBar.progress = Math.sqrt(this.config.attack) / 1000
    //     if (Global.userData.maxLevel < 6) {
    //         switch (this.config.index) {
    //             case 0:
    //                 this.showCoinBtn()
    //                 break
    //             case 1:
    //                 this.showStarBtn()
    //                 break
    //             case 2:
    //                 this.showStarBtn()
    //                 break
    //             default:
    //                 this.showUnBuyBtn()
    //         }
    //     } else {
    //         if (this.config.level < Global.userData.maxLevel - 4) {
    //             this.showCoinBtn()
    //         }
    //         // else if (this.config.level == Global.userData.maxLevel - 4) {
    //         //     this.showUnBuyBtn()
    //         // } 
    //         else if (this.config.level < Global.userData.maxLevel - 1) {
    //             this.showStarBtn()
    //         } else {
    //             this.showUnBuyBtn()
    //         }
    //     }
    // },
    start() {
        this.speedBar.progress = 0.05 / this.config.fireInterval
        this.attackBar.progress = Math.sqrt(this.config.attack) / 1000
        if (Global.userData.maxLevel < 6) {
            switch (this.index) {
                case 0:
                    this.showCoinBtn()
                    break
                case 1:
                    this.showStarBtn()
                    break
                case 2:
                    this.showStarBtn()
                    break
                default:
                    this.showUnBuyBtn()
            }
        } else {
            if (this.config.level < Global.userData.maxLevel - 4) {
                this.showCoinBtn()
            }
            // else if (this.config.level == Global.userData.maxLevel - 4) {
            //     this.showUnBuyBtn()
            // } 
            else if (this.config.level < Global.userData.maxLevel - 1) {
                this.showStarBtn()
            } else {
                this.showUnBuyBtn()
            }
        }
    },
    //显示金币购买按钮
    showCoinBtn() {
        this.icon.getComponent(cc.Sprite).spriteFrame = cc.cannonFactory.cannonFrames[this.config.level - 1]
        this.coinBuyBtn.active = true
        this.starBuyBtn.active = false
        this.unBuyBtn.active = false
        let buyCount = cc.MainGame.buyCountMap.get(this.config.level)
        this.price = cc.MainGame.getCannonPrice(this.config.level, buyCount) * Global.userData.preferByVip
        if (!buyCount) {
            cc.MainGame.buyCountMap.set(this.config.level, 0)
        }
        this.coinLabel.string = this.formatScore(Math.floor(this.price))
    },
    coinBuy() {
        if (Global.userData.score < this.price) {
            cc.MainGame.showToast("金币不足")
            return
        }
        if (cc.MainGame.addCannon(null, this.config.level)) {
            if (cc.MainGame.addScore(-this.price)) {
                this.showCoinBtn()
                cc.MainGame.setNextPrice()
                cc.MainGame.showToast("购买成功")
            }
        } else {
            cc.MainGame.showToast("购买失败，空位不足")
        }
    },
    //显示星星购买
    showStarBtn() {
        this.icon.getComponent(cc.Sprite).spriteFrame = cc.cannonFactory.cannonFrames[this.config.level - 1]
        this.coinBuyBtn.active = false
        this.starBuyBtn.active = true
        this.unBuyBtn.active = false
        let star = this.config.level - 2
        if (star < 3) star = 3
        this.starLabel.string = star
    },
    starBuy() {
        let star = this.config.level - 2
        if (star < 3) star = 3
        if (Global.userData.star < star) {
            cc.MainGame.showToast("星星不足")
            return
        }
        if (cc.MainGame.addCannon(null, this.config.level)) {
            cc.MainGame.addStar(-star)
            cc.MainGame.showToast("购买成功")
        } else {
            cc.MainGame.showToast("购买失败，空位不足")
        }
    },
    //显示不可用按钮
    showUnBuyBtn() {
        this.icon.getComponent(cc.Sprite).spriteFrame = this.unknowIcon
        this.speedBar.progress = 0
        this.attackBar.progress = 0
        this.coinBuyBtn.active = false
        this.starBuyBtn.active = false
        this.unBuyBtn.active = true
    },
    // update (dt) {},
});
