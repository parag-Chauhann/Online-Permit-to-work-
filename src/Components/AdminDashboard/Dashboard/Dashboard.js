import React, { useCallback, useEffect, useState } from 'react';
import { Table } from 'antd';
import { collection, doc, getDocs, getDoc, query, where } from 'firebase/firestore';
import { db } from '../../../Firebase';
import { getAuth } from 'firebase/auth';
import DashboardPieChart from './DashboardPieChart';
import PermitDetails from './PermitDetails';
import './Dashboard.css';
import DashboardFilters from './DashboardFilters/DashboardFilters';

// Function to fetch the permit format from Firestore
const fetchPermitFormat = async (adminId) => {
  try {
    const formatRef = doc(db, 'PermitSettings', adminId);
    const formatDoc = await getDoc(formatRef);

    if (formatDoc.exists()) {
      return formatDoc.data().permitFormat;
    } else {
      throw new Error('No permit format found for the admin.');
    }
  } catch (error) {
    console.error('Error fetching permit format:', error);
    throw error;
  }
};

// Function to fetch the admin's subscription plan from Firestore
const fetchAdminPlan = async (adminId) => {
  try {
    const userRef = doc(db, 'Users', adminId); // Assuming user data is stored in 'Users' collection
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data().selectedPlan; // Ensure this field exists in your user document
    } else {
      throw new Error('No admin plan found for the admin.');
    }
  } catch (error) {
    console.error('Error fetching admin plan:', error);
    throw error;
  }
};

// Function to fetch permits based on the format and adminId
const fetchPermits = async (adminId, setPermits, setFilteredPermits, setSummary, setError, setLoading) => {
  try {
    setLoading(true);
    const permitFormat = await fetchPermitFormat(adminId);

    const [collectionId, documentId] = permitFormat.split('/');
    const permitsRef = collection(db, 'permits', collectionId, documentId);

    // Query to fetch permits where adminUserId matches the current admin
    const permitsQuery = query(permitsRef, where('adminUserId', '==', adminId));
    const querySnapshot = await getDocs(permitsQuery);

    let initiated = 0, inProcess = 0, approved = 0, rejected = 0;
    const permitList = querySnapshot.docs.map(doc => {
      const data = doc.data();
      switch (data.status) {
        case 'Permit Initiated':
          initiated++;
          break;
        case 'Approved by First Approver':
          inProcess++;
          break;
        case 'Rejected':
          rejected++;
          break;
        case 'Approved by Safety Department':
          approved++;
          break;
        case 'Rejected by Safety Department':
          rejected++;
          break;
        default:
          break;
      }
      return { id: doc.id, ...data };
    });

    setPermits(permitList);
    setFilteredPermits(permitList);
    setSummary({ initiated, inProcess, approved, rejected });
  } catch (error) {
    setError('Error fetching permits');
    console.error('Error fetching permits:', error);
  } finally {
    setLoading(false);
  }
};

function Dashboard() {
  const [permits, setPermits] = useState([]);
  const [filteredPermits, setFilteredPermits] = useState([]);
  const [summary, setSummary] = useState({
    initiated: 0,
    inProcess: 0,
    approved: 0,
    rejected: 0
  });
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    plantLocation: '',
    contractorName: '',
    status: '',
    approvalStatus: ''
  });
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAdminPlan, setUserAdminPlan] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const fetchPermitsData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        const adminId = user.uid;

        // Fetch the admin's subscription plan
        const plan = await fetchAdminPlan(adminId);
        setUserAdminPlan(plan);

        // Fetch permits based on the admin's format
        await fetchPermits(adminId, setPermits, setFilteredPermits, setSummary, setError, setLoading);
      } catch (error) {
        setError('Error fetching permits');
        console.error('Error fetching permits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermitsData();
  }, [auth]);

  const applyFilters = useCallback(() => {
    let filtered = permits;

    if (filters.startDate) {
      filtered = filtered.filter(p => new Date(p.startDate) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      filtered = filtered.filter(p => new Date(p.endDate) <= new Date(filters.endDate));
    }
    if (filters.plantLocation) {
      filtered = filtered.filter(p => p.plantLocation.includes(filters.plantLocation));
    }
    if (filters.contractorName) {
      filtered = filtered.filter(p => p.contractorName.includes(filters.contractorName));
    }
    if (filters.status) {
      filtered = filtered.filter(p => p.status === filters.status);
    }
    if (filters.approvalStatus) {
      filtered = filtered.filter(p => p.approvalStatus === filters.approvalStatus);
    }

    setFilteredPermits(filtered);
  }, [filters, permits]);

  useEffect(() => {
    applyFilters();
  }, [filters, applyFilters]);

  const handleView = (permit) => {
    setSelectedPermit(permit);
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setSelectedPermit(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };

  const openFilterModal = () => {
    setIsFilterModalVisible(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalVisible(false);
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      plantLocation: '',
      contractorName: '',
      status: '',
      approvalStatus: ''
    });
    setIsFilterModalVisible(false);
  };

  return (
    <>
      <div className={`dashboard-wrapper ${isFilterModalVisible ? 'blur-background' : ''}`}>
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}
        <div className='left-section'>
          <SummaryBoard summary={summary} />
          <button onClick={openFilterModal} className="filter-button">Open Filters</button>
          {isFilterModalVisible && (
            <div className="filter-modal">
              <div className="filter-modal-content">
                <DashboardFilters onFilterChange={handleFilterChange} />
                <button onClick={clearFilters} className="clear-filters-button">Clear Filters</button>
                <button onClick={closeFilterModal} className="close-modal-button">Close</button>
              </div>
            </div>
          )}
          <div className='table-container'>
            <RecentOrders permits={filteredPermits} onView={handleView} />
          </div>
        </div>
        <div className='right-section'>
          <DashboardPieChart summary={summary} />
        </div>
        <PermitDetails
          visible={isModalVisible}
          onClose={handleClose}
          permit={selectedPermit}
          adminPlan={userAdminPlan} // Pass the userAdminPlan state here
        />
      </div>
    </>
  );
}

function SummaryBoard({ summary }) {
  const [permitSummaryInfo, setPermitSummaryInfo] = useState([]);

  useEffect(() => {
    const updatedSummaryInfo = [
      {
        heading: "Permit Initiated",
        classname: "go-corner-initiated",
        info: summary.initiated,
        classnameHeading: 'permitInfo1-initiated',
      },
      {
        heading: "Permit In Process",
        classname: "go-corner-in-process",
        info: summary.inProcess,
        classnameHeading: 'permitInfo1-in-process',
      },
      {
        heading: "Permit Approved",
        classname: "go-corner-approved",
        info: summary.approved,
        classnameHeading: 'permitInfo1-approved',
      },
      {
        heading: "Permit Rejected",
        classname: "go-corner-rejected",
        info: summary.rejected,
        classnameHeading: 'permitInfo1-rejected',
      },
    ];
    setPermitSummaryInfo(updatedSummaryInfo);
  }, [summary]);

  return (
    <div className='summary-board'>
      {permitSummaryInfo.map((summaryData, index) => (
        <div key={index} className="permitInfo">
          <div className={summaryData.classnameHeading}>
            <p>{summaryData.heading}</p>
            <p className="small">{summaryData.info}</p>
            <div className={summaryData.classname}>
              →
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RecentOrders({ permits, onView }) {
  const columns = [
    {
      title: 'Permit Number',
      dataIndex: 'id',
      key: 'id',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Contractor Name',
      dataIndex: 'contractorName',
      key: 'contractorName',
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
    },
    {
      title: 'Completion Date',
      dataIndex: 'completionDate',
      key: 'completionDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <a onClick={() => onView(record)}>View Details</a>
      ),
    },
  ];

  return <Table columns={columns} dataSource={permits} rowKey="id" />;
}

export default Dashboard;
