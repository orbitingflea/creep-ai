var util = require('util');

module.exports = (args) => ({
    // arg.sourceId, arg.targetIdList
    
    source: creep => {
        const source = Game.getObjectById(args.sourceId);  // source 是一个 container / storage
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
        const targetList1 = _.filter(args.targetIdList.map(id => Game.getObjectById(id)),
                                     struc => (struc.structureType &&
                                        struc.energy < struc.energyCapacity &&
                                        struc.structureType != STRUCTURE_TOWER));
        const targetList2 = _.filter(args.targetIdList.map(id => Game.getObjectById(id)),
                                     struc => (struc.structureType == STRUCTURE_TOWER &&
                                        struc.energy < struc.energyCapacity * 0.8));
        const targetList3 = _.filter(args.targetIdList.map(id => Game.getObjectById(id)),
                                     creep => (util.getObjectType(creep) == 'creep' &&
                                               creep.store[RESOURCE_ENERGY] < creep.store.getCapacity() * 0.2));
        var target;
        if (targetList1.length > 0) {
            target = creep.pos.findClosestByPath(targetList1);
        } else if (targetList2.length > 0) {
            target = creep.pos.findClosestByPath(targetList2);
        } else if (targetList3.length > 0) {
            target = creep.pos.findClosestByPath(targetList3);
        } else {
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
