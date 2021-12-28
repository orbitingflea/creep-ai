var roleCarrier = {
    /** @param {Creep} creep **/
    
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
                if (creep.carry.energy > 0) {
                    creep.memory.mode = 'giving';
                    return;
                }
                // 去最近的 source 等着
                source = creep.pos.findClosestByPath(sources);
            }
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else if (creep.memory.mode == 'giving') {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                }
            });
            if (targets.length == 0) {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
                });
            }
            if (targets.length > 0) {
                var target = creep.pos.findClosestByPath(targets);
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                // creep.memory.mode = 'upgrading';
                // wait.
            }
        }

        if (creep.memory.mode == 'upgrading') {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}, range: 3});
            }
        }
    }
};

module.exports = roleCarrier;
