var util = require('util');

module.exports = (args) => ({
    // args.targetId
    // collect dropped energy or tombstone's energy

    source: creep => {
        if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
            return true;
        }

        var room = Game.getObjectById(args.targetId).room;
        const droppedList = room.find(FIND_DROPPED_RESOURCES, {
            filter: (resource) => {
                return resource.resourceType == RESOURCE_ENERGY;
            }
        });
        const tombList = room.find(FIND_TOMBSTONES, {
            filter: (tomb) => {
                return tomb.store[RESOURCE_ENERGY];
            }
        });
        if (droppedList.length == 0 && tombList.length == 0) {
            return true;
        }
        const source = creep.pos.findClosestByPath(droppedList.concat(tombList));
        if (!source) {
            creep.say('Not Reachable');
            return false;
        }

        var result = creep.withdraw(source, RESOURCE_ENERGY);
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            return false;
        }
        if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
            return true;
        }
        return false;
    },

    target: creep => {
        if (creep.store[RESOURCE_ENERGY] == 0) {
            return true;
        }
        const target = Game.getObjectById(args.targetId);
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            return false;
        }
        if (creep.store[RESOURCE_ENERGY] == 0) {
            return true;
        }
    }
});
