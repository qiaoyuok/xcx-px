// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var netApi = require('NetApi')
var localStorage = require('LocalStorage')
cc.Class({
    extends: require("BaseUtils"),

    properties: {
        progressBar: cc.ProgressBar
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

    onLoad() {
        cc.gameFrame = 30
        cc.game.setFrameRate(cc.gameFrame)
        var params = wx.getLaunchOptionsSync();
        console.log(params,333)
        if (params.query.hasOwnProperty('wxgamecid')){
            try {
                wx.setStorageSync('wxgamecid',params.query.wxgamecid)
            } catch (e) { }
        }else{
            wx.setStorageSync('wxgamecid',"default")
        }
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            let imgeUrl
            if (typeof tt != "undefined") {
                imgeUr = 'https://sf1-ttcdn-tos.pstatp.com/img/developer/app/ttd2e9a4544dc311c3/si893c33b~noop.image'
            } else {

            }
            if (imgeUrl != null)
                wx.onShareAppMessage(() => {
                    return {
                        title: '我已达到最高段位，一起来玩耍吧！',
                        imageUrl: imgeUr
                    }
                })
        }
        this.tryTime = 0
    },
    showLoadFailed() {
        if (typeof tt != "undefined") {

        } else {
            wx.showModal({
                title: '提示',
                content: '游戏数据获取失败，手动关闭后再试',
                showCancel: false,
                success: (res) => {
                    wx.clearStorageSync()
                },
            })
        }
    },
    waitUserData() {
        let self = this
        self.scheduleOnce(function () {
            if (Global.userData == null) {
                self.tryTime++
                if (self.tryTime > 20) {
                    self.showLoadFailed()
                } else {
                    self.waitUserData()
                }
            } else {
                self.startScene('game', null)
            }
        }, 0.5)
    },
    start() {
        let self = this
        let onProgress = function (completedCount, totalCount, item) {
            self.progressBar.progress = completedCount / totalCount
        }
        let onLoaded = function (error, asset) {
            if (Global.userData == null) {
                self.waitUserData()
            } else {
                self.startScene('game', null)
            }
        }
        cc.director.preloadScene("game", onProgress, onLoaded)

        cc.log('获取userId')
        netApi.addUser({
            success(result) {
                if (result != null) {
                    cc.log(`微信userId:${result.data.openId}`)
                    cc.sys.localStorage.setItem('userId', result.data.openId)
                    localStorage.initObject('userData', () => {
                        self.initUserData()
                    })
                    localStorage.initObject('explore')
                    localStorage.initMap('position')
                    localStorage.initMap('buyCount')
                    localStorage.initMap('starReceive')
                    Global.explore = localStorage.read('explore')
                    self.readUserConfig()
                } else {
                    cc.log('注册失败')
                }
            },
            failed(code, result) {
                cc.log(code + ',' + result)
            }
        })
    },
    /**
    * 用户设置
    */
    readUserConfig() {
        Global.userConfig = {}
        let userConfig = localStorage.read('userConfig')
        let firstRun = (userConfig === null)
        Global.userConfig.isShake = (firstRun || userConfig.isShake == null) ? true : userConfig.isShake
        Global.userConfig.isSound = (firstRun || userConfig.isSound == null) ? true : userConfig.isSound
    },
    /**
     * 初始化用户数据 userData
     */
    initUserData() {
        Global.userData = {}
        let callback = {
            _score: {
                set(newValue) {
                    this.score = newValue
                    cc.observer.call('score', newValue)
                },
                get() {
                    return this.score
                }
            },
            _star: {
                set(newValue) {
                    this.star = newValue
                    cc.observer.call('star', newValue)
                },
                get() {
                    return this.star
                }
            },
            _maxLevel: {
                set(newValue) {
                    this.maxLevel = newValue
                    cc.observer.call('maxLevel', newValue)
                },
                get() {
                    return this.maxLevel
                }
            }
        }
        Object.defineProperties(Global.userData, callback)
        let userData = localStorage.read('userData')
        let firstRun = (userData === null)//数据为null即为首次运行
        Global.firstRun = firstRun
        /*游戏配置参数 Start*/
        Global.userData.signDays = (firstRun || !userData.signDays) ? 0 : userData.signDays//签到天数
        Global.userData.lastSignDate = (firstRun || !userData.lastSignDate) ? 0 : userData.lastSignDate//最后一次签到时间
        Global.userData.promotion = (firstRun || !userData.promotion) ? 0 : userData.promotion//当前段位 0开始
        Global.userData.score = (firstRun || !userData.score) ? 500 : userData.score//当前金币数
        Global.userData.star = (firstRun || !userData.star) ? 0 : userData.star//当前星星数
        Global.userData.maxLevel = (firstRun || !userData.maxLevel) ? 0 : userData.maxLevel//最高大炮等级
        Global.userData.speedUpEndTime = (firstRun || !userData.speedUpEndTime) ? 0 : userData.speedUpEndTime//加速--结束时间戳
        Global.userData.autoMegraEndTime = (firstRun || !userData.autoMegraEndTime) ? 0 : userData.autoMegraEndTime//自动合并--结束时间戳
        Global.userData.fiveTimesIncomeEndTime = (firstRun || !userData.fiveTimesIncomeEndTime) ? 0 : userData.fiveTimesIncomeEndTime//5倍收益--结束时间戳
        Global.userData.savingPotCoinCount = (firstRun || !userData.savingPotCoinCount) ? 0 : userData.savingPotCoinCount//金罐中 金币数量
        Global.userData.lastSyncTime = (firstRun || !userData.lastSyncTime) ? Date.parse(new Date()) : userData.lastSyncTime//最后一次同步时间，用来计算离线奖励
        Global.userData.turntableFreeCount = (firstRun || !userData.turntableFreeCount) ? 3 : userData.turntableFreeCount//幸运转盘免费时间
        Global.userData.lastTurntableDate = (firstRun || !userData.lastTurntableDate) ? 3 : userData.lastTurntableDate//幸运转盘最后一次时间
        Global.userData.lastReceiveStarData = (firstRun || !userData.lastReceiveStarData) ? 3 : userData.lastReceiveStarData//最后一次领取星星时间
        Global.userData.attackByPromotionUp = (firstRun || !userData.attackByPromotionUp) ? 1 : userData.attackByPromotionUp//段位提升获得的攻击力增加率
        Global.userData.attacKByVip = (firstRun || !userData.attacKByVip) ? 1 : userData.attacKByVip//vip提升获得的攻击力增加率
        Global.userData.vipPreferBuyCount = (firstRun || !userData.vipPreferBuyCount) ? 0 : userData.vipPreferBuyCount//vip打折卡购买次数
        Global.userData.vipAttackBuyCount = (firstRun || !userData.vipAttackBuyCount) ? 0 : userData.vipAttackBuyCount//vip强化卡购买次数
        Global.userData.preferByVip = (firstRun || !userData.vipAttackBuyCount) ? 1 : userData.vipAttackBuyCount//折扣
        /*游戏配置参数End */
    },
    // update (dt) {},
})