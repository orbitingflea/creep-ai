var roleTower = require('role.tower');

require('creepApi');
require('mount.creep');

var creepManager = require('creepManager');
var util = require('util');

function HarvesterThroughput(n_work, n_carry, n_move) {
    // 假设往返距离都是 50 格，并且都是平原。
    var load = n_carry * 50;
    var load_time = load / n_work;
    var distance_assumption = 50;
    var move_latency_fast = Math.ceil(n_work / n_move);
    var move_latency_slow = Math.ceil((n_work + n_carry) / n_move);
    var time_consumed = load_time + distance_assumption * move_latency_slow + distance_assumption * move_latency_fast;
    return load / time_consumed;
}

function BuilderThroughput(n_work, n_carry, n_move) {
    // 假设往返距离都是 25 格，并且都是平原。
    var load = n_carry * 50;
    var load_time = load / n_work;
    var distance_assumption = 25;
    var move_latency_fast = Math.ceil(n_work / n_move);
    var move_latency_slow = Math.ceil((n_work + n_carry) / n_move);
    var time_consumed = 2 * load_time + distance_assumption * move_latency_slow + distance_assumption * move_latency_fast;
    return load / time_consumed;
}

function WorkerDesigner(energyLimit, Efficiency=HarvesterThroughput) {
    var body = [];
    var energy = 200;
    var n_work = 1, n_carry = 1, n_move = 1;
    while (energy + 50 <= energyLimit) {
        // use function HarvesterThroughput to compute the efficiency of harvester
        // add one of these three parts with the highest efficiency
        var eff_work = energy + 100 <= energyLimit ? Efficiency(n_work + 0.5, n_carry, n_move) : -1;
        var eff_carry = Efficiency(n_work, n_carry + 1, n_move);
        var eff_move = Efficiency(n_work, n_carry, n_move + 1);
        if (eff_work > eff_carry && eff_work > eff_move) {
            energy += 100;
            n_work++;
        } else if (eff_carry > eff_work && eff_carry > eff_move) {
            energy += 50;
            n_carry++;
        } else {
            energy += 50;
            n_move++;
        }
    }
    for (var i = 0; i < n_work; i++) {
        body.push(WORK);
    }
    for (var i = 0; i < n_carry; i++) {
        body.push(CARRY);
    }
    for (var i = 0; i < n_move; i++) {
        body.push(MOVE);
    }
    return body;
}

function HarvesterDesigner(energyLimit) {
    return WorkerDesigner(energyLimit, HarvesterThroughput);
}

function UpgraderDesigner(energyLimit) {
    return WorkerDesigner(energyLimit, BuilderThroughput);  // efficiency computation same as builder
}

function BuilderDesigner(energyLimit) {
    return WorkerDesigner(energyLimit, BuilderThroughput);
}

function TryToSpawnCreep(body, name, memory) {
    var res = Game.spawns['Spawn1'].spawnCreep(body, name, {
        memory: memory
    });
    if (res == 0) {
        console.log('Spawn1 spawns Creep: ' + name);
        console.log('with body: ' + body);
        return true;
    }
    console.log('spawn fail: ' + res);
    console.log('with body: ' + body);
    return false;
}

function RoomFullEnergy(room) {
    return room.energyAvailable == room.energyCapacityAvailable;
}

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

module.exports.HarvesterDesigner = HarvesterDesigner;