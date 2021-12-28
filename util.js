var util = {
    getObjectType: function(obj) {
        var str = obj.toString();
        if (str.indexOf("[creep ") == 0) {
            return 'creep';
        }
        var l = 1, r = str.indexOf(' #');
        if (str[0] == '[' && r != -1) {
            return str.substr(l, r - l);
        } else {
            return 'unknown';
        }
    },

    getStructureIdListMayNeedEnergy: function(room) {
        return room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER);
            }
        }).map((obj) => obj.id);
    },

    getBuilderCreepIdList(room) {
        return room.find(FIND_MY_CREEPS, {
            filter: (creep) => {
                return (creep.memory.role == 'builder');
            }
        }).map((obj) => obj.id);
    },

    myRoom: function() {
        return Game.spawns['Spawn1'].room;
    },

    tryToSpawnCreep: function(body, name, memory) {
        var res = Game.spawns['Spawn1'].spawnCreep(body, name, {
            memory: memory
        });
        return res == 0;
    }
};

module.exports = util;