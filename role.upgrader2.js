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
        const source = Game.getObjectById(args.containerId);
        var result = creep.withdraw(source, RESOURCE_ENERGY);
        if (result == ERR_NOT_ENOUGH_RESOURCES) {
            creep.say('Empty');
            return true;
        }
        return true;
    },

    target: creep => {
        const container = Game.getObjectById(args.containerId);
        const controller = Game.getObjectById(args.controllerId);
        const result = creep.upgradeController(controller);
        if (result != OK) {
            return true;
        }
        return false;
    }
});
