var util = require('util');
var creepCommon = require('creep.common');

module.exports = (args) => ({
    // args = {targetId, sourceIdList}
    // collect dropped energy or tombstone's energy

    source: creep => {
        if (creep.store.getUsedCapacity() == creep.store.getCapacity()) {
            return true;
        }

        /*console.log(`[INFO] I am recycler`);
        for (var i = 0; i < args.sourceIdList.length; i++) {
            console.log(`[INFO] - target: ${Game.getObjectById(args.sourceIdList[i])}`)
        }*/

        var sourceList = args.sourceIdList.map((id) => Game.getObjectById(id));
        if (sourceList.length == 0) {
            return true;
        }

        var source = creep.pos.findClosestByPath(sourceList, {range: 1});
        if (!source) {
            source = sourceList[0];
            // maybe no in same room, cannot find by findClosestByPath
        }

        if (!creep.pos.inRangeTo(source, 1)) {
            if (creep.store.getUsedCapacity() >= creep.store.getCapacity() * 0.8) {
                // almost full, move to target
                return true;
            }
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00', range: 1}});
            return false;
        }

        var result = creep.pickup(source);
        if (result == ERR_INVALID_TARGET) {
            // target need withdraw method
            const types = util.resourceTypeList;
            for (var i = types.length - 1; i >= 0; i--) {
                var type = types[i];
                if (source.store[type] > 0) {
                    creep.withdraw(source, type);
                    return false;
                }
            }
        }
        return false;
    },

    target: creep => {
        if (creep.store.getUsedCapacity() == 0) {
            return true;
        }
        const target = Game.getObjectById(args.targetId);
        if (!creep.pos.inRangeTo(target, 1)) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            return false;
        }
        const types = util.resourceTypeList;
        for (var i = 0; i < types.length; i++) {
            var type = types[i];
            if (creep.store[type] > 0) {
                creep.transfer(target, type);
                return false;
            }
        }
        return false;
    },

    wait: creepCommon.waitGotoPark2,
});
