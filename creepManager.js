// 这个文件提供一个函数，定期重新计算所有 creep v2 的配置参数，并调用 creepApi 更新配置项。
// 这个文件规定了需要的 creep 集合。如果某种类型 creep 太少，则尝试 spawn。

var util = require('util');
var taskCommon = require('task.common');
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

var configList = [
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
                parkWhenWait: true,
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
                parkWhenWait: true,
            };
            return result;
        }
    },

    {
        name: 'carrier_to_upgrade',
        role: 'carrier',
        body: carrierMain,
        require: 1,
        argComputer: function() {
            var result = {
                sourceId: util.constant.idStorage,
                targetIdList: [util.constant.idContainerNearController],
                parkWhenWait: true,
            };
            return result;
        }
    },

    {
        name: "carrier_center",
        role: "carrierCenter",
        body: carrier100,
        require: 1,
        argComputer: function() {
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
        body: carrier500,
        require: 1,
        argComputer: function() {
            var targetId = util.constant.idStorage;
            var sourceIdList = [];
            try {
                var roomList = [util.myRoom(), util.myRoom2()];
                for (var i = 0; i < roomList.length; i++) {
                    var room = roomList[i];
                    sourceIdList = sourceIdList.concat(taskCommon.GetRecyclerTargets(room));
                }
                if (Game.getObjectById(util.constant.idContainerNearMineral).store[RESOURCE_LEMERGIUM] > 200) {
                    sourceIdList.push(util.constant.idContainerNearMineral);
                }
            } catch (error) {
                console.log(error);
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
        body: fullstackWorker,
        requireFunction: function() {
            if (util.myRoom().storage.store[RESOURCE_ENERGY] > 600000) {
                return 3;
            }
            if (util.myRoom().storage.store[RESOURCE_ENERGY] > 400000) {
                return 2;
            }
            var constructionSites = util.myRoom().find(FIND_MY_CONSTRUCTION_SITES);
            var ramparts = util.myRoom().find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_RAMPART &&
                        structure.hits < structure.hitsMax - 10000;
                }
            });
            if (constructionSites.length >= 3) {
                return 2;
            } else {
                return 1;
            }
        },
        argComputer: function() {
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
        bodyDesigner: (energy) => {
            return BodyWCM(Math.floor((energy - 50) / 100), 0, 1);
        },
        requireFunction: function() {
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
        body: carrier500,
        require: 2,
        argComputer: function() {
            var result = {
                sourceId: util.constant.idRoom2.container_near_source,
                targetIdList: [util.constant.idRoom2.container_near_controller, util.constant.idRoom2.storage],
                parkWhenWait: false,
            };
            return result;
        }
    },

    {
        name: 'carrier_n2',
        role: 'carrier',
        body: carrier500,
        require: 0,
        argComputer: function() {
            var result = {
                sourceId: util.constant.idRoom2.storage,
                targetIdList: util.getStructureIdListMayNeedEnergy(util.myRoom2()),
                parkWhenWait: false,
            };
            return result;
        }
    },

    {
        name: 'carrier_n_to_storage',
        role: 'carrier',
        body: carrier500,
        require: 0,
        argComputer: function() {
            var result = {
                sourceId: util.constant.idRoom2.container_near_controller,
                targetIdList: [util.constant.idStorage],
                parkWhenWait: true,
            };
            return result;
        }
    },

    {
        name: "worker_neighbor",
        role: "worker",
        body: BodyWCM(10, 10, 10),
        require: 1,
        argComputer: function() {
            var res = {
                sourceId: util.constant.idRoom2.storage,
                taskList: taskCommon.GetWorkerTasks(util.myRoom2()),
            };
            return res;
        },
    },

    {
        name: "upgrader_n",
        role: "upgrader",
        body: BodyWCM(10, 1, 6),
        require: 1,
        args: {
            controllerId: util.constant.idRoom2.controller,
            containerId: util.constant.idRoom2.container_near_controller,
        }
    },

    {
        name: "digger_n",
        role: "digger",
        body: BodyWCM(10, 0, 5),
        require: 1,
        args: {
            sourceId: util.constant.idRoom2.source,
            containerId: util.constant.idRoom2.container_near_source,
        }
    },

    // ---------- outer harvester ----------

    {
        name: "harvester_E38S46",
        role: "outer_harvester",
        body: BodyWCM(5, 15, 10),
        requireFunction: function() {
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
        body: BodyWCM(5, 15, 10),
        requireFunction: function() {
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
    }
];

var creepManager = {
    updateConfigs: function() {
        // creepApi.clean();
        for (var i = 0; i < configList.length; i++) {
            var conf = configList[i];
            var args = conf.args ? conf.args : conf.argComputer();
            creepApi.add(conf.name, conf.role, args);
        }
    },

    run: function() {
        var room = util.myRoom();
        var spawner = Game.spawns['Spawn1'];
        if (spawner.spawning) {
            return;
        }
        for (var i = 0; i < configList.length; i++) {
            var conf = configList[i];
            var numExist = _.filter(Game.creeps, (creep) => creep.memory.configName == conf.name).length;
            var confRequire = conf.requireFunction ? conf.requireFunction() : conf.require;
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
