const Topic = require("../../models/Topic");

// insert or update Topic
const upsertTopic = async (topicItem, trans) => {
  const [topic, created] = await Topic.upsert(topicItem, {
    transaction: trans
  });
  return [topic, created];
};

module.exports = {
  upsertTopic
};
