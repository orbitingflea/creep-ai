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
                                     struc => (struc.energy < struc.energyCapacity &&
                                               struc.structureType != STRUCTURE_TOWER));
        const targetList2 = _.filter(args.targetIdList.map(id => Game.getObjectById(id)),
                                     struc => (struc.energy < struc.energyCapacity &&
                                               struc.structureType == STRUCTURE_TOWER));
        var target;
        if (targetList1.length > 0) {
            target = creep.pos.findClosestByPath(targetList1);
        } else if (targetList2.length > 0) {
            target = creep.pos.findClosestByPath(targetList2);
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
