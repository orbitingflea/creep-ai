var roleTower = {
    run: function(tower) {
        // attack nearest hostile creep
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) {
            tower.attack(target);
            return;
        }
        // repair damaged structure
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: (structure) => (structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_WALL)
        });
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
            return;
        }
    }
}

module.exports = roleTower;
