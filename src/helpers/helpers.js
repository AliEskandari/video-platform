export function userCanWatchVideo(isSubscribed, video) {
  if (isSubscribed) {
    return true;
  } else if (!video?.exclusive) {
    return true;
  } else {
    return false;
  }
}

export function isSubscribed(subscriptions, channelUserId) {
  return subscriptions?.includes(channelUserId);
}
