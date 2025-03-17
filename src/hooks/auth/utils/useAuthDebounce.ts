
/**
 * Custom hook for debouncing auth state changes to prevent handling multiple events in quick succession
 */

export const useAuthDebounce = () => {
  // Create debounce controller for auth state changes
  const createDebounceController = () => {
    let lastHandledEvent = '';
    let lastHandledTime = 0;
    const debounceTime = 1000; // 1 second
    
    const shouldDebounce = (event: string) => {
      const now = Date.now();
      if (event === lastHandledEvent && now - lastHandledTime < debounceTime) {
        console.log(`Debouncing duplicate ${event} event`);
        return true;
      }
      
      // Update debounce tracking
      lastHandledEvent = event;
      lastHandledTime = now;
      return false;
    };
    
    return { shouldDebounce };
  };

  return { createDebounceController };
};
