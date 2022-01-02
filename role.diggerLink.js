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
        if (container.store[RESOURCE_ENERGY] >= creep.store.getCapacity()) {
            creep.withdraw(container, RESOURCE_ENERGY);
        } else {
            creep.harvest(source);
        }
        return false;
    },

    target: creep => {
        const link = Game.getObjectById(args.linkId);
        if (link.store[RESOURCE_ENERGY] == link.getStoreCapacity() || creep.store[RESOURCE_ENERGY] == 0) {
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
