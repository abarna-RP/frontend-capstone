// frontend/src/components/AppointmentList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import ReactPaginate from 'react-paginate';

function AppointmentList() {
const [appointments, setAppointments] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [pageNumber, setPageNumber] = useState(0);
 const appointmentsPerPage = 10;
const pagesVisited = pageNumber * appointmentsPerPage;
const userId = localStorage.getItem('userId');
const role = localStorage.getItem('role'); // Get the user's role

 useEffect(() => {
 const fetchAppointments = async () => {
try {
const token = localStorage.getItem('token');
 if (!token) {
 setError('Login required.');
setLoading(false);
 return;
 }

 let apiUrl = `${import.meta.env.VITE_API_BASE_URL}/appointments`;

 if (role === 'counselor' && userId) {
 apiUrl = `${import.meta.env.VITE_API_BASE_URL}/appointments/counselor/${userId}`;
} else if (role === 'client' && userId) {
apiUrl = `${import.meta.env.VITE_API_BASE_URL}/appointments/client/${userId}`;
}

 const response = await axios.get(apiUrl, {
headers: { Authorization: `Bearer ${token}` },
});
setAppointments(response.data || []);
} catch (apiError) {
console.error('Error fetching appointments:', apiError);
 setError(apiError.response?.data?.error || 'Failed to fetch appointments.');
} finally {
setLoading(false);
}
 };

fetchAppointments();
}, [role, userId]);

 const pageCount = Math.ceil(appointments.length / appointmentsPerPage);

const changePage = ({ selected }) => {
setPageNumber(selected);
 };

const displayAppointments = appointments
.slice(pagesVisited, pagesVisited + appointmentsPerPage)
.map((appointment) => (
 <tr key={appointment._id}>
<td>{appointment.client?.name || 'Unknown'}</td>
 <td>{appointment.counselor?.name || 'Unknown'}</td>
 <td>{format(new Date(appointment.date), 'yyyy-MM-dd hh:mm a')}</td>
<td>{appointment.sessionType}</td>
<td>
<Link
to={`/video-call/${appointment._id}/${userId}`}className="btn btn-sm btn-info"
>
Join
 </Link>
</td>
</tr>
));

 if (loading) {
return (
<div className="d-flex justify-content-center mt-4">
 <div className="spinner-border" role="status">
<span className="visually-hidden">Loading...</span>
</div>
</div>
);
}

if (error) {
return <div className="alert alert-danger mt-4 text-center">{error}</div>;
 }

return (
 <div className="container mt-4">
 <h2 className="text-center mb-4">All Appointments</h2>
 <div className="table-responsive">
<table className="table table-striped table-bordered">
 <thead>
<tr>
 <th>Client</th>
 <th>Counselor</th>
 <th>Date/Time</th>
 <th>Session Type</th>
<th>Actions</th>
 </tr>
</thead>
 <tbody>{displayAppointments}</tbody>
 </table>
</div>

 <ReactPaginate
 previousLabel={"Previous"}
 nextLabel={"Next"}
pageCount={pageCount}
onPageChange={changePage}
 containerClassName={"pagination justify-content-center mt-4"}
pageClassName={"page-item"}
 pageLinkClassName={"page-link"}
 previousLinkClassName={"page-link"}
 nextLinkClassName={"page-link"}
 activeClassName={"active"}
/>
</div>
 );
}

export default AppointmentList;