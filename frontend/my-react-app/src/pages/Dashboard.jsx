import { useState, useEffect } from 'react';
import axios from 'axios';
import socket from '../socket';
import DisasterForm from '../components/DisasterForm';
import ReportForm from '../components/ReportForm';
import DisasterList from '../components/DisasterList';
import SocialMediaFeed from '../components/SocialMediaFeed';
import ResourcesList from '../components/ResourcesList';
import OfficialUpdates from '../components/OfficialUpdates';
import ImageVerification from '../components/ImageVerification';


function Dashboard() {
  const [disasters, setDisasters] = useState([]);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [editingDisaster, setEditingDisaster] = useState(null);
  const [userId] = useState('netrunnerX'); // Mock user
  const [socialMedia, setSocialMedia] = useState([]);
  const [resources, setResources] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [reports, setReports] = useState([]);
  const url = "https://disastermanagement-bzga.onrender.com"

  useEffect(() => {
    fetchDisasters();


    socket.on('disaster_updated', (data) => {
      if (data.deleted) {
        setDisasters((prev) => prev.filter((d) => d.id !== data.id));
        if (selectedDisaster?.id === data.id) setSelectedDisaster(null);
      } else {
        setDisasters((prev) => {
          const index = prev.findIndex((d) => d.id === data.id);
          if (index === -1) return [...prev, data];
          const updated = [...prev];
          updated[index] = data;
          return updated;
        });
        if (selectedDisaster?.id === data.id) setSelectedDisaster(data);
      }
    });

    socket.on('social_media_updated', ({ disaster_id, data }) => {
      if (selectedDisaster?.id === disaster_id) setSocialMedia(data);
    });

    socket.on('resources_updated', ({ disaster_id, data }) => {
      if (selectedDisaster?.id === disaster_id) setResources(data);
    });

    socket.on('report_updated', (data) => {
      if (selectedDisaster?.id === data.disaster_id) {
        setReports((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off('disaster_updated');
      socket.off('social_media_updated');
      socket.off('resources_updated');
      socket.off('report_updated');
    };
  }, [selectedDisaster]);

  const fetchDisasters = async () => {
    try {
      const res = await axios.get(`${url}/disasters`);
      setDisasters(res.data);
    } catch (err) {
      console.error('Error fetching disasters:', err);
    }
  };


  const fetchDisasterDetails = async (disaster) => {
    try {
      const [socialRes, resourcesRes, updatesRes, reportsRes] = await Promise.all([
       Promise.all([
        axios.get(`${url}/disasters/${disaster.id}/social-media`),
        axios.get(`${url}/disasters/${disaster.id}/resources?lat=40.7128&lon=${encodeURIComponent('-74.0060')}`),
        axios.get(`${url}/disasters/${disaster.id}/official-updates`),
        axios.get(`${url}/disasters/${disaster.id}/reports`)
      ])])

      setSocialMedia(socialRes.data);
      setResources(resourcesRes.data);
      setUpdates(updatesRes.data);
      setReports(reportsRes.data);
    } catch (err) {
      console.error('Error fetching disaster details:', err);
    }
  };

  const handleSelectDisaster = (disaster) => {
    setSelectedDisaster(disaster);
    fetchDisasterDetails(disaster);
  };

  const handleEditDisaster = (disaster) => {
    setEditingDisaster(disaster);
  };

  const handleCancelEdit = () => {
    setEditingDisaster(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-16">
      <div className="container mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-teal-700 mb-8 text-center">Disaster Management Dashboard</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <DisasterForm
              userId={userId}
              onSuccess={() => {
                fetchDisasters();
                handleCancelEdit();
              }}
              disaster={editingDisaster}
              onCancel={handleCancelEdit}
            />
            {selectedDisaster && (
              <>
                <ReportForm disasterId={selectedDisaster.id} userId={userId} />
                <ImageVerification disasterId={selectedDisaster.id} />
              </>
            )}
            <DisasterList
              disasters={disasters}
              onSelect={handleSelectDisaster}
              onEdit={handleEditDisaster}
              onDelete={() => fetchDisasters()}
              userId={userId}
            />
          </div>
          <div className="space-y-6">
            {selectedDisaster && (
              <>
                <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
                  <h2 className="text-2xl font-bold text-teal-700 mb-4">Reports</h2>
                  {reports.length === 0 ? (
                    <p className="text-gray-500 text-sm">No reports found.</p>
                  ) : (
                    <ul className="space-y-3">
                      {reports.map((report) => (
                        <li
                          key={report.id}
                          className="p-4 border border-gray-100 rounded-lg bg-gray-50"
                        >
                          <p className="text-gray-700 text-sm">{report.content}</p>
                          {report.image_url && (
                            <p className="text-gray-500 text-xs">
                              Image: <a
                                href={report.image_url}
                                className="text-blue-600 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >View</a>
                            </p>
                          )}
                          <p className="text-gray-500 text-xs">
                            Verification: {report.verification_status || 'Pending'}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              <SocialMediaFeed posts={socialMedia} />
              <ResourcesList resources={resources} />
              <OfficialUpdates updates={updates} />
              </>
            )}
          </div>
        </div>
      </div>
      </div>
  );
}

export default Dashboard