var util = require('util');

module.exports = (args) => ({
    // args: {sourceRoom, sourceId, targetRoom, targetId}

    prepare: null,

    source: creep => {
        if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
            return true;
        }
        const s_room = Game.rooms[args.sourceRoom];
        if (creep.room != s_room) {
            creep.moveTo(new RoomPosition(25, 25, args.sourceRoom), {visualizePathStyle: {stroke: '#ffaa00', range: 10}});
            return false;
        }
        const source = Game.getObjectById(args.sourceId);
        if (creep.pos.inRangeTo(source, 1)) {
            creep.harvest(source);
        } else {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00', range: 1}});
        }
        return false;
    },

    target: creep => {
        if (creep.store[RESOURCE_ENERGY] == 0) {
            return true;
        }
        const target = Game.getObjectById(args.targetId);
        if (creep.pos.inRangeTo(target, 1)) {
            creep.transfer(target, RESOURCE_ENERGY);
        } else {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff', range: 1}});
        }
        return false;
    },
});
