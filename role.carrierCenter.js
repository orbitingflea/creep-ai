var util = require('util');
var creepCommon = require('creep.common');

module.exports = (args) => ({
    // args.storageId, args.linkId, args.terminalId, args.containerId
    // move from containerId and linkId to storageId

    prepare: creep => {
        console.log(`[DEBUG] ${args.getWorkingPosition} ${args.linkId}`);
        creepCommon.prepareGotoPosition(creep, creep.room.getPositionAt(args.getWorkingPosition[0], args.getWorkingPosition[1]));
    },

    source: creep => {
        if (creep.store.getUsedCapacity() == creep.store.getCapacity()) {
            return true;
        }

        const fromList = _.filter([Game.getObjectById(args.linkId), Game.getObjectById(args.containerId)],
            (o) => o && o.store.getUsedCapacity(RESOURCE_ENERGY) > 0);
        if (fromList.length == 0) {
            return true;
        }

        const source = fromList[0];
        creep.withdraw(source, RESOURCE_ENERGY);
        return false;
    },

    target: creep => {
        if (creep.store.getUsedCapacity() == 0) {
            return true;
        }
        const storage = Game.getObjectById(args.storageId);
        creep.transfer(storage, RESOURCE_ENERGY);
        return false;
    },

    wait: null,
});
