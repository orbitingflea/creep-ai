var roleBuilder = {
    // 现在还是一个愚蠢的 builder

    /** @param {Creep} creep **/

    getPriority: function(structure) {
        if (structure.structureType == STRUCTURE_TOWER) {
            return 10;
        } else if (structure.structureType == STRUCTURE_WALL) {
            return 5;
        } else if (structure.structureType == STRUCTURE_RAMPART) {
            return 4;
        } else if (structure.structureType == STRUCTURE_ROAD) {
            return 0;
        } else if (structure.structureType == STRUCTURE_CONTAINER) {
            return 0;
        } else if (structure.structureType == STRUCTURE_STORAGE) {
            return 0;
        } else {
            return 0;
        }
    },

    pickMode: function(creep) {
        if (creep.carry.energy > 0) {
            if (Math.random() < 0.5) {
                creep.memory.mode = 'build';
                creep.say('Build');
            } else {
                creep.memory.mode = 'repair';
                creep.say('Repair');
            }
        } else {
            creep.memory.mode = 'harvest';
        }
    },

    runHarvest: function(creep) {
        var sources = creep.room.find(FIND_SOURCES, {
            filter: (source) => {
                return source.energy > 0;
            }
        });
        if (sources.length == 0 || creep.carry.energy == creep.carryCapacity) {
            this.pickMode(creep);
            return;
        }
        var source = creep.pos.findClosestByPath(sources);
        if (!source) {
            if (creep.carry.energy > 0) {
                this.pickMode(creep);
                return;
            }
            // wait at the nearest source
            source = creep.pos.findClosestByPath(creep.room.find(FIND_SOURCES));
        }
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    },

    runBuild: function(creep) {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length) {
            // let target be the one in targets with highest priority
            var target = targets[0];
            for (var i in targets) {
                if (this.getPriority(targets[i]) > this.getPriority(target)) {
                    target = targets[i];
                }
            }
            if (creep.build(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        if (targets.length == 0 || creep.carry.energy == 0) {
            this.pickMode(creep);
        }
    },

    runRepair: function(creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (obj) => obj.hits < obj.hitsMax && obj.structureType != STRUCTURE_WALL
        });
        if (targets.length == 0 || creep.carry.energy == 0) {
            this.pickMode(creep);
        }
        var target = creep.pos.findClosestByPath(targets);
        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    },

    run: function(creep) {
        if (!creep.memory.mode) {
            creep.memory.mode = 'harvest';
        }
        switch (creep.memory.mode) {
        case 'harvest':
            this.runHarvest(creep);
            break;
        case 'repair':
            this.runRepair(creep);
            break;
        case 'build':
            this.runBuild(creep);
            break;
        default:
            this.pickMode(creep);
        }
    }
};

module.exports = roleBuilder;
