var netApi = require('NetApi')
var localStorage = require('LocalStorage')
cc.Class({
    extends: require("BaseUtils"),

    properties: {
        bgm: {
            type: cc.AudioSource,
            default: null
        },
        starLab: cc.Label,
        scoreLab: cc.Label,
        promotionLab: cc.Label,
        promotionNode: cc.Node,
        promotionUpNormalButton: cc.Node,
        promotionUpLightButton: cc.Node,
        promotionUpProgressBar: cc.ProgressBar,
        promotionFrames: [cc.SpriteFrame],
        promotionAnimFrames: [cc.SpriteFrame],
        positionNodeParent: cc.Node,
        moreBg: cc.Node,
        moreNode: cc.Node,
        bulletsNodes: cc.Node,
        gameUi: cc.Node,
        dialogBg: cc.Node,
        promotionJson: cc.JsonAsset,
        starReceiveConfig: cc.JsonAsset,
        autoMegraNode: cc.Node,
        coinRainNode: cc.Node,
        coinAndStarAnimNode: cc.Node,
        nextCannonName: cc.Label,
        nextCannonPrice: cc.Label,
        camera: cc.Node,
        dialogUi: cc.Node,
        brokenBoxCountBeforePromotionUp: 10,//段位升级需要的方块击破数
        guide: cc.Node,
        giftBox: cc.Prefab,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.getPhysicsManager().enabled = true
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        cc.bulletFactory = this.node.getComponent("BulletFactory")
        cc.boxFactory = this.node.getComponent("BoxFactory")
        cc.cannonFactory = this.node.getComponent("CannonFactory")
        cc.dialogManager = require('DialogManager2')
        cc.dialogManager.dialogNode = this.dialogUi
        cc.observer = require('Observer')
        cc.touchAim = {
            isTouch: false,//是否处于触摸瞄准状态
            touchPos: cc.v2(0, 0)//触摸位置-用于瞄准
        }
        cc.MainGame = this
        this.coinStarAnim = this.coinAndStarAnimNode.getComponent('CoinStarAnim')
        this.brokenBoxCount = 0//击破方块 计数
        this.checkOffline()
        this.setPromotion()
        this.setScore(Global.userData.score)
        this.setStar(Global.userData.star)
        this.syncTask = function () {
            this.saveUserData()
        }
        this.schedule(this.syncTask, 10)
        this.time = 0
        this.playBgm()
    },
    start() {
        if (Global.firstRun) {
            this.guide.active = true
            this.guide.getComponent('Guide').setStep(1)
        }
        let self = this
        cc.game.on(cc.game.EVENT_SHOW, function () {
            self.checkOffline()
        }, this);
        this.pause = false
        /*游戏map类数据Start */
        this.buyCountMap = localStorage.readMap('buyCount')//各等级炮台购买数量

        this.starReceviedMap = localStorage.readMap('starReceive')//每日星星领取 记录 Map

        this.cannonPositionMap = localStorage.readMap('position')
        this.fixPositionMap()//修复旧版本map的key值出现int和string两种类型时，两个炮台重叠的问题
        for (var obj of this.cannonPositionMap) {
            this.addChannonToPosition(obj[0], obj[1])
        }
        /*游戏map类数据 End */
        this.scoreListener = {
            key: 'score',
            call(params) {
                self.scoreLab.string = self.formatScore(params)
            }
        }
        this.starListener = {
            key: 'star',
            call(params) {
                self.starLab.string = params
            }
        }
        //订阅 金币&星星变化事件
        cc.observer.subscribe(this.scoreListener)
        cc.observer.subscribe(this.starListener)
        this.setNextPrice()
        this.getSword()
        this.setPromotionUpLight(false)
        this.addGiftBoxTask()
        cc.director.preloadScene('ExploreChoose')
    },
    fixPositionMap() {
        let map = new Map()
        for (var obj of this.cannonPositionMap) {
            let i = parseInt(obj[0])
            if (!map.has(i + "")) {
                map.set(i + "", obj[1])
            }
        }
        this.cannonPositionMap = map
    },
    /**
     * 周期性加入宝箱任务
     */
    addGiftBoxTask() {
        this.schedule(function () {
            cc.log('加入宝箱')
            this.addGiftBox()
        }, 40)
    },
    /**
     * 检查离线状态-用于计算离线奖励
     */
    checkOffline() {
        this.scheduleOnce(function () {
            if (Date.parse(new Date()) > (Global.userData.lastSyncTime + 2 * 60 * 1000)) {
                cc.dialogManager.showGameDialogByArgs("OfflineDialog", Global.userData.lastSyncTime)
            }
        }, 0.2)
    },
    /**
     * 炮台最高等级发生变化时，会调用此方法，将保存数据以及显示升级动画
     * @param {*} level 
     */
    maxLevelChanged(level) {
        Global.userData._maxLevel = level
        this.saveUserData()
        cc.dialogManager.showGameDialogByArgs('CannonDialog', Global.userData.maxLevel - 1)
    },
    /**
     * 公用方法-加入金币
     * @param {*} score 正数为添加，负数为消耗
     */
    addScore(score) {
        score = Math.floor(score)
        if (score >= 0) {
            Global.userData._score += score
        } else if (Global.userData._score > (-score)) {
            Global.userData._score += score
        } else {
            this.showToast("金币不足")
            return false
        }
        return true
    },
    /**
     * 公用方法-设置金币
     * @param {*} score 
     */
    setScore(score) {
        score = Math.floor(score)
        Global.userData.score = score
        this.scoreLab.string = this.formatScore(score)
    },
    /**
     * 公用方法-加入星星
     * @param {*} star 正数为添加，负数为消耗
     */
    addStar(star) {
        star = Math.floor(star)
        if (star >= 0) {
            Global.userData._star += star
            this.coinStarAnim.addStarAnim(null)
        } else if (Global.userData.star >= (-star)) {
            Global.userData._star += star
        } else {
            this.showToast("星星不足")
            return false
        }
        this.saveUserData()
        return true
    },
    /**
     * 公用方法-设置星星数量
     * @param {*} star 
     */
    setStar(star) {
        star = Math.floor(star)
        Global.userData.star = star
        this.starLab.string = Global.userData.star
    },
    /**
     * 方块倍击破之后会调用此方法，当击破方块数达到一定数量是，就可以升级段位了
     */
    breakBox(node) {
        this.cameraShake(5)
        this.coinStarAnim.AddGoldAnim(cc.v2(node.x, node.y), 1)
        this.coinStarAnim.addPatchAnim(cc.v2(node.x, node.y))
        if (this.promotionUpLightButton.active) return
        this.brokenBoxCount++
        let progress = this.brokenBoxCount / this.brokenBoxCountBeforePromotionUp
        if (progress > 1) progress = 1
        this.promotionUpProgressBar.progress = progress
        if (this.promotionUpNormalButton.active && this.brokenBoxCount >= this.brokenBoxCountBeforePromotionUp) {
            this.setPromotionUpLight(true)
        }
    },
    /**
     * 重置经验条
     */
    resetProgress() {
        this.brokenBoxCount = 0
        let progress = this.brokenBoxCount / this.brokenBoxCountBeforePromotionUp
        if (progress > 1) progress = 1
        this.promotionUpProgressBar.progress = progress
        this.setPromotionUpLight(false)
    },
    /**
     * 加入炮台
     * @param {*} context 无用参数传null即可
     * @param {*} cusLevel -1是给下方购买按钮使用的，其他数值是给商店使用的
     */
    addCannon(context, cusLevel, targetNode) {
        cusLevel = parseInt(cusLevel)
        let addSuccess = false
        if (targetNode != null) {
            addSuccess = true
            let buyCount = this.buyCountMap.get(cusLevel)
            if (!buyCount) buyCount = 0
            //cusLevel等于-2时，是赠送的炮台，不占用购买次数
            if (cusLevel != -2) buyCount++
            this.buyCountMap.set(cusLevel, buyCount)
            localStorage.saveMap('buyCount', this.buyCountMap)
            let cannon
            if (cusLevel < 0) {
                cusLevel = Global.userData.maxLevel - 5
                if (cusLevel < 1) cusLevel = 1
                cannon = cc.cannonFactory.getCannonByLevel(cusLevel)
            } else {
                cannon = cc.cannonFactory.getCannonByLevel(cusLevel)
            }
            targetNode.addChild(cannon, 0, "cannon")
            cannon.angle = -45
            cannon.x = -39
            cannon.y = -39
            this.savePosition(1, cannon)
            this.saveUserData()
            this.guideExecute()
        } else {
            for (let i in this.positionNodeParent.children) {
                if (this.positionNodeParent.children[i].childrenCount == 0) {
                    addSuccess = true
                    let buyCount = this.buyCountMap.get(cusLevel)
                    if (!buyCount) buyCount = 0
                    if (cusLevel != -2) buyCount++
                    this.buyCountMap.set(cusLevel, buyCount)
                    localStorage.saveMap('buyCount', this.buyCountMap)
                    let cannon
                    if (cusLevel < 0) {
                        cusLevel = Global.userData.maxLevel - 5
                        if (cusLevel < 1) cusLevel = 1
                        cannon = cc.cannonFactory.getCannonByLevel(cusLevel)
                    } else {
                        cannon = cc.cannonFactory.getCannonByLevel(cusLevel)
                    }
                    this.positionNodeParent.children[i].addChild(cannon, 0, "cannon")
                    cannon.angle = -45
                    cannon.x = -39
                    cannon.y = -39
                    this.savePosition(1, cannon)
                    this.saveUserData()
                    this.guideExecute()
                    break
                }
            }
        }
        return addSuccess
    },
    /**
     * 在空位中加入宝箱
     */
    addGiftBox() {
        for (let i in this.positionNodeParent.children) {
            if (this.positionNodeParent.children[i].childrenCount == 0) {
                let giftBox = cc.instantiate(this.giftBox)
                giftBox.x = 0
                giftBox.y = 2000
                giftBox.getComponent('GiftBox').setConfig(Math.random() > 0.7 ? 0 : 1)
                this.positionNodeParent.children[i].addChild(giftBox, 0, "giftBox")
                let action = cc.moveTo(0.5, 0, 0)
                action.easing(cc.easeBackOut())
                giftBox.runAction(action)
                break
            }
        }
    },
    /**
     * 购买炮台-底部购买按钮
     */
    buyCannon() {
        if (Global.userData.score >= this.price) {
            if (this.addCannon(null, this.nextLevel)) {
                this.addScore(-this.price)
                this.setNextPrice()
            }
        } else {
            this.showToast("金币不足")
        }
    },
    /**
     * 设置底部购买按钮的价格以及名称
     */
    setNextPrice() {
        this.nextLevel = Global.userData.maxLevel - 5
        this.nextLevel = this.nextLevel < 1 ? 1 : this.nextLevel
        let buyCount = this.buyCountMap.get(this.nextLevel)
        if (!buyCount) {
            this.buyCountMap.set(this.nextLevel, 0)
        }
        this.price = this.getCannonPrice(this.nextLevel, buyCount)
        this.nextCannonName.string = `购买${this.nextLevel}号炮`
        this.nextCannonPrice.string = 'x' + this.formatScore(Math.floor(this.price))
    },
    /**
     * 获得当前等级炮台几个
     * @param {*} level 
     * @param {*} buyCount 已购买次数
     */
    getCannonPrice(level, buyCount) {
        let price
        if (!buyCount) {
            price = Math.pow(4, level - 1) * 100
            cc.MainGame.buyCountMap.set(level, 0)
        } else {
            price = Math.pow(4, level - 1) * 100 * Math.pow(1.07, buyCount)
        }
        return price
    },
    /**
     * 计算当前战斗力
     */
    getSword() {
        let sword = 0
        for (let cannon of this.cannonPositionMap) {
            sword += 5 * Math.pow(1.6, cannon[1] - 1)
        }
        sword = sword * Global.userData.attackByPromotionUp * Global.userData.attacKByVip
        return parseInt(sword)
    },
    /**
     * 根据位置放入炮台
     * @param {*} position 
     * @param {*} level 
     */
    addChannonToPosition(position, level) {
        level = parseInt(level)
        position = parseInt(position)
        let cannon = cc.cannonFactory.getCannonByLevel(level)
        if (position <= 4) {
            cannon.angle = 0
            cannon.y = 20
            cannon.x = 0
            this.bulletsNodes.children[position + 1].addChild(cannon, 0, "cannon")
            cannon.setSiblingIndex(1)
            cannon.getComponent("Cannon").startFire()
        } else {
            cannon.angle = -45
            cannon.y = -39
            cannon.x = -39
            this.positionNodeParent.children[position - 5].addChild(cannon, 0, "cannon")
        }
    },
    /**
     * 保存炮台位置信息
     * @param {int} type 
     * @param {node} child 
     */
    savePosition(type, child) {
        try {
            switch (type) {
                case 0:
                    this.cannonPositionMap.delete(child.parent.name)
                    break
                case 1:
                    this.cannonPositionMap.set(child.parent.name, child.getComponent("Cannon").level)
                    break
            }
        } catch (e) {

        }
        localStorage.saveMap('position', this.cannonPositionMap)
    },
    toExplore() {
        this.saveUserData()
        this.startScene('ExploreChoose', null)
    },
    onDestroy() {
        //取消 订阅的事件
        cc.observer.unsubscribe(this.scoreListener)
        cc.observer.unsubscribe(this.starListener)
    },
    /**
     * 显示更多菜单
     */
    showMore() {
        if (this.moreBg.active) {
            //关闭抽屉
            this.moreBg.active = false;
            let ac = cc.moveBy(0.2, -236, 0)
            ac.easing(cc.easeBackIn())
            this.moreNode.runAction(ac)
        } else {
            //打开抽屉
            this.moreBg.active = true;
            this.moreNode.runAction(cc.moveBy(0.2, 236, 0))
        }
    },
    guideExecute() {
        if (!Global.firstRun) return
        this.guide.getComponent('Guide').execute()
    },
    //镜头震动效果
    cameraShake(range) {
        if (!Global.userConfig.isShake) return
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
    /**暂停和开始游戏 暂无可用方案 */
    pauseNodeAndDescendants(nodes) {
        // let node = this.gameUi
        // this.pause = true
        // node.pauseAllActions();
        // var that = this;
        // node.children.forEach(child => {
        //     that.pauseNodeAndDescendants(child);
        // });
    },
    resumeNodeAndDescendants(nodes) {
        // let node = this.gameUi
        // this.pause = false
        // node.resumeAllActions();
        // var that = this;
        // node.children.forEach(child => {
        //     that.resumeNodeAndDescendants(child);
        // });
    },
    showDialog(context, name) {
        cc.dialogManager.showGameDialog(context, name)
    },
    /**暂停和开始游戏 暂无可用方案*/
    //显示段位提升高亮
    setPromotionUpLight(light) {
        if (Global.userData.promotion >= 15) return
        if (!light) {
            this.brokenBoxCount = 0
            this.promotionUpProgressBar.progress = 0
        }
        this.promotionUpNormalButton.active = !light
        this.promotionUpLightButton.active = light
    },
    //设置段位以及图标
    setPromotion() {
        this.brokenBoxCountBeforePromotionUp = 10 + Global.userData.promotion * 4
        this.promotionNode.getComponent(cc.Sprite).spriteFrame = this.promotionFrames[Global.userData.promotion]
        this.promotionLab.string = this.promotionJson.json.promotions[Global.userData.promotion].name
        this.setPromotionUpLight(false)
    },
    //开启自动合成
    openAutoMegra() {
        Global.userData.autoMegraEndTime = Date.parse(new Date()) + 180 * 1000
        this.autoMegraNode.active = true
    },
    //获得射击
    getSpeed() {
        return Global.userData.speedUpEndTime > Date.parse(new Date()) ? 2 : 1
    },
    /*用户数据保存与读取 */
    saveUserData() {
        Global.userData.lastSyncTime = Date.parse(new Date())
        localStorage.save('userData', Global.userData)
    },
    showPromotionUpDialog() {
        cc.dialogManager.showGameDialogByArgs('LevelDialog', 1)
    },
    showPromotionDownDialog() {
        if (Global.userData.promotion > 1 && !cc.dialogManager.isOtherDialogShowing()) {
            cc.dialogManager.showGameDialogByArgs('LevelDialog', 0)
        } else {
            this.showToast('段位不能再降啦~')
        }
    },
    /*用户数据保存与读取 */
    playBgm() {
        if (Global.userConfig.isSound) {
            this.bgm.play()
        } else {
            this.bgm.stop()
        }
    },
});
