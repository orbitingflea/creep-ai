const roles = {
    carrier: require('role.carrier')
};

Creep.prototype.work = function() {
    const creepConfig = creepApi.get(this.memory.configName);
    // 检查 creep 内存中的配置是否存在
    if (!creepConfig) {
        console.log(`creep ${this.name} 携带了一个无效的配置项 ${this.memory.configName}`);
        // this.say('找不到配置！');
        return;
    }
    const creepLogic = roles[creepConfig.role](...creepConfig.args);

    if (!this.memory.ready) {
        // 有准备阶段配置则执行
        if (creepLogic.prepare && creepLogic.isReady) {
            creepLogic.prepare(this);
            this.memory.ready = creepLogic.isReady(this);
        }
        // 没有就直接准备完成
        else this.memory.ready = true;
        return;
    }

    var stateChange = true;
    // 执行对应阶段
    // 阶段执行结果返回 true 就说明需要更换 working 状态
    if (this.memory.working) {
        if (creepLogic.target) stateChange = creepLogic.target(this)
    } else {
        if (creepLogic.source) stateChange = creepLogic.source(this)
    }
    // 状态变化了就切换工作阶段
    if (stateChange) this.memory.working = !this.memory.working
};