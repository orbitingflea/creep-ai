var util = require('util');

var creepCommon = {
    // 定义若干常用的方法

    waitGotoPark: (creep) => {
        creep.moveTo(util.parkPosition(), { range: 1 });
    },

    waitGotoPark2: () => (creep) => {
        if (creep.room == util.myRoom()) {
            creep.moveTo(util.parkPosition(), { range: 1 });
        } else {
            creep.moveTo(util.parkPosition2(), { range: 1 });
        }
    },

    prepareGotoPosition: (creep, pos) => {
        if (!creep.pos.isEqualTo(pos)) {
            creep.moveTo(pos, {visualizePathStyle: {stroke: '#ffaa00'}});
            return false;
        }
        return true;
    },

    prepareGotoPosition2: (posXY) => (creep) => {
        const pos = creep.room.getPositionAt(...posXY);
        if (!creep.pos.isEqualTo(pos)) {
            creep.moveTo(pos, {visualizePathStyle: {stroke: '#ffaa00'}});
            return false;
        }
        return true;
    },

    prepareGotoObject: (id) => (creep) => {
        const obj = Game.getObjectById(id);
        if (!creep.pos.inRangeTo(obj.pos, 0)) {
            creep.moveTo(obj, {visualizePathStyle: {stroke: '#ffaa00'}});
            return false;
        }
        return true;
    },

    prepareGotoObjectInRange: (id, range) => (creep) => {
        const obj = Game.getObjectById(id);
        if (!creep.pos.inRangeTo(obj.pos, range)) {
            creep.moveTo(obj, {visualizePathStyle: {stroke: '#ffaa00', range: range}});
            return false;
        }
        return true;
    },

    sourceById: sourceId => creep => {
        const source = Game.getObjectById(sourceId);
        const type = util.getObjectType(source);
        if (creep.store.getUsedCapacity() == creep.store.getCapacity() ||
            (type == 'source' && source.energy == 0) ||
            (type.indexOf('storage') != -1 && source.store[RESOURCE_ENERGY] <= util.constant.storage_safe_energy)) {
            return true;
        }
        if (creep.pos.inRangeTo(source, 1)) {
            if (type != 'source') {
                creep.withdraw(source, RESOURCE_ENERGY);
            } else {
                creep.harvest(source);
            }
        } else {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00', range: 1}});
        }
        return false;
    },
};

module.exports = creepCommon;
