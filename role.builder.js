var roleBuilder = {
    // 现在还是一个愚蠢的 builder

    /** @param {Creep} creep **/

    pickMode: function(creep) {
        if (creep.carry.energy > 0) {
            if (Math.random() < 0.5) {
                creep.memory.mode = 'repair';
                creep.say('Repair');
            } else {
                creep.memory.mode = 'build';
                creep.say('Build');
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
            var target = targets[0];
            var tower_list = _.filter(targets, (obj) => (obj.structureType == STRUCTURE_TOWER));
            if (tower_list.length > 0) {
                target = tower_list[0];
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
