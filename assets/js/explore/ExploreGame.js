// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Storage = require('LocalStorage')
cc.Class({
    extends: require('BaseUtils'),

    properties: {
        bgm: {
            type: cc.AudioSource,
            default: null
        },
        cannon: cc.Node,
        star: cc.Label,
        level: cc.Label,
        coinAndStarAnimNode: cc.Node,
        camera: cc.Node,
        boxsParentNode: cc.Node,
        successDialog: cc.Prefab,
        failedDialog: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        cc.dialogManager.dialogNode = this.node
        cc.bulletFactory = this.node.getComponent("BulletFactory")
        cc.boxFactory = this.node.getComponent("ExploreBoxFactory")
        cc.cannonFactory = this.node.getComponent("CannonFactory")
        cc.boxFactory.setLevel(Global.explore.level + 1)
        cc.boxFactory.setGame(this)
        this.cannon.getComponent('Cannon').setConfig(Global.explore.level + 1)
        this.cannon.getComponent('Cannon').setExploreConfig()
        this.coinStarAnim = this.coinAndStarAnimNode.getComponent('CoinStarAnim')
        cc.MainGame = this
        this.boxCount = 70
        this.star.string = Global.userData.star
        this.level.string = `关卡${Global.explore.level + 1}`
        this.playBgm()
    },
    addScore(score) {

    },
    breakBox(node) {
        this.cameraShake(5)
        this.coinStarAnim.addPatchAnim(cc.v2(node.x, node.y))
        if (this.isSuccess()) {
            Global.explore.level += 1
            Storage.save('explore', Global.explore)
            this.success()
        }
    },
    isSuccess() {
        for (let node of this.boxsParentNode.children) {
            if (node.name == 'Box') {
                return false
            }
        }
        return true
    },
    back() {
        this.startScene('ExploreChoose', null)
    },
    success() {
        cc.dialogManager.showGameDialog(null, 'ExploreSuccessDialog')
    },
    failed() {
        cc.dialogManager.showGameDialog(null, 'ExploreFailedDialog')
    },
    //镜头震动效果
    cameraShake(range) {
        if (!Global.userConfig.isShake) return
        if (!this.camera) return
        if (this.camera.getNumberOfRunningActions() == 0) {
            if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                wx.vibrateShort();
            }
            let ac1 = cc.moveTo(0.02 + Math.random() * 0.03, -range + Math.random() * 2 * range, -range + Math.random() * 2 * range)
            let ac2 = cc.moveTo(0.02 + Math.random() * 0.03, -range + Math.random() * 2 * range, -range + Math.random() * 2 * range)
            let ac3 = cc.moveTo(0.02 + Math.random() * 0.03, -range + Math.random() * 2 * range, -range + Math.random() * 2 * range)
            let ac4 = cc.moveTo(0.02 + Math.random() * 0.03, -range + Math.random() * 2 * range, -range + Math.random() * 2 * range)
            let ac5 = cc.moveTo(0.02 + Math.random() * 0.03, 0, 0)
            this.camera.runAction(cc.sequence(ac1, ac2, ac3, ac4, ac5))
        }
    },
    playBgm() {
        if (Global.userConfig.isSound) {
            this.bgm.play()
        } else {
            this.bgm.stop()
        }
    },
    // update (dt) {},
});
