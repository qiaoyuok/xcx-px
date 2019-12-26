var Storage = require('LocalStorage')
cc.Class({
    extends: require("BaseUtils"),

    properties: {
        exploreItem: cc.Prefab,
        cannonSpriteFrames: [cc.SpriteFrame],
        listContent: cc.Node,
        freeTimes: cc.Label,
        starCount: cc.Label,
        level: cc.Label,
        watchVideoToPlay: cc.Prefab,
        chooseScrollView: cc.ScrollView
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        //如果挑战结果存在并且结果不为0，说明是从挑战游戏界面调回的，此时可以判断游戏结果，emmmmm，好像什么卵用，先放着吧
        // if (Global.exploreResult && Global.exploreResult != 0) {
        //     Global.exploreResult = 0
        //     Storage.save('explore', Global.explore)
        // }
        //如果本地挑战数据为空，就初始化挑战数据
        cc.dialogManager.dialogNode = this.node
        if (!Global.explore) {
            Global.explore = {
                level: 0,
                freeTimes: 3,
                lastPlayTime: 0
            }
        }
        //如果今天的日期已经比上一次游戏时间迟，那就刷新免费次数
        if (this.getTodayDate() > Global.explore.lastPlayTime) {
            Global.explore.freeTimes = 3
            Global.explore.lastPlayTime = this.getTodayDate()
            Storage.save('explore', Global.explore)
        }
        this.freeTimes.string = `${Global.explore.freeTimes}/3`
        this.starCount.string = Global.userData.star
        this.level.string = `${Global.explore.level}/${this.cannonSpriteFrames.length}`
        for (let i = 0; i < this.cannonSpriteFrames.length; i++) {
            let item = cc.instantiate(this.exploreItem)
            let js = item.getComponent('ExploreItem')
            js.setParent(this)
            js.setConfig(i, this.cannonSpriteFrames[i], Global.explore.level)
            this.listContent.addChild(item)
        }
        this.scheduleOnce(() => {
            let dis = Math.floor(Global.explore.level / 4 - 3) * 207
            if (dis < 0) dis = 0
            cc.log(`滚动到${dis}`)
            this.chooseScrollView.scrollToOffset(cc.v2(0, dis)), 0
        })
        cc.director.preloadScene('ExploreGame')
    },
    readExploreHistory() {

    },
    saveExploreHistory() {

    },
    toGame() {
        if (Global.explore.freeTimes > 0) {
            Global.explore.freeTimes--
            Storage.save('explore', Global.explore)
            this.startScene('ExploreGame', null)
        } else {
            cc.dialogManager.showGameDialog(null, 'ChallengeDialog')
        }
    },
    back() {
        this.startScene('game', null)
    },
    showStarDialog() {
        cc.dialogManager.showGameDialog(null, 'receiveStarDialog')
    },
    // update (dt) {},
});
