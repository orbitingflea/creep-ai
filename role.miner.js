// args = {sourceId, targetId, containerId}
var util = require('util');
var creepCommon = require('creep.common');

module.exports = (args) => ({
    prepare: creepCommon.prepareGotoObject(args.containerId),

    source: creep => {
        const source = Game.getObjectById(args.sourceId);
        creep.harvest(source);
        return false;
    },

    target: creep => {
        return true;
    }
});
