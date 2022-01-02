// 这个文件提供一个函数，定期重新计算所有 creep v2 的配置参数，并调用 creepApi 更新配置项。
// 这个文件规定了需要的 creep 集合。如果某种类型 creep 太少，则尝试 spawn。

var util = require('util');
require('creepApi');

function BodyWCM(nWork, nCarry, nMove) {
    var body = [];
    for (var i = 0; i < nWork; i++) body.push(WORK);
    for (var i = 0; i < nCarry; i++) body.push(CARRY);
    for (var i = 0; i < nMove; i++) body.push(MOVE);
    return body;
}

const worker10 = BodyWCM(10, 2, 3);
const carrier1000 = BodyWCM(0, 20, 10);
const carrier500 = BodyWCM(0, 10, 5);
const carrier100 = BodyWCM(0, 2, 1);
const carrierMain = carrier500;  // from storage, lifeline!
const fullstackWorker = BodyWCM(10, 10, 10);

const configList = [
    {
        name: 'carrier_sos',
        role: 'carrier',
        body: [CARRY, MOVE],
        requireFunction: function() {
            var energyAvailable = util.myRoom().energyAvailable;
            var mainCarrierCost = util.getCreepCost(carrierMain);
            var numMainCarrier = _.filter(Game.creeps, (creep) => creep.memory.configName == 'carrier_from_storage').length;
            if (numMainCarrier == 0 && energyAvailable < mainCarrierCost) {
                return 1;
            } else {
                return 0;
            }
        },
        argComputer: function() {
            var result = {
                sourceId: util.constant.idStorage,
                targetIdList: util.myRoom().find(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN);
                    }
                }).map((obj) => obj.id),
            };
            return result;
        }
    },

    {
        name: 'carrier_from_storage',
        role: 'carrier',
        body: carrierMain,
        require: 1,
        argComputer: function() {
            var result = {
                sourceId: util.constant.idStorage,
                targetIdList: util.getStructureIdListMayNeedEnergy(util.myRoom())
                .concat([util.constant.idContainerNearController]),
            };
            return result;
        }
    },

    {
        name: "digger_down",
        role: "digger",
        body: worker10,
        require: 1,
        args: {
            sourceId: util.constant.idSourceDown,
            containerId: util.constant.idContainerDown,
        }
    },

    {
        name: "carrier_down",
        role: "carrier",
        body: carrier100,
        require: 1,
        argComputer: function() {
            return {
                sourceId: util.constant.idContainerDown,
                targetIdList: [util.constant.idStorage],
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
        name: "carrier_up",
        role: "carrier",
        body: carrier1000,
        require: 1,
        argComputer: function() {
            return {
                sourceId: util.constant.idContainerUp,
                targetIdList: [util.constant.idStorage],
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

    {
        name: "builder",
        role: "worker",
        body: fullstackWorker,
        require: 1,
        argComputer: function() {
            var sourceId = util.constant.idStorage;
            var taskList = [];
            var room = util.myRoom();

            // build structures
            taskList = taskList.concat(room.find(FIND_CONSTRUCTION_SITES).map((obj) => ({
                targetId: obj.id,
                action: 'build',
                priority: 100
            })));

            // repair ramparts
            taskList = taskList.concat(room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_RAMPART && structure.hits < structure.hitsMax);
                }
            }).map((obj) => ({
                targetId: obj.id,
                action: 'repair',
                priority: 50
            })));

            // upgrade controller
            taskList.push({
                targetId: util.constant.idController,
                action: 'upgrade',
                priority: 1
            });
        }
    }
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
        if (spawner.spawning) {
            return;
        }
        for (var i = 0; i < configList.length; i++) {
            var conf = configList[i];
            var numExist = _.filter(Game.creeps, (creep) => creep.memory.configName == conf.name).length;
            var confRequire = conf.require ? conf.require : conf.requireFunction();
            if (numExist < confRequire) {
                var confBody = conf.body ? conf.body : conf.bodyDesigner(room.energyCapacityAvailable);
                util.tryToSpawnCreep(confBody, conf.name + '_' + Game.time, {configName: conf.name});
                // 列表中靠前的 creep 有高优先级，即使能量不够，也不 spawn 后面的 creep
                return;
            }
        }
    }
};

module.exports = creepManager;
