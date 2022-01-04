// args = {controllerId}
var util = require('util');
var creepCommon = require('creep.common');

module.exports = (args) => ({
    prepare: creepCommon.prepareGotoObject(args.controllerId, 1),

    source: creep => {
        return true;
    },

    target: creep => {
        const target = Game.getObjectById(args.constrollerId);
        creep.claimController(target);
        return false;
    }
});
