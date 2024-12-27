export const getRecentDates = (days = 7) => {
  return [...Array(days).keys()].map((i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  });
};

export const fetchCachedAnalytics = async (redisClient, cacheKey, fetchFn) => {
  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) return JSON.parse(cachedData);

  const analyticsData = await fetchFn();
  await redisClient.setEx(cacheKey, 3600, JSON.stringify(analyticsData));
  return analyticsData;
};

export const getClicksByDate = async (urlIds, days = 7) => {
  const recentDates = getRecentDates(days);

  return Promise.all(
    recentDates.map(async (date) => {
      const clickCount = await Analytic.count({
        where: {
          url_id: { [Op.in]: urlIds },
          createdAt: {
            [Op.between]: [
              new Date(`${date}T00:00:00Z`),
              new Date(`${date}T23:59:59Z`),
            ],
          },
        },
      });

      return { date, clickCount };
    })
  );
};

export const mapUserAgentData = (data, extractFn) => {
  return data.map((item) => ({
    name: extractFn(item.user_agent),
    uniqueClicks: item.dataValues.uniqueClicks,
    uniqueUsers: item.dataValues.uniqueUsers,
  }));
};
