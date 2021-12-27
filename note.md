# 常用短语

creep.carry.energy == creep.carryCapacity  // old style
creep.room 所属房间
object.hits 生命值
object.hitsMax 最大生命值

Math.random() \in [0, 1]
creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});

if(creep.store[RESOURCE_ENERGY] < creep.store.getCapacity()) {
    goHarvest(creep);
}

const source = Game.getObjectById(creep.memory.sourceId);

# scheduler

1. 给每个 source 安排 digger
2. digger_scheduler.js
3. carrier_scheduler.js
4. carrier_creep.js
5. spawn_scheduler
