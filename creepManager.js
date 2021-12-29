// 这个文件提供一个函数，定期重新计算所有 creep v2 的配置参数，并调用 creepApi 更新配置项。
// 这个文件规定了需要的 creep 集合。如果某种类型 creep 太少，则尝试 spawn。

var util = require('util');
require('creepApi');

const configList = [
    {
        name: "carrier_down",
        role: "carrier",
        body: [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE,
               CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE,
               CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
        require: 0,  // to be used in the future
        argComputer: function() {
            return {
                sourceId: '61c9fced7a3c3521135e617c',  // container above
                targetIdList: util.getStructureIdListMayNeedEnergy(util.myRoom()).concat(
                    util.getBuilderCreepIdList(util.myRoom())).concat(
                    util.getUpgraderCreepIdList(util.myRoom())).concat(
                    ['61cb01a791dde3d80281b58e'])  // storage
            };
        }
    },
    {
        name: "carrier_up",
        role: "carrier",
        body: [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE,
               CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE,
               CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
        require: 1,
        argComputer: function() {
            return {
                sourceId: '61c9fced7a3c3521135e617c',  // container above
                targetIdList: util.getStructureIdListMayNeedEnergy(util.myRoom()).concat(
                    util.getBuilderCreepIdList(util.myRoom())).concat(
                    util.getUpgraderCreepIdList(util.myRoom())).concat(
                    ['61cb01a791dde3d80281b58e'])  // storage
            };
        }
    },
    {
        name: "digger_up",
        role: "digger",
        body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE],
        require: 1,
        argComputer: function() {
            return {
                sourceId: '5bbcaf379099fc012e63a55d',  // source above
                containerId: '61c9fced7a3c3521135e617c',  // container above
            };
        }
    },
    {
        name: "recycler",
        role: "recycler",
        body: [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE,
               CARRY, CARRY, MOVE],
        require: 1,
        argComputer: function() {
            return {
                targetId: '61cb01a791dde3d80281b58e',  // storage
            };
        }
    },
    {
        name: "upgrader",
        role: "upgrader",
        bodyDesigner: function(energy) {
            var body = [MOVE, MOVE, MOVE, CARRY];
            energy -= 200;
            while (energy >= 100) {
                body.push(WORK);
                energy -= 100;
            }
            return body;
        },
        require: 0,  // container not finished yet
        args: {
            controllerId: '5bbcaf379099fc012e63a55e',
            containerId: ''  // TODO
        }
    }
];

var creepManager = {
    updateConfigs: function() {
        for (var i = 0; i < configList.length; i++) {
            var conf = configList[i];
            var args = conf.args ? conf.args : conf.argComputer();
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
                var body = conf.body ? conf.body : conf.bodyDesigner(room.energyCapacityAvailable);
                util.tryToSpawnCreep(conf.body, conf.name + Game.time, {configName: conf.name});
                return;  // 靠前的有高优先级
            }
        }
    }
};

module.exports = creepManager;
