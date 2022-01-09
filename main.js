var util = require('util');
var roleTower = require('role.tower');

require('creepApi');
require('mount.creep');
var memoryRoomObject = require('memory.roomObject');

var creepManager = require('creepManager');
var CarrierSystem = require('CarrierSystem');

function NewCreepLogic() {
    var room = Game.spawns['Spawn1'].room;
    if (Game.spawns['Spawn1'].spawning || room.energyAvailable < 100) {
        // cannot spawn anything, return
        return;
    }

    // New version creeps
    creepManager.run();
}

module.exports.loop = function() {
    // CreateCarrier1Logic();

    if (Game.cpu.bucket >= 10000) {
        Game.cpu.generatePixel();
    }

    // 清理无效的 creep memory
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clear invalid memory for Creep: ', name);
        }
    }
    if (!Memory.roomObjects) {
        Memory.roomObjects = {};
    }
    memoryRoomObject.CleanUp();
    CarrierSystem.Init();

    creepManager.updateConfigs();
    NewCreepLogic();

    // 让所有 creep 执行他们的角色
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.configName) {
            creep.work();
        }
    }

    // 让炮塔行动
    for (var name in Game.structures) {
        var structure = Game.structures[name];
        if (structure.structureType == STRUCTURE_TOWER) {
            roleTower.run(structure);
        }
    }

    // Link
    var RunLinkRoom1 = function() {
        var link1 = Game.getObjectById(util.constant.idLinkUp);
        var link2 = Game.getObjectById(util.constant.idLinkDown);
        if (link1.store[RESOURCE_ENERGY] == link1.store.getCapacity(RESOURCE_ENERGY) && link2.store[RESOURCE_ENERGY] == 0) {
            link1.transferEnergy(link2);
            return;
        }
        var link3 = Game.getObjectById(util.constant.idRoom1.linkLeft);
        if (link3.store[RESOURCE_ENERGY] >= 600 && link2.store[RESOURCE_ENERGY] == 0) {
            link3.transferEnergy(link2);
        }
    };
    RunLinkRoom1();

    // Link N
    var RunLinkRoom2 = function() {
        var nlink_s = Game.getObjectById(util.constant.idRoom2.link_near_source);
        var nlink_center = Game.getObjectById(util.constant.idRoom2.link_center);
        if (nlink_s.store[RESOURCE_ENERGY] >= 800 && nlink_center.store[RESOURCE_ENERGY] == 0) {
            nlink_s.transferEnergy(nlink_center);
        }
    };
    RunLinkRoom2();
};