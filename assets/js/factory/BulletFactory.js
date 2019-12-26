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
        bulletPrefab: cc.Prefab,
        defaultPoolSize: 200,
        bulletFrames: [cc.SpriteFrame]
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
    initPool() {
        this.pool = new cc.NodePool("Bullet")
        for (let i = 0; i < this.defaultPoolSize; i++) {
            let bullet = cc.instantiate(this.bulletPrefab)
            this.pool.put(bullet)
        }
    },
    getBulletByLevel(level, attack) {
        if (this.pool == null) {
            cc.log("BulletFactory 未初始化")
            return
        }
        let bullet
        if (this.pool.size() > 0) {
            bullet = this.pool.get(this.pool)
        } else {
            bullet = cc.instantiate(this.bulletPrefab)
        }
        bullet.x = 0
        bullet.y = 0
        let bulletJs = bullet.getComponent("Bullet")
        bulletJs.setConfig(level, attack)
        bullet.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 1000)
        return bullet;
    },
    recycler(bullet) {
        bullet.children[0].angle = 0
        this.pool.put(bullet)
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.initPool()
    },

    // update (dt) {},
});
