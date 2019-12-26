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
        gold: cc.Prefab,
        star: cc.Prefab,
        boxPatch: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.goldPool = new cc.NodePool("gold")
        this.starPool = new cc.NodePool("star")
        this.boxPatchPool = new cc.NodePool('boxPatch')
        for (let i = 0; i < 50; i++) {
            this.goldPool.put(cc.instantiate(this.gold))
            this.starPool.put(cc.instantiate(this.star))
            this.boxPatchPool.put(cc.instantiate(this.boxPatch))
        }
    },
    /**
     * 方块碎片动画
     * @param {*} position 
     */
    addPatchAnim(position) {
        let self = this
        let count = 2 + Math.floor(Math.random() * 2)
        for (let i = 0; i < count; i++) {
            let patch = this.getPatch()
            patch.x = position.x
            patch.y = position.y
            this.node.addChild(patch)
            let time = 0.3 + Math.random() * 0.7
            let ac1 = cc.moveBy(time, - 500 + Math.random() * 1000, - 500 + Math.random() * 1000)
            let ac2 = cc.fadeOut(time)
            let ac3 = cc.rotateBy(time, -720 + Math.random() * 1440)
            let action = cc.spawn(ac1, ac2, ac3)
            action.easing(cc.easeSineOut())
            let callFunc = cc.callFunc(function () {
                self.recyclerPatch(patch)
            })
            let actions = cc.sequence(action, callFunc)
            patch.runAction(actions)
        }
    },
    /**
     * 
     * @param {*} position 
     * @param {*} type 1获得金币 2存入金罐
     */
    AddGoldAnim(position, type) {
        let self = this
        let count = 2 + Math.floor(Math.random() * 2)
        let target
        switch ((type)) {
            case 1:
                target = cc.v2(0, 75)
                break;
            case 2:
                target = cc.v2(-326, 75)
                break
            default:
                target = cc.v2(0, 75)
                break;
        }
        for (let i = 0; i < count; i++) {
            let time = 0.6 + Math.random() * 0.4
            let gold = this.getGold()
            if (position == null) {
                gold.x = 0
                gold.y = -600
                time = time * 1.5
            } else {
                gold.x = position.x
                gold.y = position.y
            }
            this.node.addChild(gold)
            var bezier = [cc.v2(gold.x, gold.y), cc.v2(gold.x - 400 + Math.random() * 800, gold.y - 400 + Math.random() * 800), target]
            var bezierTo = cc.bezierTo(time, bezier)
            bezierTo.easing(cc.easeSineOut())
            let ac2 = cc.fadeOut(time)
            let action = cc.spawn(bezierTo, ac2)
            let callFunc = cc.callFunc(function () {
                self.recyclerGold(gold)
            })
            gold.runAction(cc.sequence(action, callFunc))
        }
    },
    addStarAnim(position) {
        let self = this
        let count = 4 + Math.floor(Math.random() * 6)
        let target = cc.v2(258, 75)
        for (let i = 0; i < count; i++) {
            let time = 1 + Math.random() * 0.4
            let star = this.getStar()
            if (position == null) {
                star.x = 0
                star.y = -600
                time = time * 1.5
            } else {
                star.x = position.x
                star.y = position.y
            }
            this.node.addChild(star)
            var bezier = [cc.v2(star.x, star.y), cc.v2(star.x - 400 + Math.random() * 800, star.y - 400 + Math.random() * 800), target]
            var bezierTo = cc.bezierTo(time, bezier)
            bezierTo.easing(cc.easeSineOut())
            let ac2 = cc.fadeTo(time, 100)
            let action = cc.spawn(bezierTo, ac2)
            let callFunc = cc.callFunc(function () {
                self.recyclerStar(star)
            })
            star.runAction(cc.sequence(action, callFunc))
        }
    },
    getPatch() {
        let patch
        if (this.boxPatchPool.size() > 0) {
            patch = this.boxPatchPool.get(this.boxPatchPool)
        } else {
            patch = cc.instantiate(this.boxPatch)
        }
        patch.opacity = 255
        let scale = 1 + Math.random() * 3
        patch.scaleX = scale
        patch.scaleY = scale
        return patch
    },
    getGold() {
        let gold
        if (this.goldPool.size() > 0) {
            gold = this.goldPool.get(this.goldPool)
        } else {
            gold = cc.instantiate(this.gold)
        }
        gold.opacity = 255
        return gold
    },
    getStar() {
        let star
        if (this.starPool.size() > 0) {
            star = this.starPool.get(this.starPool)
        } else {
            star = cc.instantiate(this.star)
        }
        star.opacity = 255
        return star
    },
    recyclerGold(gold) {
        this.goldPool.put(gold)
    },
    recyclerStar(star) {
        this.starPool.put(star)
    },
    recyclerPatch(patch) {
        this.boxPatchPool.put(patch)
    }
    // update (dt) {},
});
