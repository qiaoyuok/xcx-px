var ins = {
    method: 'GET',
    userId: null,
    requestMinInterval: 5,
    XMLHttpRequestPool: [],
    baseUrl: 'https://api.928788.cn/',
    /**
    * 保存用户数据
         * @param {*} key 
         * @param {*} json 
         * @param {*} func 
         */
    addCannonJson(key, json, func) {
        key = key + this.getUserId()
        json = encodeURIComponent(json)
        this.request(`user/addCannonJson?key=${key}&json=${json}`, `addCannonJson${key}`, func)
    },
    /**
     * 获得用户数据
     * @param {*} key 
     * @param {*} func 
     */
    getCannonJson(key, func) {
        key = key + this.getUserId()
        this.request(`user/getCannonJson?key=${key}`, `getCannonJson${key}`, func)
    },

    /**
     * 广告日志发送
     * @param params
     * @param func
     */
    adLog(status,func){
        var userId =  this.getUserId()
        try {
            var wxgamecid = wx.getStorageSync('wxgamecid')
            if (!wxgamecid) {
                wxgamecid = 'default'
            }
        } catch (e) {
            // Do something when catch error
        }
        this.request(`ad-log/add-log?userId=${userId}&status=${status}&wxgamecid=${wxgamecid}`, "ok", func)
    },

    addUser(func) {
        if (cc.sys.localStorage.getItem('userId')) {
            func.success({
                data: {
                    openId: cc.sys.localStorage.getItem('userId')
                }
            })
            return
        }
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {//微信小游戏
            if (typeof tt != "undefined") {
                cc.log('申请头条授权')
                this.requestlogin(func)
            } else {
                this.wxlogin(func)
            }
        } else {
            if (!cc.sys.localStorage.getItem('userId')) {
                this.visitorlogin(func)
            }
        }
    },
    requestlogin(func) {
        let self = this
        wx.showModal({
            title: '登录提示',
            content: '是否允许使用您的账号登录？(游客账号有丢失游戏数据的风险！)',
            cancelText: '游客登录',
            confirmText: '允许',
            success: res => {
                if (res.cancel) {
                    self.visitorlogin(func)
                } else {
                    self.wxlogin(func)
                }
            }
        })
    },
    visitorlogin(func) {
        let openId = `visitor_${(new Date()).valueOf()}_${Math.floor(Math.random() * 10000)}`
        cc.log(`游客登录${openId}`)
        func.success({
            data: {
                openId: openId
            }
        })
    },
    wxlogin(func) {
        let self = this
        cc.log(`客户端登录`)
        wx.login({
            success: res => {
                if (typeof tt != "undefined") {
                    this.request(`user/addTTUser?code=${res.code}&anonymousCode=${res.anonymousCode}`, null, func)
                } else {
                    this.request(`user/addUser?code=${res.code}`, null, func)
                }
            },
            fail: res => {
                wx.showModal({
                    title: '登录失败',
                    content: '登录失败，将通过游客账号登录(游客账号有丢失游戏数据的风险！)',
                    cancelText: '重新授权',
                    confirmText: '游客登录',
                    success: res => {
                        if (res.cancel) {
                            self.wxlogin(func)
                        } else {
                            self.visitorlogin(func)
                        }
                    }
                })
            }
        })
    },
    /**
     * 从XMLHttpReuqest对象池中取出一个闲置对象，没有则创建一个
     */
    getXmlHttpRequest() {
        for (var i = 0; i < this.XMLHttpRequestPool.length; i++) {
            //如果XMLHttpReuqest的readyState为0，或者为4，   
            //都表示当前的XMLHttpRequest对象为闲置的对象   
            if (this.XMLHttpRequestPool[i].readyState == 0 ||
                this.XMLHttpRequestPool[i].readyState == 4) {
                return this.XMLHttpRequestPool[i]
            }
        }
        //如果没有空闲的，将再次创建一个新的XMLHttpRequest对象   
        this.XMLHttpRequestPool[this.XMLHttpRequestPool.length] = new XMLHttpRequest()
        //返回刚刚创建的XMLHttpRequest对象   
        return this.XMLHttpRequestPool[this.XMLHttpRequestPool.length - 1]
    },
    /**
     * 网络请求
     * @param {*} api 请求地址
     * @param {*} key 用于保存最短时间间隔数据，传null则表示接口没有限制
     * @param {*} func 回调对象
     */
    request(api, key, func) {
        if (!this.lastRequestTimeMap) this.lastRequestTimeMap = new Map()
        if (key != null && key !="ok") {
            let time = this.lastRequestTimeMap.get(key)
            if (time) {
                let offInterval = Date.parse(new Date()) - time
                if (offInterval < this.requestMinInterval * 60 * 1000) {
                    return
                }
            }
            cc.log(`同步---${key}---数据`)
            this.lastRequestTimeMap.set(key, Date.parse(new Date()))
        }

        if (key == 'ok'){
            this.baseUrl = "https://px.928788.cn/"
        }

        let xhr = this.getXmlHttpRequest()
        cc.log(`XMLHttpRequest--method:${this.method},url:${this.baseUrl + api}`)
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var response = xhr.responseText;
                let code = xhr.status
                if (code >= 200 && code < 400) {
                    let object = JSON.parse(response)
                    if (func != null)
                        func.success(object)
                    cc.log(`XMLHttpRequest--response:success:${response}`)
                } else {
                    cc.log(`XMLHttpRequest--response:failed:${response}`)
                    if (func != null) func.failed(code, response)

                }
            }
        }
        xhr.open('GET', this.baseUrl + api, true)
        xhr.send()
    },
    getUserId() {
        if (!this.userId) {
            this.userId = cc.sys.localStorage.getItem('userId')
        }
        return this.userId
    },
}
module.exports = ins;