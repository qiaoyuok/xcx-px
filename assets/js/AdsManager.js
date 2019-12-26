var ins = {
    showAd(callback) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            let adid = "adunit-588e66b132810f53"
            if (typeof tt != "undefined") {
                //今日头条小程序
                adid = '3j4805n43433n3xk45'
            } else {
                //微信小程序
            }
            let videoAd = wx.createRewardedVideoAd({
                adUnitId: adid
            })
            videoAd.onError(err => {
                console.log(err)
            })
            videoAd.show()
            videoAd.onClose(res => {
                console.log(res,222)
                if (res.isEnded) {
                    //发送广告日志
                    this.net = require('NetApi')
                    this.net.adLog(1, {
                        success(result) {
                            cc.log( result)
                        },
                        failed(code, result) {
                            cc.log(code + ',' + result)
                        }
                    })
                    callback.success()
                } else {
                    //发送广告日志
                    this.net = require('NetApi')
                    this.net.adLog(0, {
                        success(result) {
                            cc.log( result)
                        },
                        failed(code, result) {
                            cc.log(code + ',' + result)
                        }
                    })
                    callback.failed()
                }
                videoAd.offClose(this)
            })
        }
    }
}
module.exports = ins;