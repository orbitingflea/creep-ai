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
        const link = Game.getObjectById(args.linkId);
        const source = Game.getObjectById(args.sourceId);
        const container = Game.getObjectById(args.containerId);
        if (creep.store[RESOURCE_ENERGY] == creep.getStoreCapacity() && link.store[RESOURCE_ENERGY] < link.getStoreCapacity()) {
            creep.transfer(link, RESOURCE_ENERGY);
            return false;
        }
        
        creep.harvest(source);
        return false;
    },

    target: creep => {
        return true;
    }
});
