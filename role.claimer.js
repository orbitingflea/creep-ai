// args = {controllerId}
var util = require('util');
var creepCommon = require('creep.common');

module.exports = (args) => ({
    prepare: creep => {
        creep.moveTo(new RoomPosition(31, 39, 'E39S45'));
        return false;
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
