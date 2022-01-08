var util = require('util');
var roleTower = require('role.tower');

require('creepApi');
require('mount.creep');
require('memory/roomObject');

var creepManager = require('creepManager');

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
    require('./memory/roomObject').CleanUp();

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
    var link1 = Game.getObjectById(util.constant.idLinkUp);
    var link2 = Game.getObjectById(util.constant.idLinkDown);
    if (link1.store[RESOURCE_ENERGY] == link1.store.getCapacity(RESOURCE_ENERGY)) {
        link1.transferEnergy(link2);
    }
};