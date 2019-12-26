// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var adsManager = require('AdsManager')
cc.Class({
    extends: require("BaseUtils"),

    properties: {
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

    // onLoad () {},
    dismiss() {
        if (!this.clickable) return
        this.clickable = false
        try {
            this.onDismiss()
        } catch (e) {

        }
        // cc.MainGame.dialogBg.active = false
        // cc.MainGame.resumeNodeAndDescendants(this.node)
        let delay = 0
        for (let i in this.node.children) {
            if (this.node.children[i].name === "DialogBg" || this.node.children[i].name === "DialogBg2") {
                delay = 0.3
                this.node.children[i].runAction(cc.fadeOut(0.3))
            }
            if (this.node.children[i].name === "Animbody" || this.node.children[i].name === "Seqanimbody") {
                delay = 0.4
                let action = cc.scaleTo(delay, 0)
                action.easing(cc.easeBackIn());
                this.node.children[i].runAction(action)
            }
        }
        this.scheduleOnce(function () {
            // this.node.active = false
            cc.dialogManager.recycler(this.node)
        }, delay)
    },
    show(parent) {
        this.clickable = true
        try {
            this.onShow()
        } catch (e) {

        }
        // cc.MainGame.dialogBg.active = true
        // cc.MainGame.pauseNodeAndDescendants(this.node)
        if (this.node.parent != null) {
            cc.dialogManager.recycler(this.node)
        }
        this.adsManager = require('AdsManager')
        parent.addChild(this.node)
        for (let i in this.node.children) {
            if (this.node.children[i].name === "DialogBg") {
                this.node.children[i].opacity = 0
                this.node.children[i].runAction(cc.fadeTo(0.3, 200))
            } else if (this.node.children[i].name === "DialogBg2") {
                this.node.children[i].opacity = 0
                this.node.children[i].runAction(cc.fadeIn(0.3))
            }
            if (this.node.children[i].name === "Animbody") {
                this.node.children[i].scaleX = 0
                this.node.children[i].scaleY = 0
                let action = cc.scaleTo(0.5, 1)
                action.easing(cc.easeElasticOut());
                this.node.children[i].runAction(action)
            } else if (this.node.children[i].name === "Seqanimbody") {
                let timeInterval = 0.6
                for (let j in this.node.children[i].children) {
                    this.node.children[i].scaleX = 1
                    this.node.children[i].scaleY = 1
                    this.node.children[i].children[j].scaleX = 0
                    this.node.children[i].children[j].scaleY = 0
                    this.node.children[i].children[j].stopAllActions()
                    this.scheduleOnce(function () {
                        let action = cc.scaleTo(timeInterval, 1)
                        action.easing(cc.easeElasticOut());
                        this.node.children[i].children[j].runAction(action)
                    }, 0.1 * j)
                }
            }
        }
    },
    setArgs(args) {
        this.args = args
    },
    start() {
    },

    // update (dt) {},
});
