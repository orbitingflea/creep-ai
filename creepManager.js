// 这个文件提供一个函数，定期重新计算所有 creep v2 的配置参数，并调用 creepApi 更新配置项。
// 这个文件规定了需要的 creep 集合。如果某种类型 creep 太少，则尝试 spawn。

var util = require('util');
require('creepApi');

const worker10 = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE];
const carrier1000 = [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE,
    CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE,
    CARRY, CARRY, MOVE, CARRY, CARRY, MOVE];
const carrier500 = [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE,
    CARRY, CARRY, MOVE];

const configList = [
    {
        name: 'carrier_from_storage',
        role: 'carrier',
        body: carrier500,
        require: 1,
        argComputer: function() {
            return {
                sourceId: util.constant.idStorage,
                targetId: util.getStructureIdListMayNeedEnergy(util.myRoom())
                .concat([util.constant.idContainerNearController]),
            };
        }
    },

    {
        name: "digger_up",
        role: "digger",
        body: worker10,
        require: 1,
        args: {
            sourceId: util.constant.idSourceUp,
            containerId: util.constant.idContainerUp,
        }
    },

    {
        name: "carrier_down",
        role: "carrier",
        body: carrier1000,
        require: 0,
        argComputer: function() {
            return {
                sourceId: util.constant.idContainerDown,
                targetIdList: util.getStructureIdListMayNeedEnergy(util.myRoom())
                    .concat(util.getBuilderCreepIdList(util.myRoom()))
                    .concat([util.constant.idContainerNearController, util.constant.idStorage]),
            };
        }
    },

    {
        name: "carrier_up",
        role: "carrier",
        body: carrier1000,
        require: 1,
        argComputer: function() {
            return {
                sourceId: util.constant.idContainerUp,
                targetIdList: util.getStructureIdListMayNeedEnergy(util.myRoom())
                    .concat(util.getBuilderCreepIdList(util.myRoom()))
                    .concat([util.constant.idContainerNearController, util.constant.idStorage]),
            };
        }
    },

    {
        name: "upgrader",
        role: "upgrader",
        body: worker10,
        require: 1,
        args: {
            controllerId: util.constant.idController,
            containerId: util.constant.idContainerNearController,
        }
    },

    {
        name: "recycler",
        role: "recycler",
        body: carrier500,
        require: 1,
        args: {
            targetId: util.constant.idStorage,
        }
    },
];

var creepManager = {
    updateConfigs: function() {
        for (var i = 0; i < configList.length; i++) {
            var conf = configList[i];
            var args = conf.args ? conf.args : conf.argComputer();
            creepApi.add(conf.name, conf.role, args);
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
                var myBody = conf.body ? conf.body : conf.bodyDesigner(room.energyCapacityAvailable);
                util.tryToSpawnCreep(myBody, conf.name + '_' + Game.time, {configName: conf.name});
                // 列表中靠前的 creep 有高优先级，即使能量不够，也不 spawn 后面的 creep
                return;
            }
        }
    }
};

module.exports = creepManager;
