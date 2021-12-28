// 这个文件提供一个函数，定期重新计算所有 creep v2 的配置参数，并调用 creepApi 更新配置项。
// 这个文件规定了需要的 creep 集合。如果某种类型 creep 太少，则尝试 spawn。

var util = require('util');
require('creepApi');

const configList = [
    {
        name: "carrier_down",
        role: "carrier",
        body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
        require: 1,
        argComputer: function() {
            return {
                sourceId: '61c9b463d054a45518e8b5e3',  // container below
                targetIdList: util.getStructureIdListMayNeedEnergy(util.myRoom()).concat(
                    util.getBuilderCreepIdList(util.myRoom()))
            };
        }
    },
    {
        name: "carrier_up",
        role: "carrier",
        body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
        require: 1,
        argComputer: function() {
            return {
                sourceId: '61c9fced7a3c3521135e617c',  // container above
                targetIdList: util.getStructureIdListMayNeedEnergy(util.myRoom()).concat(
                    util.getBuilderCreepIdList(util.myRoom()))
            };
        }
    },
    {
        name: "digger_up",
        role: "digger",
        body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
        require: 1,
        argComputer: function() {
            return {
                sourceId: '5bbcaf379099fc012e63a55d',  // source above
                containerId: '61c9fced7a3c3521135e617c', // container above
            };
        }
    }
];

var creepManager = {
    updateConfigs: function() {
        for (var i = 0; i < configList.length; i++) {
            var conf = configList[i];
            creepApi.add(conf.name, conf.role, conf.argComputer());
        }
    },

    run: function() {
        this.updateConfigs();
        var room = util.myRoom();
        var spawner = Game.spawns['Spawn1'];
        if (spawner.spawning || room.energyAvailable < 200) {
            return;
        }
        for (var i = 0; i < configList.length; i++) {
            var conf = configList[i];
            var numExist = _.filter(Game.creeps, (creep) => creep.memory.configName == conf.name).length;
            if (numExist < conf.require) {
                util.tryToSpawnCreep(conf.body, conf.name + Game.time, {configName: conf.name});
                return;  // 靠前的有高优先级
            }
        }
    }
};

module.exports = creepManager;
