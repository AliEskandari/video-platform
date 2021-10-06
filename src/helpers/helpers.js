export function userCanWatchVideo(authUser, isSubscribed, video) {
  if (isSubscribed) {
    return true;
  } else if (authUser?.uid == video?.userId) {
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
