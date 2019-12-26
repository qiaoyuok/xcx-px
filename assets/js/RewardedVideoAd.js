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

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        let self = this
        let SDKVersion = wx.getSystemInfoSync()
        cc.log(`微信SDKVersion:${SDK}`)
        // wx.createRewardedVideoAd(Object object)

        RewardedVideoAd.load()
        this.onError = function (errMsg, errCode) {
            wx.showToast({
                title: `广告播放失败,错误码:${errCode}，原因:${errMsg}`,
                icon: 'none'
            })
            self.fn.onError(errMsg, errCode)
        }
        this.onClose = function (isEnded) {
            self.fn.onClose(isEnded)
        }
    },
    show(fn) {
        this.fn = fn
        RewardedVideoAd.show()
        RewardedVideoAd.onError(this.onError)
        RewardedVideoAd.onError(this.onClose)
    }
    // update (dt) {},
});
