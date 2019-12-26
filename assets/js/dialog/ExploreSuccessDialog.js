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
        starCount: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    single() {
        if (!this.clickable) return
        Global.userData.star += 10
        cc.director.loadScene("ExploreChoose")
    },
    double() {
        if (!this.clickable) return
        this.adsManager.showAd({
            success: () => {
                Global.userData.star += 20
                cc.director.loadScene("ExploreChoose")
            },
            failed: () => {

            }
        })

    },
    // update (dt) {},
});
