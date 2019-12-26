cc.Class({
    extends: require("BaseUtils"),

    properties: {
        num: cc.Label,
        type: 0,//方块类型 1正方形方块 2星星
        boxSpriteFrames: [cc.SpriteFrame],
        boxSprite: cc.Node
    },
    /**
     * 配置方块属性
     * @param {*} level 
     * @param {*} index_x 目前游戏方块x轴一共7个位置 这个参数是位置下标
     * @param {*} y 
     */
    setConfig(level, index_x, y) {
        this.type = 0
        let positions = [-420, -280, -140, 0, 140, 280, 420]
        let min = 10 + 5 * Math.pow(3.5, level)
        let max = 20 + 5 * 3 * Math.pow(3.5, level)
        this.hp = Math.floor(min + Math.random() * (max - min))
        this.score = this.hp * Math.pow(1.2, level)
        this.num.string = this.formatScore2(this.hp)
        this.node.x = positions[index_x]
        this.node.y = y
        this.node.scaleX = 1
        this.node.scaleY = 1
    },
    setExploreConfig(level, index_x, y) {
        let random = Math.random * 100
        this.type = random > 5 ? 0 : 1
        let positions = [-420, -280, -140, 0, 140, 280, 420]
        let min = 10 + 5 * Math.pow(1.86, level)
        let max = 20 + 5 * 3 * Math.pow(1.86, level)
        this.hp = Math.floor(min + Math.random() * (max - min))
        this.score = this.hp
        this.num.string = this.formatScore2(this.hp)
        this.node.x = positions[index_x]

        this.node.y = y
        this.node.scaleX = 1
        this.node.scaleY = 1
        if (this.type == 0) {

        } else if (this.type == 1) {

        }
    },
    /**
     * 被攻击
     * @param {int} attack 子弹攻击力
     */
    attacked(attack) {
        this.hp -= attack
        if (this.hp <= 0) {
            cc.boxFactory.recycler(this.node)
            cc.MainGame.addScore(3 * this.score * ((cc.MainGame.coinRainNode != null && cc.MainGame.coinRainNode.active) ? 5 : 1))
            cc.MainGame.breakBox(this.node)
        } else {
            if (this.boxSprite.getNumberOfRunningActions() == 0) {
                this.boxSprite.runAction(cc.sequence(cc.scaleTo(0.05, 1.1), cc.scaleTo(0.05, 1)))
            }
            this.num.string = this.formatScore2(this.hp)
            // this.node.runAction(cc.sequence(cc.scaleTo(0.1, 1.1), cc.scaleTo(0.1, 1)))
        }
    },
    /**
     * 把金币保存到存钱罐中
     */
    toSavingPot() {
        Global.userData.savingPotCoinCount += this.score * ((cc.MainGame.coinRainNode != null && cc.MainGame.coinRainNode.active) ? 5 : 1)
    },
    start() {

    },

    // update (dt) {},
});
