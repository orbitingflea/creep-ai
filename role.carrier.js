var util = require('util');

function carrierTargetPriority(obj) {
    if (obj.structureType) {
        // is a structure
        if (obj.energy == obj.energyCapacity) {
            return -1;
        }
        switch (obj.structureType) {
            case STRUCTURE_EXTENSION:
                return 100;
            case STRUCTURE_SPAWN:
                return 100;
            case STRUCTURE_TOWER:
                return obj.energy < obj.energyCapacity * 0.6 ? 80 : -1;
            case STRUCTURE_STORAGE:
                return 1;  // least priority
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
    // arg.sourceId, arg.targetIdList
    
    source: creep => {
        const source = Game.getObjectById(args.sourceId);  // source 是一个 container / storage
        var result = creep.withdraw(source, RESOURCE_ENERGY);
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            return false;
        }
        if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity() || source.store[RESOURCE_ENERGY] < 10) {
            return true;
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
        var target = util.closestObjectWithTopPriority(targetList, carrierTargetPriority, creep.pos);
        if (!target) {
            creep.say('No Target');
            return false;
        }
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            return false;
        }
        if (creep.store[RESOURCE_ENERGY] == 0) {
            return true;
        }
        return false;
    }
});
