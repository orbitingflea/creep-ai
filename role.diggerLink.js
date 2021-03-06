module.exports = (args) => ({
    // args: {sourceId, containerId, linkId}

    prepare: creep => {
        if (!creep.pos.isEqualTo(Game.getObjectById(args.containerId).pos)) {
            creep.moveTo(Game.getObjectById(args.containerId), {visualizePathStyle: {stroke: '#ffaa00'}});
            return false;
        }
        return true;
    },

    source: creep => {
        const source = Game.getObjectById(args.sourceId);
        const container = Game.getObjectById(args.containerId);
        if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
            return true;
        }

        // if exist dropped resource, pickup
        var resList = container.pos.lookFor(LOOK_RESOURCES);
        for (var i = 0; i < resList.length; i++) {
            var res = resList[i];
            if (res.resourceType == RESOURCE_ENERGY) {
                creep.pickup(res);
                return false;
            }
        }

        if (container.store[RESOURCE_ENERGY] >= creep.store.getCapacity()) {
            creep.withdraw(container, RESOURCE_ENERGY);
        } else {
            creep.harvest(source);
        }
        return false;
    },

    target: creep => {
        const link = Game.getObjectById(args.linkId);
        if (link.store[RESOURCE_ENERGY] == link.store.getCapacity(RESOURCE_ENERGY) || creep.store[RESOURCE_ENERGY] == 0) {
            return true;
        }
        creep.transfer(link, RESOURCE_ENERGY);
        return false;
    },

    wait: creep => {
        const source = Game.getObjectById(args.sourceId);
        creep.harvest(source);
    }
});
