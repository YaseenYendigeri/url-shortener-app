import crypto from "crypto";

export const generateShortUrl = (customAlias) => {
  if (customAlias) return customAlias;
  return crypto.randomBytes(6).toString("base64").slice(0, 8);
};

export const extractOSName = (userAgent) => {
  if (/windows/i.test(userAgent)) return "Windows";
  if (/mac/i.test(userAgent)) return "macOS";
  if (/linux/i.test(userAgent)) return "Linux";
  if (/android/i.test(userAgent)) return "Android";
  if (/iphone|ipad|ios/i.test(userAgent)) return "iOS";
  return "Unknown";
};

export const extractDeviceType = (userAgent) => {
  if (/mobile/i.test(userAgent)) return "Mobile";
  if (/tablet/i.test(userAgent)) return "Tablet";
  return "Desktop";
};

export const detectOS = (analytics) => {
  const osMap = {};

  analytics.forEach(({ user_agent, ip_address }) => {
    const osName = user_agent.includes("Windows")
      ? "Windows"
      : user_agent.includes("Mac")
      ? "macOS"
      : user_agent.includes("Linux")
      ? "Linux"
      : user_agent.includes("iPhone")
      ? "iOS"
      : user_agent.includes("Android")
      ? "Android"
      : "Other";

    if (!osMap[osName]) {
      osMap[osName] = { uniqueClicks: 0, uniqueUsers: new Set() };
    }

    osMap[osName].uniqueClicks += 1;
    osMap[osName].uniqueUsers.add(ip_address);
  });

  return Object.entries(osMap).map(([osName, data]) => ({
    osName,
    uniqueClicks: data.uniqueClicks,
    uniqueUsers: data.uniqueUsers.size,
  }));
};

export const detectDeviceType = (analytics) => {
  const deviceMap = {};

  analytics.forEach(({ user_agent, ip_address }) => {
    const deviceName = /Mobile|Android|iPhone/i.test(user_agent)
      ? "mobile"
      : "desktop";

    if (!deviceMap[deviceName]) {
      deviceMap[deviceName] = { uniqueClicks: 0, uniqueUsers: new Set() };
    }

    deviceMap[deviceName].uniqueClicks += 1;
    deviceMap[deviceName].uniqueUsers.add(ip_address);
  });

  return Object.entries(deviceMap).map(([deviceName, data]) => ({
    deviceName,
    uniqueClicks: data.uniqueClicks,
    uniqueUsers: data.uniqueUsers.size,
  }));
};
