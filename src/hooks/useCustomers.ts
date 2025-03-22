
import { useState, useMemo } from 'react';
import { Traveler, TravelerFilters } from '@/types/customer.types';

export const useCustomers = (travelers: Traveler[], itemsPerPage: number = 8) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<TravelerFilters>({
    name: '',
    email: '',
    clientName: '',
    phoneNumber: '',
    isMobileUser: '',
    recordLocator: ''
  });
  
  // Sort travelers by enrollment date (most recent first)
  const sortedTravelers = useMemo(() => {
    return [...travelers].sort((a, b) => 
      new Date(b.enrolledDate).getTime() - new Date(a.enrolledDate).getTime()
    );
  }, [travelers]);

  // Filter travelers based on search query and active filters
  const filteredTravelers = useMemo(() => {
    return sortedTravelers.filter(traveler => {
      // Check if traveler matches the search query
      const matchesSearch = searchQuery === '' || 
        traveler.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        traveler.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        traveler.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        traveler.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        traveler.recordLocator.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Check if traveler matches all active filters
      const matchesFilters = 
        (activeFilters.name === '' || traveler.name.toLowerCase().includes(activeFilters.name.toLowerCase())) &&
        (activeFilters.email === '' || traveler.email.toLowerCase().includes(activeFilters.email.toLowerCase())) &&
        (activeFilters.clientName === '' || traveler.clientName === activeFilters.clientName) &&
        (activeFilters.phoneNumber === '' || traveler.phoneNumber.includes(activeFilters.phoneNumber)) &&
        (activeFilters.isMobileUser === '' || 
          (activeFilters.isMobileUser === 'yes' && traveler.isMobileUser) || 
          (activeFilters.isMobileUser === 'no' && !traveler.isMobileUser)
        ) &&
        (activeFilters.recordLocator === '' || traveler.recordLocator.toLowerCase().includes(activeFilters.recordLocator.toLowerCase()));
      
      return matchesSearch && matchesFilters;
    });
  }, [sortedTravelers, searchQuery, activeFilters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTravelers.length / itemsPerPage);
  const currentTravelers = filteredTravelers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle filter change
  const handleFilterChange = (filter: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filter]: value
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters({
      name: '',
      email: '',
      clientName: '',
      phoneNumber: '',
      isMobileUser: '',
      recordLocator: ''
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Get unique client names for filter dropdown
  const uniqueClients = useMemo(() => {
    const clients = new Set(travelers.map(traveler => traveler.clientName));
    return Array.from(clients);
  }, [travelers]);

  return {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    activeFilters,
    handleFilterChange,
    clearFilters,
    filteredTravelers,
    currentTravelers,
    totalPages,
    uniqueClients
  };
};
