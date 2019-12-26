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
        timeLabel: cc.Label,
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

    // onLoad() {

    // },

    start() {

    },
    onShow() {
        this.time = 0
        this.showSpeedUpAnim = false
        this.freshProgress()
    },
    speedUpFree() {
        if (!this.clickable) return
        this.adsManager.showAd({
            success: () => {
                this.addSpeedUp()
            },
            failed: () => {

            }
        })
    },
    speedUpByStar() {
        if (!this.clickable) return
        if (cc.MainGame.addStar(-3)) {
            this.addSpeedUp()
        }
    },
    addSpeedUp() {
        /*此逻辑下，加速时间不会叠加 */
        Global.userData.speedUpEndTime = Date.parse(new Date()) + 150 * 1000

        /*此逻辑下，加速时间会叠加 */
        // if (Global.userData.speedUpEndTime < Date.parse(new Date())) {
        //     //加速已经过期
        //     Global.userData.speedUpEndTime = Date.parse(new Date()) + 150 * 1000
        // } else {
        //     //加速未过期
        //     Global.userData.speedUpEndTime += 150 * 1000
        // }

        this.dismiss()
        cc.dialogManager.showGameDialogByArgs("TurntableResultDialog", 6)
        // /*刷新倒计时*/
        // this.freshProgress()
    },
    onDismiss() {

    },
    freshProgress() {
        let remain = (Global.userData.speedUpEndTime - Date.parse(new Date())) / 1000
        if (remain > 0) {
            let m = Math.floor(remain / 60)
            let s = remain % 60
            this.timeLabel.string = (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s)
            this.progressBar.progress = remain / 150
        } else {
            this.timeLabel.string = "00:00"
            this.progressBar.progress = 0
        }
    },
    update(dt) {
        this.time += dt
        if (this.time > 1) {
            this.time = 0
            this.freshProgress()
        }
    },
});
