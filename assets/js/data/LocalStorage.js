// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var ins = {
    /**
      * 初始化本地数据，用于首次运行将服务器数据同步到本地
      * @param {*} name key值
      */
    initObject(name, func) {
        this.net = require('NetApi')
        if (!this.read(name)) {
            let self = this
            this.net.getCannonJson(name, {
                success(result) {
                    let data = result.data
                    if (data.length > 0) {
                        let json = decodeURIComponent(data[0].json)
                        self.save(name, json)
                        if (func != null) func()
                    } else {
                        if (func != null) func()
                    }
                },
                failed(code, result) {
                    cc.log(code + ',' + result)
                }
            })
        } else {
            if (func != null) func()
        }
    },
    /**
     * 初始化Map型本地数据，用于首次运行将服务器数据同步到本地
     * @param {*} name 
     */
    initMap(name, func) {
        this.net = require('NetApi')
        let localMap = this.readMap(name)
        if (localMap.size == 0) {
            let self = this
            this.net.getCannonJson(name, {
                success(result) {
                    let data = result.data
                    if (data.length > 0) {
                        let json = decodeURIComponent(data[0].json)
                        self.save(name, json)
                        if (func != null) func()
                    } else {
                        if (func != null) func()
                    }
                },
                failed(code, result) {
                    cc.log(code + ',' + result)
                }
            })
        } else {
            if (func != null) func()
        }
    },
    save(name, obj) {
        if (typeof obj == 'string') {
            cc.sys.localStorage.setItem(name, obj)
            this.net.addCannonJson(name, obj)
        } else {
            cc.sys.localStorage.setItem(name, JSON.stringify(obj))
            this.net.addCannonJson(name, JSON.stringify(obj))
        }
    },
    saveMap(name, map) {
        if (typeof map == 'string') {
            cc.sys.localStorage.setItem(name, map)
            this.net.addCannonJson(name, map)
        } else {
            cc.sys.localStorage.setItem(name, JSON.stringify([...map]))
            this.net.addCannonJson(name, JSON.stringify([...map]))
        }
        // cc.sys.localStorage.setItem(name, JSON.stringify([...map]))
        // this.net.addCannonJson(name, JSON.stringify([...map]))
    },

    read(name) {
        let json = cc.sys.localStorage.getItem(name)
        if (json === null) {
            cc.log(`本地无${name}数据`)
            return null
        } else {
            let s
            try {
                s = JSON.parse(json)
            } catch (e) {
                return null
            }
            return s
        }
    },
    readMap(name) {
        let json = cc.sys.localStorage.getItem(name)
        let map
        if (json === null) {
            cc.log(`本地无${name}数据`)
            map = new Map()
        } else {
            try {
                map = new Map(JSON.parse(json))
            } catch (e) {
                map = new Map()
            }
        }
        return map
    },
}
module.exports = ins;