var schedulerDigger = {
    // global group of functions
    // called per N=10 ticks
    // behavior:
    // 1. match containers with sources
    // 2. match containers with creeps
    // 3. spawn missing digger creeps

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
                
            }
        }
    }
}
