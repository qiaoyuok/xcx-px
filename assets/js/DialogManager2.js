var dialogManager = {
    dialogNode: null,
    pool: new Array(),
    showGameDialogByArgs(name, args) {
        this.args = args
        this.showGameDialog(null, name)
    },
    showGameDialog(context, name) {
        if (this.dialogNode == null) cc.log('dialogNode为Null')
        let dialog
        let self = this
        for (let d of this.pool) {
            if (d.name === name) {
                dialog = d
            }
        }
        if (dialog == null) {
            cc.loader.loadRes(`prefabs/${name}`, (err, prefab) => {
                dialog = cc.instantiate(prefab)
                self.pool.push(dialog)
                self.showDialog(name, dialog)
            })
        } else {
            this.showDialog(name, dialog)
        }
    },
    showDialog(jsName, dialog) {
        if (this.args != null) {
            dialog.getComponent(jsName).setArgs(this.args)
            this.args = null
        }
        dialog.getComponent(jsName).show(this.dialogNode)
    },
    // LIFE-CYCLE CALLBACKS:

    start() {
    },
    recycler(dialog) {
        dialog.parent = null
    },
    isOtherDialogShowing() {
        return this.dialogNode.childrenCount > 0
    },
}
module.exports = dialogManager;