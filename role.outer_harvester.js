var util = require('util');

function HasHostileCreepWithAttack(room) {
    var hostileCreepList = room.find(FIND_HOSTILE_CREEPS);
    for (var i = 0; i < hostileCreepList.length; i++) {
        if (hostileCreepList[i].getActiveBodyparts(ATTACK) > 0) {
            return true;
        }
    }
    return false;
}

module.exports = (args) => ({
    // args: {roomName, targetId}

    prepare: null,

    source: creep => {
        if (HasHostileCreepWithAttack(creep.room)) {
            Memory.last_seen_hostile = Game.time;
        }
        
        if (creep.store.getUsedCapacity() == creep.store.getCapacity()) {
            return true;
        }
        if (creep.room.name != args.roomName) {
            creep.moveTo(new RoomPosition(25, 25, args.roomName), {visualizePathStyle: {stroke: '#ffffff', range: 10}});
            return false;
        }
        const room = creep.room;

        const droppedList = room.find(FIND_DROPPED_RESOURCES, {
            filter: (resource) => {
                return resource.resourceType == RESOURCE_ENERGY;
            }
        });
        const tombList = room.find(FIND_TOMBSTONES, {
            filter: (tomb) => {
                return tomb.store[RESOURCE_ENERGY] > 0;
            }
        });
        const ruinList = room.find(FIND_RUINS, {
            filter: (ruin) => {
                return ruin.store[RESOURCE_ENERGY] > 0;
            }
        });
        var source = creep.pos.findClosestByPath(droppedList.concat(tombList).concat(ruinList));
        if (!source) source = creep.room.find(FIND_SOURCES)[0];

        if (!creep.pos.inRangeTo(source, 1)) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff', range: 1}});
            return false;
        }
        if (util.getObjectType(source) == 'source') {
            creep.harvest(source);
            return false;
        }
        var result = creep.pickup(source);
        if (result == ERR_INVALID_TARGET) {
            // target need withdraw method
            // only takes energy
            creep.withdraw(source, RESOURCE_ENERGY);
        }
        return false;
    },

    target: creep => {
        if (HasHostileCreepWithAttack(creep.room)) {
            Memory.last_seen_hostile = Game.time;
        }

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
});
