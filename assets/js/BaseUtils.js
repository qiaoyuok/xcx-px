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

    start() {

    },

    formatScore(score) {
        let temp = score
        let unit = ""
        let unitIndex = 0
        let unitString = ["", "K", "M", "B", "T", "F", "A", "C", "D", "Y", "S"]
        while (temp >= 100 * 10000) {
            unitIndex++
            temp = temp / 1000
        }
        try {
            unit = unitString[unitIndex]
        } catch (e) { }
        temp = parseInt(temp)
        return temp + unit
    },
    formatScore2(score) {
        let temp = score
        let unit = ""
        let unitIndex = 0
        let unitString = ["", "K", "M", "B", "T", "F", "A", "C", "D", "Y", "S"]
        while (temp >= 1000) {
            unitIndex++
            temp = temp / 1000
        }
        try {
            unit = unitString[unitIndex]
        } catch (e) { }
        temp = parseInt(temp)
        return temp + unit
    },
    getTodayDate() {
        var date = new Date();
        var year = date.getFullYear();//年
        var month = date.getMonth() + 1;//月
        var day = date.getDate();//日
        return parseInt(year + "" + (month < 10 ? `0${month}` : month) + "" + (day < 10 ? `0${day}` : day))
    },
    startScene(name, action) {
        let func = cc.callFunc(
            function () {
                cc.director.loadScene(name);
            }
        )
        if (!action) {
            action = cc.sequence(cc.fadeOut(0.4), func);
        }
        this.node.runAction(action);
    },
    /**
 * 显示toast
 * @param {*} msg 
 */
    showToast(msg) {
        require('Toast').show(msg)
    },
});
