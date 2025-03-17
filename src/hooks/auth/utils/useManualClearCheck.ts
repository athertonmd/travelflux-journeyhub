
/**
 * Custom hook for checking if a manual clear operation is in progress
 */

export const useManualClearCheck = () => {
  // Check if a manual clear operation is in progress
  const isManualClearInProgress = () => {
    const status = sessionStorage.getItem('manual-clear-in-progress') === 'true';
    if (status) {
      console.log('Manual clear is in progress, ignoring auth events');
    }
    return status;
  };

  return { isManualClearInProgress };
};
