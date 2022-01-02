var util = require('util');

module.exports = (args) => ({
    // args.targetId
    // collect dropped energy or tombstone's energy

    source: creep => {
        if (creep.store.getUsedCapacity() == creep.store.getCapacity()) {
            return true;
        }

        var room = Game.getObjectById(args.targetId).room;
        const droppedList = room.find(FIND_DROPPED_RESOURCES);
        const tombList = room.find(FIND_TOMBSTONES, {
            filter: (tomb) => {
                return tomb.store.getUsedCapacity() > 0;
            }
        });
        const ruinList = room.find(FIND_RUINS, {
            filter: (ruin) => {
                return ruin.store.getUsedCapacity() > 0;
            }
        });

        if (droppedList.length == 0 && tombList.length == 0 && ruinList.length == 0) {
            return true;
        }
        
        const source = creep.pos.findClosestByPath(droppedList.concat(tombList).concat(ruinList));
        if (!source) {
            creep.say('No Reachable');
            return false;
        }

        if (!creep.pos.inRangeTo(source, 1)) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
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
            }
        }
        return false;
    },

    wait: creep => {
        creep.moveTo(util.parkPosition(), { range: 1 });
    },
});
