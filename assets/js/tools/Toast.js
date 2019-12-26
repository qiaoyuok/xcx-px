// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var toast = {
    /**
     * 
     * @param {*} node 传入当前页面的任意一个节点，方法会自动寻找最顶层父节点
     * @param {*} msg 内容
     */
    show(msg) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {//微信小游戏
            wx.showToast({
                title: msg,
                icon: 'none'
            })
        } else {
            let topNode = cc.find("Canvas")
            if (topNode == null) {
                cc.log('无法显示toast,请把顶层节点命名为Canvas')
                return
            }
            cc.loader.loadRes('toastBg', cc.SpriteFrame, (err, frame) => {
                if (err != null) {
                    cc.log('toast背景显示错误，请检查resources目录中是否存在toastBg文件')
                }
                let node = new cc.Node('Toast')
                if (frame != null) {
                    let sprite = node.addComponent(cc.Sprite)
                    sprite.type = cc.Sprite.Type.SLICED
                    sprite.spriteFrame = frame
                }
                let layout = node.addComponent(cc.Layout)
                layout.resizeMode = cc.Layout.ResizeMode.CONTAINER
                layout.padding = 40
                let message = new cc.Node('message')
                let label = message.addComponent(cc.Label)
                label.fontSize = 30
                label.lineHeight = 30
                label.string = msg
                node.addChild(message)
                layout.scheduleOnce(() => {
                    let call = cc.callFunc(() => {
                        node.removeFromParent(true)
                    })
                    node.runAction(cc.sequence(cc.spawn(cc.moveBy(0.4, 0, 50), cc.fadeTo(0.4, 0)), call))
                }, 2)
                topNode.addChild(node)
            })
        }
    }
};
module.exports = toast;