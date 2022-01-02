var util = require('util');

var creepCommon = {
    // 定义若干常用的方法

    waitGotoPark: (creep) => {
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
};

module.exports = creepCommon;
