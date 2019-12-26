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
        cannonPrefab: cc.Prefab,
        defaultPoolSize: 30,
        cannonJson: cc.JsonAsset,
        cannonFrames: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.setJsonConfig(this.cannonJson)
    },
    setJsonConfig(jsonConfig) {
        this.config = jsonConfig.json.cannons;
        this.initPool()
    },
    initPool() {
        this.pool = new cc.NodePool("Cannon")
        for (let i = 0; i < this.defaultPoolSize; i++) {
            let cannon = cc.instantiate(this.cannonPrefab)
            this.pool.put(cannon)
        }
    },
    getCannonByLevel(level) {
        if (this.pool == null) {
            cc.log("CannonFactory 未初始化")
            return
        }
        let cannon
        if (this.pool.size() > 0) {
            cannon = this.pool.get(this.pool)
        } else {
            cannon = cc.instantiate(this.cannonPrefab)
        }
        let cannonJs = cannon.getComponent("Cannon")
        cannonJs.setConfig(level)
        return cannon;
    },
    recycler(cannon) {
        cannon.stopAllActions()
        cc.MainGame.savePosition(0, cannon)
        this.pool.put(cannon)
    }
    // update (dt) {},
});
