module.exports = (arg) => ({
    // arg.sourceId, arg.targetIdList
    source: creep => {
        const source = Game.getObjectById(arg.sourceId);  // source 是一个 container / storage
        if (creep.withdraw(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            return false;
        }
        if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
            return true;
        }
        return false;
    },
    target: creep => {
        const targetList = _.filter(arg.targetIdList.map(id => Game.getObjectById(id)),
                                    struc => struc.energy < struc.energyCapacity);
        const target = creep.pos.findClosestByPath(targetList);
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
