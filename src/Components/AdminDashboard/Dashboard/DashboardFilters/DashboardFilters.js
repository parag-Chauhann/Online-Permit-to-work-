import React, { useState, useEffect } from 'react';
import './DashboardFilters.css';

const DashboardFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    plantLocation: '',
    contractorName: '',
    status: '',
    approvalStatus: ''
  });
  const [areas, setAreas] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [approvalStatuses, setApprovalStatuses] = useState([]);

  useEffect(() => {
    // Fetch areas, contractors, statuses, and approval statuses from Firebase or define them here
    const fetchFiltersData = async () => {
      // Fetch data or set default values here
      setAreas(['Area 1', 'Area 2', 'Area 3']);
      setContractors(['Contractor A', 'Contractor B', 'Contractor C']);
      setStatuses(['Permit Initiated', 'Approved by First Approver', 'Rejected', 'Approved by Safety Department']);
      setApprovalStatuses(['Pending', 'Approved', 'Rejected']);
    };
    fetchFiltersData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  return (
    <div className="permitDashboardFilter">
      <h3>Filter Permits</h3>
      <div className="filter-group">
        <label>Date Range:</label>
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleDateChange}
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleDateChange}
        />
      </div>
      <div className="filter-group">
        <label>Status:</label>
        <select name="status" value={filters.status} onChange={handleChange}>
          <option value="">All</option>
          {statuses.map((status, index) => (
            <option key={index} value={status}>{status}</option>
          ))}
        </select>
      </div>
      <button onClick={applyFilters}>Apply Filters</button>
    </div>
  );
};

export default DashboardFilters;
