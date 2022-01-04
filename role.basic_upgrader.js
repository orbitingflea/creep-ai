var util = require('util');

module.exports = (args) => ({
    // args: {sourceId, controllerId}

    prepare: null,

    source: creep => {
        const source = Game.getObjectById(args.sourceId);
        if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity() || source.energy == 0) {
            return true;
        }
        if (creep.inRangeTo(source, 1)) {
            creep.harvest(source);
        } else {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00', range: 1}});
        }
        return false;
    },

    target: creep => {
        const controller = Game.getObjectById(args.controllerId);
        if (creep.store[RESOURCE_ENERGY] == 0) {
            return true;
        }
        if (creep.inRangeTo(controller, 3)) {
            creep.upgradeController(controller);
        } else {
            creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffffff', range: 3}});
        }
        return false;
    }
});
