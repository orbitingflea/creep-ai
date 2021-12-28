var roleUpgrader = {
    /** @param {Creep} creep **/

    // 搬运最近的能量，并输送给唯一的控制中心
    // memory.upgrading 表示工作状态是否是 upgrading

    run: function(creep) {
        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
        }

        if (creep.memory.upgrading) {
            if (creep.pos.x > 17 || creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.getPositionAt(16, 37), {
                    visualizePathStyle: {stroke: '#ffffff'},
                    range: 1
                });
                return;
            }
        } else {
            var sources = creep.room.find(FIND_SOURCES);
            var source = creep.pos.findClosestByPath(sources, {
                filter: (source) => {
                    return source.energy > 0;
                }
            });
            if (!source) {
                creep.memory.upgrading = true;
            }
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                return;
            }
        }

        creep.moveTo(creep.room.getPositionAt(16, 33), {range: 2});
    }
};

module.exports = roleUpgrader;
