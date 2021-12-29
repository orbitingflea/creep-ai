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
        if (creep.withdraw(source) == ERR_NOT_ENOUGH_RESOURCES) {
            creep.say('Empty');
        }
        return true;
    },

    target: creep => {
        const container = Game.getObjectById(args.containerId);
        const controller = Game.getObjectById(args.controllerId);
        const result = creep.upgradeController(controller);
        if (result != OK) {
            creep.say(result);
        }
        creep.withdraw(container);
        return false;
    }
});