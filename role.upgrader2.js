var util = require('util');

module.exports = (args) => ({
    // args: {containerId, controllerId}

    prepare: creep => {
        if (!creep.pos.isEqualTo(Game.getObjectById(args.containerId).pos)) {
            creep.moveTo(Game.getObjectById(args.containerId), {visualizePathStyle: {stroke: '#ffaa00'}});
            return false;
        }
        return true;
    },

    source: creep => {
        const container = Game.getObjectById(args.containerId);
        if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity() ||
            creep.store[RESOURCE_ENERGY] > 0 && container.store[RESOURCE_ENERGY] == 0) {
            return true;
        }
        creep.withdraw(container, RESOURCE_ENERGY);
        return false;
    },

    target: creep => {
        const controller = Game.getObjectById(args.controllerId);
        if (creep.store[RESOURCE_ENERGY] == 0) {
            return true;
        }
        creep.upgradeController(controller);
        return false;
    }
});
