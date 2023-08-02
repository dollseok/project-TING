import { useEffect } from 'react';

import useForceUpdate from './useForceUpdate';

import { messageStore } from './MessageStore';

export default function useMessageStore() {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    messageStore.subscribe(forceUpdate);

    return () => messageStore.unsubscribe(forceUpdate);
  }, [forceUpdate]);

  return messageStore;
}