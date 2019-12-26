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
    extends: require("BaseDialog"),

    properties: {
        starCount: cc.Label,
        residueDegree: cc.Label,
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

    // onLoad () {},

    start() {

    },
    onShow() {
        if (cc.MainGame.starReceviedMap.size == 0) {
            let starConfig = cc.MainGame.starReceiveConfig.json.star
            for (let i in starConfig) {
                cc.MainGame.starReceviedMap.set(starConfig[i].count, starConfig[i].times)
            }
        }
        this.setState()
    },
    setState() {
        for (var obj of cc.MainGame.starReceviedMap) {
            if (obj[1] > 0) {
                this.star = obj[0]
                this.starCount.string = "x" + obj[0]
                this.residueDegree.string = "x" + obj[1]
                return
            }
        }
        this.star = 0
        this.starCount.string = "x0"
        this.residueDegree.string = "x0"
    },
    receive() {
        if (!this.clickable) return
        if (this.star == 0) {
            cc.MainGame.showToast("今日免费星星领取次数已达上限")
        } else {
            this.adsManager.showAd({
                success: () => {
                    cc.MainGame.addStar(this.star)
                    cc.MainGame.starReceviedMap.set(this.star, cc.MainGame.starReceviedMap.get(this.star) - 1)
                    localStorage.saveMap('starReceive', cc.MainGame.starReceviedMap)
                    this.setState()
                },
                failed: () => {

                }
            })
        }
    }
    // update (dt) {},
});
