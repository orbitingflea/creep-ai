const roles = {
    carrier: require('role.carrier'),
    digger: require('role.digger'),
    diggerLink: require('role.diggerLink'),
    recycler: require('role.recycler'),
    upgrader: require('role.upgrader2'),  // CAUTION
    worker: require('role.worker'),
};

Creep.prototype.work = function() {
    const creepConfig = creepApi.get(this.memory.configName);
    // 检查 creep 内存中的配置是否存在
    if (!creepConfig) {
        console.log(`creep ${this.name} 携带了一个无效的配置项 ${this.memory.configName}`);
        // this.say('找不到配置！');
        return;
    }
    const creepLogic = roles[creepConfig.role](creepConfig.args);

    if (!this.memory.ready) {
        // 有准备阶段配置则执行
        // 没有就直接准备完成
        if (creepLogic.prepare) {
            this.memory.ready = creepLogic.prepare(this);
        } else {
            this.memory.ready = true;
        }
        return;
    }

    var stateChange = true, wait = false;
    // 执行对应阶段
    // 阶段执行结果返回 true 就说明需要更换 working 状态
    // 要求 source, target 返回 true 时不改变游戏状态（在开始阶段判定）
    if (this.memory.working) {
        if (creepLogic.target) stateChange = creepLogic.target(this);
        if (stateChange) wait = creepLogic.source(this);
    } else {
        if (creepLogic.source) stateChange = creepLogic.source(this);
        if (stateChange) wait = creepLogic.target(this);
    }
    // 状态变化了就切换工作阶段
    if (wait) {
        stateChange = false;
        if (creepLogic.wait) creepLogic.wait(this);
    }
    if (stateChange) {
        this.memory.working = !this.memory.working;
    }
};
