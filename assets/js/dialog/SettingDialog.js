// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var localStorage = require('LocalStorage')
cc.Class({
    extends: require("BaseDialog"),

    properties: {
        shakeFrames: [cc.SpriteFrame],
        soundFrames: [cc.SpriteFrame],
        shakeSprite: cc.Sprite,
        soundSprite: cc.Sprite
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

    },

    start() {

    },
    onShow() {
        this.setShakeFrame()
        this.setSoundFrame()
    },
    setShakeFrame() {
        if (!Global.userConfig.isShake) {
            this.shakeSprite.spriteFrame = this.shakeFrames[0]
        } else {
            this.shakeSprite.spriteFrame = this.shakeFrames[1]
        }
    },
    setSoundFrame() {
        if (!Global.userConfig.isSound) {
            this.soundSprite.spriteFrame = this.soundFrames[0]
        } else {
            this.soundSprite.spriteFrame = this.soundFrames[1]
        }
    },
    shakeClick() {
        if (!this.clickable) return
        Global.userConfig.isShake = !Global.userConfig.isShake
        this.setShakeFrame()
        localStorage.save('userConfig', Global.userConfig)
    },
    soundClick() {
        if (!this.clickable) return
        Global.userConfig.isSound = !Global.userConfig.isSound
        cc.MainGame.playBgm()
        this.setSoundFrame()
        localStorage.save('userConfig', Global.userConfig)
    },
    // update (dt) {},
});
