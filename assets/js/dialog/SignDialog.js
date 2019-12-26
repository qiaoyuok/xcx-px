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
        signList: cc.Node,
        signed: cc.Node,
        unsigned: cc.Node
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
        this.signStarCount = [5, 7, 10, 15, 20, 30, 40]
        this.currentDate = this.getTodayDate()
        this.initSignState()
    },
    initSignState() {
        if (this.currentDate > Global.userData.lastSignDate) {
            this.signed.active = false
            this.unsigned.active = true
            if (Global.userData.signDays >= 7) {
                Global.userData.signDays = 0
            }
        } else {
            this.signed.active = true
            this.unsigned.active = false
        }
        for (let i = 0; i < Global.userData.signDays; i++) {
            this.signList.children[i].children[1].active = true
        }
    },
    sign() {
        if (!this.clickable) return
        cc.MainGame.addStar(this.signStarCount[Global.userData.signDays])
        Global.userData.signDays++
        Global.userData.lastSignDate = this.currentDate
        this.initSignState()
        cc.MainGame.saveUserData()
    },
    signDouble() {
        if (!this.clickable) return
        this.adsManager.showAd({
            success: () => {
                cc.MainGame.addStar(this.signStarCount[Global.userData.signDays] * 2)
                Global.userData.signDays++
                Global.userData.lastSignDate = this.currentDate
                this.initSignState()
                cc.MainGame.saveUserData()
            },
            failed: () => {

            }
        })
    }
    // update (dt) {},
});
