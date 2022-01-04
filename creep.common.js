var util = require('util');

var creepCommon = {
    // 定义若干常用的方法

    waitGotoPark: (creep) => {
        creep.moveTo(util.parkPosition(), { range: 1 });
    },

    waitGotoPark2: () => (creep) => {
        creep.moveTo(util.parkPosition(), { range: 1 });
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
};

module.exports = creepCommon;
