var util = require('util');
var creepCommon = require('creep.common');

function carrierTargetPriority(obj) {
    if (obj.structureType) {
        // is a structure
        if (obj.store[RESOURCE_ENERGY] == obj.store.getCapacity(RESOURCE_ENERGY)) {
            return -1;
        }
        switch (obj.structureType) {
            case STRUCTURE_EXTENSION:
                return 100;
            case STRUCTURE_SPAWN:
                return 100;
            case STRUCTURE_TOWER:
                return 80;
            case STRUCTURE_CONTAINER:
                return 55;
            case STRUCTURE_STORAGE:
                return 10;  // least priority
            case STRUCTURE_LAB:
                return 20;
            default:
                return -1;
        }
    } else {
        // is a creep
        if (obj.store[RESOURCE_ENERGY] < obj.store.getCapacity() * 0.6) {
            return 50;
        }
        return -1;
    }
}

module.exports = (args) => ({
    // args.sourceId, args.targetIdList, args.parkWhenWait

    source: creep => {
        const source = Game.getObjectById(args.sourceId);  // source 是一个 container / storage
        if (creep.store.getUsedCapacity() == creep.store.getCapacity() || source.store[RESOURCE_ENERGY] < 50) {
            return true;
        }
        var result = creep.withdraw(source, RESOURCE_ENERGY);
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
        return false;
    },

    target: creep => {
        if (creep.store[RESOURCE_ENERGY] == 0) {
            return true;
        }
        const targetList = _.filter(args.targetIdList.map(id => Game.getObjectById(id)),
                                    (obj) => {
                                        return obj && carrierTargetPriority(obj) > 0;
                                    });
        if (targetList.length == 0) {
            return true;
        }

        for (var i = 0; i < targetList.length; i++) {
            console.log(`[DEBUG] target: ${targetList[i]}`);
        }

        var target = util.closestObjectWithTopPriority(targetList, carrierTargetPriority, creep.pos);
        if (!target) {
            target = targetList[0];
        }
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        return false;
    },

    wait: creep => {
        if (args.parkWhenWait) creepCommon.waitGotoPark(creep);
    },
});
