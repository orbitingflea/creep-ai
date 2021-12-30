var util = {
    getObjectType: function(obj) {
        var str = obj.toString();
        if (str.indexOf("[creep ") == 0) {
            return 'creep';
        }
        var l = 1, r = str.indexOf(' #');
        if (str[0] == '[' && r != -1) {
            return str.substring(l, r);
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

    // find old version builders
    getBuilderCreepIdList(room) {
        return room.find(FIND_MY_CREEPS, {
            filter: (creep) => {
                return (creep.memory.role == 'builder');
            }
        }).map((obj) => obj.id);
    },

    // find old version upgraders
    getUpgraderCreepIdList(room) {
        return room.find(FIND_MY_CREEPS, {
            filter: (creep) => {
                return (creep.memory.role == 'upgrader');
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
        // console.log(`[DEBUG] spawn with res = ${res}`);
        return res == 0;
    },

    closestObjectWithTopPriority: function(targetList, priorityFunction, pos) {
        var targetListSorted = _.sortBy(targetList, priorityFunction).reverse();
        const n = targetListSorted.length;
        for (var i = 0; i < n; ) {
            var j = i + 1;
            while (j < n && priorityFunction(targetListSorted[j]) == priorityFunction(targetListSorted[i])) {
                j++;
            }
            var closest = pos.findClosestByPath(targetListSorted.slice(i, j));
            if (closest) {
                return closest;
            }
            i = j;
        }
        return null;
    },

    resourceTypeList: [
        RESOURCE_ENERGY,
        RESOURCE_POWER,
        RESOURCE_HYDROGEN,
        RESOURCE_OXYGEN,
        RESOURCE_UTRIUM,
        RESOURCE_LEMERGIUM,
        RESOURCE_KEANIUM,
        RESOURCE_ZYNTHIUM,
        RESOURCE_CATALYST,
        RESOURCE_GHODIUM,
        RESOURCE_HYDROXIDE,
        RESOURCE_ZYNTHIUM_KEANITE,
        RESOURCE_UTRIUM_LEMERGITE,
        RESOURCE_UTRIUM_HYDRIDE,
        RESOURCE_UTRIUM_OXIDE,
        RESOURCE_KEANIUM_HYDRIDE,
        RESOURCE_KEANIUM_OXIDE,
        RESOURCE_LEMERGIUM_HYDRIDE,
        RESOURCE_LEMERGIUM_OXIDE,
        RESOURCE_ZYNTHIUM_HYDRIDE,
        RESOURCE_ZYNTHIUM_OXIDE,
        RESOURCE_GHODIUM_HYDRIDE,
        RESOURCE_GHODIUM_OXIDE,
        RESOURCE_UTRIUM_ACID,
        RESOURCE_UTRIUM_ALKALIDE,
        RESOURCE_KEANIUM_ACID,
        RESOURCE_KEANIUM_ALKALIDE,
        RESOURCE_LEMERGIUM_ACID,
        RESOURCE_LEMERGIUM_ALKALIDE,
        RESOURCE_ZYNTHIUM_ACID,
        RESOURCE_ZYNTHIUM_ALKALIDE,
        RESOURCE_GHODIUM_ACID,
        RESOURCE_GHODIUM_ALKALIDE,
        RESOURCE_CATALYZED_UTRIUM_ACID,
        RESOURCE_CATALYZED_UTRIUM_ALKALIDE,
        RESOURCE_CATALYZED_KEANIUM_ACID,
        RESOURCE_CATALYZED_KEANIUM_ALKALIDE,
        RESOURCE_CATALYZED_LEMERGIUM_ACID,
        RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE,
        RESOURCE_CATALYZED_ZYNTHIUM_ACID,
        RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE,
        RESOURCE_CATALYZED_GHODIUM_ACID,
        RESOURCE_CATALYZED_GHODIUM_ALKALIDE
    ]
};

module.exports = util;