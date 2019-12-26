var observer = {
    subscribe(fn) {
        if (!this.fns) {
            this.fns = new Array()
        }
        if (this.fns.indexOf(fn) === -1) {
            this.fns.push(fn)
        }
        cc.log("当前订阅者:" + this.fns.length)
    },
    unsubscribe(fn) {
        if (!this.fns) {
            this.fns = new Array()
        }
        let index = this.fns.indexOf(fn)
        if (index != -1) {
            this.fns.splice(index, 1);
        }
        cc.log("当前订阅者:" + this.fns.length)
    },
    call(key, params) {
        if (!this.fns) {
            this.fns = new Array()
        }
        this.fns.forEach(function (fn, index) {
            if (fn.key == key) {
                fn.call(params)
            }
        });
    }
}
module.exports = observer;