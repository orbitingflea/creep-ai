var schedulerSpawner = require('scheduler.spawner');

var schedulerDigger = {
    // global group of functions
    // called per N=10 ticks
    // behavior:
    // 1. match containers with sources
    // 2. match containers with creeps
    // 3. spawn missing digger creeps

    designCreep: function(room) {
        var limit = Math.floor((room.energyCapacityAvailable - 50) / 100);
        if (limit >= 20) {
            limit = 20;
        }
        var body = [MOVE];
        for (var i = 0; i < limit; i++) {
            body.push(WORK);
        }
        return body;
    },

    run: function(room) {
        var containers = room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_CONTAINER }
        });
        var sources = room.find(FIND_SOURCES);
        var creeps = room.find(FIND_MY_CREEPS, {
            filter: (creep) => {
                return creep.memory.role == 'digger';
            }
        });
        for (c in container) {
            var father = null;
            for (s in sources) {
                if (c.pos.isNearTo(s)) {
                    father = s;
                    break;
                }
            }
            if (father) {
                if (_.filter(creeps, (creep) =>
                    (creep.memory.role == 'digger' &&
                     creep.memory.sourceId == father.id &&
                     creep.memory.containerId == c.id)).length == 0) {
                    schedulerSpawner.RequestCreep('digger_' + c.id,
                                                  this.designCreep(room),
                                                  {
                                                      role: 'digger',
                                                      sourceId: father.id,
                                                      containerId: c.id
                                                  });
                }
            }
        }
    }
}

module.exports = schedulerDigger;
