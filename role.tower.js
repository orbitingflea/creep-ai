var roleTower = {
    getPriority: function(structure) {
        if (structure.structureType == STRUCTURE_TOWER) {
            return 100;
        } else if (structure.structureType == STRUCTURE_RAMPART) {
            return -1;
        } else if (structure.structureType == STRUCTURE_ROAD) {
            return 20;
        } else if (structure.structureType == STRUCTURE_CONTAINER) {
            return 0;
        } else if (structure.structureType == STRUCTURE_STORAGE) {
            return 0;
        } else {
            return 0;
        }
    },

    run: function(tower) {
        // attack nearest hostile creep
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) {
            tower.attack(target);
            return;
        }

        if (tower.energy < tower.energyCapacity * 0.4) {
            return;
        }

        // repair damaged structure
        var damagedStructure = tower.room.find(FIND_STRUCTURES, {
            filter: (structure) => (structure.hits < structure.hitsMax &&
                structure.structureType != STRUCTURE_RAMPART &&
                structure.structureType != STRUCTURE_WALL)
        });
        target = damagedStructure[0];
        // find the one with largest priority
        for (var i in damagedStructure) {
            if (this.getPriority(damagedStructure[i]) > this.getPriority(target)) {
                target = damagedStructure[i];
            }
        }
        if (target) {
            tower.repair(target);
            return;
        }
    }
};

module.exports = roleTower;
