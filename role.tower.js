var roleTower = {
    run: function(tower) {
        // attack nearest hostile creep
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) {
            tower.attack(target);
            return;
        }
        // repair damaged structure
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
    }
}

module.exports = roleTower;
