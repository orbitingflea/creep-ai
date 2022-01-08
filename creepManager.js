// 这个文件提供一个函数，定期重新计算所有 creep v2 的配置参数，并调用 creepApi 更新配置项。
// 这个文件规定了需要的 creep 集合。如果某种类型 creep 太少，则尝试 spawn。

var util = require('util');
var taskCommon = require('task.common');
require('creepApi');
var CarrierSystem = require('CarrierSystem');
const { UpdateStructureStatus } = require('CarrierSystem');

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

var configList = [
    {
        name: 'carrier_sos_1',
        role: 'carrier',
        spawn: 'Spawn1',
        body: [CARRY, MOVE],
        get require() {
            var energyAvailable = util.myRoom().energyAvailable;
            var mainCarrierCost = util.getCreepCost(carrierMain);
            var numMainCarrier = _.filter(Game.creeps, (creep) => creep.memory.configName == 'carrier_from_storage').length;
            if (numMainCarrier == 0 && energyAvailable < mainCarrierCost) {
                return 1;
            } else {
                return 0;
            }
        },
        get args() {
            var result = {
                sourceId: util.constant.idStorage,
                targetIdList: util.myRoom().find(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN);
                    }
                }).map((obj) => obj.id),
                parkWhenWait: true,
            };
            return result;
        }
    },

    {
        name: 'carrier_sos_2',
        role: 'carrier',
        spawn: 'Spawn2',
        require: 1,
        body: [CARRY, MOVE],
        get args() {
            var result = {
                sourceId: util.constant.idRoom2.storage,
                targetIdList: util.myRoom2().find(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN);
                    }
                }).map((obj) => obj.id),
                parkWhenWait: true,
            };
            return result;
        }
    },

    {
        name: 'carrier_from_storage',
        role: 'carrier',
        spawn: 'Spawn1',
        body: carrierMain,
        require: 1,
        get args() {
            var result = {
                sourceId: util.constant.idStorage,
                targetIdList: util.myRoom().find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.memory.needEnergy);
                    }
                }).map((obj) => obj.id),
                parkWhenWait: true,
            };
            for (var i in result.targetIdList) {
                var target = Game.getObjectById(result.targetIdList[i]);
            }
            return result;
        }
    },

    {
        name: "carrier_center",
        role: "carrierCenter",
        body: carrier100,
        spawn: 'Spawn1',
        require: 1,
        get args() {
            var result = {
                storageId: util.constant.idStorage,
                linkId: util.constant.idLinkDown,
                containerId: util.constant.idContainerDown,
                workingPosition: [26, 43],
            };
            return result;
        }
    },

    {
        name: "digger_down",
        role: "digger",
        spawn: 'Spawn1',
        body: BodyWCM(10, 0, 2),
        require: 1,
        args: {
            sourceId: util.constant.idSourceDown,
            containerId: util.constant.idContainerDown,
        }
    },

    {
        name: "digger_up",
        role: "diggerLink",
        spawn: 'Spawn1',
        body: worker10,
        require: 1,
        args: {
            sourceId: util.constant.idSourceUp,
            containerId: util.constant.idContainerUp,
            linkId: util.constant.idLinkUp,
        }
    },

    {
        name: "upgrader",
        role: "upgrader",
        spawn: 'Spawn1',
        body: BodyWCM(20, 2, 4),
        require: 1,
        args: {
            controllerId: util.constant.idController,
            containerId: util.constant.idContainerNearController,
        }
    },

    {
        name: "recycler",
        role: "recycler",
        spawn: 'Spawn1',
        body: carrier500,
        require: 1,
        get args() {
            var targetId = util.constant.idStorage;
            var room = util.myRoom();
            var sourceIdList = taskCommon.GetRecyclerTargets(room);
            if (Game.getObjectById(util.constant.idContainerNearMineral).store[RESOURCE_LEMERGIUM] >= 200) {
                sourceIdList.push(util.constant.idContainerNearMineral);
            }
            return {
                targetId: targetId,
                sourceIdList: sourceIdList,
            };
        }
    },

    {
        name: "builder",
        role: "worker",
        spawn: 'Spawn1',
        body: fullstackWorker,
        get require() {
            if (util.myRoom().storage.store[RESOURCE_ENERGY] > 600000) {
                return 2;
            }
            if (util.myRoom().storage.store[RESOURCE_ENERGY] > 400000) {
                return 1;
            }
            var constructionSites = util.myRoom().find(FIND_MY_CONSTRUCTION_SITES);
            var ramparts = util.myRoom().find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_RAMPART &&
                        structure.hits < structure.hitsMax - 10000;
                }
            });
            if (constructionSites.length >= 1) {
                return 1;
            } else {
                return 0;
            }
        },
        get args() {
            var sourceId = util.constant.idStorage;
            return {
                sourceId: sourceId,
                taskList: taskCommon.GetWorkerTasks(util.myRoom()),
            };
        }
    },

    {
        name: "miner",
        role: "miner",
        spawn: 'Spawn1',
        bodyDesigner: (energy) => {
            return BodyWCM(Math.floor((energy - 50) / 100), 0, 1);
        },
        get require() {
            const mineral = Game.getObjectById(util.constant.idMineral);
            if (mineral && mineral.mineralAmount > 0) {
                return 1;
            } else {
                return 0;
            }
        },
        args: {
            sourceId: util.constant.idMineral,
            targetId: util.constant.idStorage,
            containerId: util.constant.idContainerNearMineral,
        }
    },

    {
        name: 'carrier_n',
        role: 'carrier',
        spawn: 'Spawn2',
        body: carrier500,
        require: 2,
        get args() {
            var result = {
                sourceId: util.constant.idRoom2.container_near_source,
                targetIdList: util.myRoom2().find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.memory.needEnergy);
                    }
                }).concat([util.myRoom2().storage]).map((obj) => obj.id),
                parkWhenWait: false,
            };
            return result;
        }
    },

    {
        name: "worker_n",
        role: "worker",
        spawn: 'Spawn2',
        body: BodyWCM(5, 5, 5),
        require: 1,
        get args() {
            var res = {
                sourceId: util.constant.idRoom2.container_near_controller,
                taskList: taskCommon.GetWorkerTasks(util.myRoom2()),
            };
            return res;
        },
    },

    {
        name: "upgrader_n",
        role: "upgrader",
        spawn: 'Spawn2',
        body: BodyWCM(5, 1, 3),
        require: 1,
        args: {
            controllerId: util.constant.idRoom2.controller,
            containerId: util.constant.idRoom2.container_near_controller,
        }
    },

    {
        name: "digger_n",
        role: "digger",
        spawn: 'Spawn2',
        body: BodyWCM(5, 1, 3),
        require: 1,
        args: {
            sourceId: util.constant.idRoom2.source,
            containerId: util.constant.idRoom2.container_near_source,
        }
    },

    {
        name: "recycler_n",
        role: "recycler",
        spawn: 'Spawn2',
        body: carrier500,
        require: 1,
        get args() {
            var targetId = util.constant.idRoom2.storage;
            var room = util.myRoom2();
            var sourceIdList = taskCommon.GetRecyclerTargets(room);
            return {
                targetId: targetId,
                sourceIdList: sourceIdList,
            };
        }
    },

    // ---------- outer harvester ----------

    {
        name: "harvester_E38S46",
        role: "outer_harvester",
        spawn: 'Spawn1',
        body: BodyWCM(5, 15, 10),
        get require() {
            // if saw hostile creeps in 1500 ticks, do not spawn harvester
            if (Memory.last_seen_hostile && Game.time - Memory.last_seen_hostile < 1500) {
                return 0;
            }
            return 1;
        },
        args: {
            roomName: 'E38S46',
            targetId: util.constant.idStorage,
        }
    },

    {
        name: "harvester_E37S45",
        role: "outer_harvester",
        spawn: 'Spawn1',
        body: BodyWCM(5, 15, 10),
        get require() {
            // if saw hostile creeps in 1500 ticks, do not spawn harvester
            if (Memory.last_seen_hostile && Game.time - Memory.last_seen_hostile < 1500) {
                return 0;
            }
            return 1;
        },
        args: {
            roomName: 'E37S45',
            targetId: util.constant.idStorage,
        }
    },

    {
        name: "harvester_E37S46",
        role: "outer_harvester",
        spawn: 'Spawn1',
        body: BodyWCM(5, 15, 10),
        get require() {
            // if saw hostile creeps in 1500 ticks, do not spawn harvester
            if (Memory.last_seen_hostile && Game.time - Memory.last_seen_hostile < 1500) {
                return 0;
            }
            return 1;
        },
        args: {
            roomName: 'E37S46',
            targetId: util.constant.idStorage,
        }
    }
];

var creepManager = {
    updateConfigs: function() {
        // creepApi.clean();
        UpdateStructureStatus(util.myRoom());
        UpdateStructureStatus(util.myRoom2());
        for (var i = 0; i < configList.length; i++) {
            var conf = configList[i];
            creepApi.add(conf.name, conf.role, conf.args);
        }
    },

    run: function() {
        for (var spawnName in Game.spawns) {
            var spawn = Game.spawns[spawnName];
            if (spawn.spawning) {
                continue;
            }
            for (var i = 0; i < configList.length; i++) {
                var conf = configList[i];
                if (conf.spawn != spawnName) {
                    continue;
                }
                var numExist = _.filter(Game.creeps, (creep) => creep.memory.configName == conf.name).length;
                if (numExist < conf.require) {
                    var body = conf.body != null ? conf.body : conf.bodyDesigner(spawn.room.energyCapacityAvailable);
                    util.tryToSpawnCreep(spawn, body, conf.name + '_' + Game.time, {configName: conf.name});
                    break;
                }
            }
        }
    }
};

module.exports = creepManager;
