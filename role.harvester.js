var roleHarvester = {
    /** @param {Creep} creep **/
    /*
        规定了一只 harvester creep 在每个 tick 的行为。
        用 memory.mode == 'getting' 表示当前任务是走到最近的能量源并从中收集能量。
        用 memory.mode == 'giving' 表示当前任务是找到最近的需要能量的物体并将能量送到它。
        用 memory.mode == 'upgrading' 表示没有可以接受能量的物体，所以暂时执行一轮升级任务。
        TODO 缓存路径。
    */

    run: function(creep) {
        if (!creep.memory.mode || creep.carry.energy == 0) {
            creep.memory.mode = 'getting';
        } else if (creep.memory.mode == 'getting' && creep.carry.energy == creep.carryCapacity) {
            creep.memory.mode = 'giving';
        }

        if (creep.memory.mode == 'getting') {
            var sources = creep.room.find(FIND_SOURCES);
            var source = creep.pos.findClosestByPath(sources, {
                filter: (source) => {
                    return source.energy > 0;
                }
            });
            if (!source) {
                // creep.memory.mode = 'giving';
                creep.moveTo(creep.room.getPositionAt(16, 33), {range: 2});
                return;
            }
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            return;
        } else if (creep.memory.mode == 'giving') {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                }
            });
            if (targets.length == 0) {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
                });
            }
            if (targets.length == 0) {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE);
                    }
                });
            }
            if (targets.length > 0) {
                var target = creep.pos.findClosestByPath(targets);
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            } else {
                // creep.memory.mode = 'upgrading';
                // wait.
            }
        }

        if (creep.memory.mode == 'upgrading') {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}, range: 3});
            }
            return;
        }

        creep.moveTo(creep.room.getPositionAt(16, 33), {range: 2});
    }
};

module.exports = roleHarvester;
