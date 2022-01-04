// args = {controllerId}
var util = require('util');
var creepCommon = require('creep.common');

module.exports = (args) => ({
    prepare: creep => {
        const roomName = 'E39S45';
        const controller = Game.getObjectById(args.controllerId);
        if (controller) {
            if (creep.pos.inRangeTo(controller, 1)) {
                return true;
            } else {
                creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffffff'}});
                return false;
            }
        } else {
            creep.moveTo(new RoomPosition(10, 10, roomName));
            return false;
        }
    },

    source: creep => {
        return true;
    },

    target: creep => {
        const target = Game.getObjectById(args.constrollerId);
        creep.claimController(target);
        return false;
    }
});
