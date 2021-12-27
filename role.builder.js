var roleBuilder = {
    // 现在还是一个愚蠢的 builder

    /** @param {Creep} creep **/

    pickMode: function(creep) {
        if (creep.carry.energy > 0) {
            if (Math.random() < 0.5) {
                creep.memory.mode = 'repair';
            } else {
                creep.memory.mode = 'build';
            }
        } else {
            creep.memory.mode = 'harvest';
        }
    },

    runHarvest: function(creep) {
        console.log('builder at harvest mode');
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
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    },

    runBuild: function(creep) {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length) {
            if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        if (targets.length == 0 || creep.carry.energy == 0) {
            this.pickMode(creep);
        }
    },

    runRepair: function(creep) {
        var targets = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (obj) => obj.hits < obj.hitsMax - 5
        });
        if (targets.length == 0 || creep.carry.energy == 0) {
            this.pickMode(creep);
        }
        var target = creep.pos.findClosestByPath(sources);
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
