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
        receiveStarDialog: cc.Prefab,
        storeDialog: cc.Prefab,
        offlineDialog: cc.Prefab,
        signDialog: cc.Prefab,
        turntableDialog: cc.Prefab,
        levelDialog: cc.Prefab,
        settingDialog: cc.Prefab,
        goldDialog: cc.Prefab,
        turntableResultDialog: cc.Prefab,
        promotionUpDialog: cc.Prefab,
        promotionAnimDialog: cc.Prefab,
        giftDialog: cc.Prefab,
        cannonDialog: cc.Prefab,
        speedUpDialog: cc.Prefab,
        autoMegraDialog: cc.Prefab,
        gifBoxDialog: cc.Prefab,
        confirmDialog: cc.Prefab,
        dialogNode: cc.Node,
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
    showGameDialogByArgs(name, args) {
        this.args = args
        this.showGameDialog(null, name)
    },
    showGameDialog(context, name) {
        let dialog
        let bean
        let jsName

        switch (name) {
            case "receiveStar":
                bean = this.receiveStarDialog
                jsName = "receiveStarDialog"
                break
            case "store":
                bean = this.storeDialog
                jsName = "StoreDialog"
                break
            case "offline":
                bean = this.offlineDialog
                jsName = "OfflineDialog"
                break
            case "sign":
                bean = this.signDialog
                jsName = "SignDialog"
                break
            case "setting":
                bean = this.settingDialog
                jsName = "SettingDialog"
                break
            case "turntable":
                bean = this.turntableDialog
                jsName = "TurntableDialog"
                break
            case "turntableResult":
                bean = this.turntableResultDialog
                jsName = "TurntableResultDialog"
                break
            case "gold":
                bean = this.goldDialog
                jsName = "GoldDialog"
                break
            case "level":
                bean = this.levelDialog
                jsName = "LevelDialog"
                break
            case "setting":
                bean = this.settingDialog
                jsName = "SettingDialog"
                break
            case "gold":
                bean = this.goldDialog
                jsName = "GoldDialog"
                break
            case "promotion":
                bean = this.promotionUpDialog
                jsName = "PromotionDialog"
                break
            case "promotionAnim":
                bean = this.promotionAnimDialog
                jsName = "PromotionAnimDialog"
                break
            case "gift":
                bean = this.giftDialog
                jsName = "GiftDialog"
                break
            case "cannon":
                bean = this.cannonDialog
                jsName = "CannonDialog"
                break
            case "speedUp":
                bean = this.speedUpDialog
                jsName = "SpeedUpDialog"
                break
            case "auto":
                bean = this.autoMegraDialog
                jsName = "AutoMegraDialog"
                break
            case 'giftBox':
                bean = this.gifBoxDialog
                jsName = "GiftBoxDialog"
                break
            case 'confirm':
                bean = this.confirmDialog
                jsName = "ConfirmDialog"
                break
        }
        for (let d of this.pool) {
            if (d.name === jsName) {
                dialog = d
            }
        }
        if (dialog == null) {
            dialog = cc.instantiate(bean)
            this.pool.push(dialog)
        }
        if (dialog != null) {
            if (this.args != null) {
                dialog.getComponent(jsName).setArgs(this.args)
                this.args = null
            }
            dialog.getComponent(jsName).show(this.dialogNode)
        }
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    loadPrefab(name, parentNode) {

        let self = this
        // 加载 Prefab
        cc.loader.loadRes(`prefabs/${name}`, function (err, prefab) {
            var dialog = cc.instantiate(prefab)
            if (self.args != null) {
                dialog.getComponent(name).setArgs(self.args)
                self.args = null
            }
            dialog.getComponent(name).show(self.dialogNode)
            self.dialogs.push(dialog)
        })
    },
    start() {
        this.dialogsPool = new Array()
        this.pool = new Array()
    },
    recycler(dialog) {
        dialog.parent = null
    },
    isOtherDialogShowing() {
        return this.dialogNode.childrenCount > 0
    },
    // update (dt) {},
});
