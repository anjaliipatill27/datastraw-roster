import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard, Users, Store, Layers, Network,
  CalendarDays, ClipboardList, CalendarCheck,
  AlertTriangle, Search, Bell, Plus, RefreshCw,
  Download, Menu, X, ChevronDown, Activity,
  CheckCircle2, Clock, Trash2, Pencil, Settings
} from 'lucide-react';
const API = 'http://localhost:5000/api';
const menu = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Employees', icon: Users },
  { name: 'Brands', icon: Store },
  { name: 'Processes', icon: Layers },
  { name: 'Pods', icon: Network },
  { name: 'Assignments', icon: ClipboardList },
  { name: 'Leave Management', icon: CalendarCheck },
  { name: 'Monthly Roster', icon: CalendarDays },
  { name: 'Conflicts', icon: AlertTriangle }
];
function App() {
  const [page, setPage] = useState('Dashboard');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [dashboard, setDashboard] = useState({
    employees: 0, brands: 0, processes: 0, pods: 0, workingEntries: 0
  });
  const [employees, setEmployees] = useState([]);
  const [brands, setBrands] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [pods, setPods] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [roster, setRoster] = useState([]);
  const [issues, setIssues] = useState([]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [leaveForm, setLeaveForm] = useState({
    employee_id: '', date: '', type: 'LEAVE', note: ''
  });
  const [editStatus, setEditStatus] = useState({});
  async function request(endpoint, options = {}) {
    const response = await fetch(API + endpoint, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Something went wrong');
    return data;
  }
  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [d, e, b, p, pod, a, l] = await Promise.all([
        request('/dashboard'), request('/employees'), request('/brands'),
        request('/processes'), request('/pods'), request('/assignments'),
        request('/leave')
      ]);
      setDashboard(d);
      setEmployees(e);
      setBrands(b);
      setProcesses(p);
      setPods(pod);
      setAssignments(a);
      setLeaves(l);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { loadData(); }, []);
  async function loadRoster() {
    try {
      const data = await request(`/roster?month=${month}`);
      setRoster(data);
    } catch (err) {
  
      setError(err.message);
    }
}

  async function generateRoster() {
    setLoading(true);
    setError('');
    try {
      const result = await request('/roster/generate', {
        method: 'POST',
        body: JSON.stringify({ month })
      });
      setIssues(result.issues || []);
      await loadRoster();
      alert(`Roster generated successfully!\nTotal entries: ${result.entries}\nIssues found: ${result.issueCount}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  async function saveEmployee(event) {
    event.preventDefault();
    try {
      const payload = { ...form, pod_id: form.pod_id || null };
      if (editingId) {
        await request(`/employees/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify({ ...payload, active: form.active !== false })
        });
      } else {
        await request('/employees', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      setShowForm(false);
      setForm({});
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }
  async function deleteEmployee(id) {
    if (!window.confirm('Delete this employee?')) return;
    try {
      await request(`/employees/${id}`, { method: 'DELETE' });
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }
  async function addLeave(event) {
    event.preventDefault();
    try {
      await request('/leave', {
        method: 'POST',
        body: JSON.stringify(leaveForm)
      });
      setLeaveForm({ employee_id: '', date: '', type: 'LEAVE', note: '' });
      await loadData();
      alert('Leave saved successfully');
    } catch (err) {
      setError(err.message);
    }
  }
  async function updateRoster(id, status) {
    try {
      await request(`/roster/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status, note: 'Updated manually' })
      });
      await loadRoster();
    } catch (err) {
      setError(err.message);
    }
  }
  function exportCSV() {
    const headers = ['Date', 'Employee', 'Brand', 'Process', 'Status'];
    const rows = roster.map(item => [
      item.work_date, item.employee_name, item.brand_name,
      item.process_name, item.status
    ]);
    const csv = [headers, ...rows].map(row =>
      row.map(value => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `roster-${month}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(search.toLowerCase()) ||
    (employee.email || '').toLowerCase().includes(search.toLowerCase())
  );
  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(search.toLowerCase())
  );
  const cards = [
    { title: 'Total Employees', value: dashboard.employees, icon: Users, color: 'blue', subtitle: 'Active team members' 
},
    { title: 'Total Brands', value: dashboard.brands, icon: Store, color: 'purple', subtitle: 'Client accounts' },
    { 
        title: 'Total Processes', 
        value: dashboard.processes, 
        icon: Layers, 
        color: 'orange', 
        subtitle: 'Operational processes' },
    { title: 'Total Pods', value: dashboard.pods, icon: Network, color: 'green', subtitle: 'Operational teams' }
  ];
  function pageTitle() {
    return page === 'Dashboard' ? 'Dashboard Overview' : page;
  }
  function Table({ headers, children }) {
    return (
      <div className="table-scroll">
        <table>
          <thead><tr>{headers.map(header => <th key={header}>{header}</th>)}</tr></thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    );
  }
  function DashboardPage() {
    return (
      <>
        <div className="stats-grid">
          {cards.map(card => {
            const Icon = card.icon;
            return (
              <div className="stat-card" key={card.title}>
                <div className={`stat-icon ${card.color}`}><Icon size={23} /></div>
                <p>{card.title}</p><h2>{card.value}</h2><span>{card.subtitle}</span>
              </div>
            );
          })}
        </div>
        <div className="content-grid">
          <div className="panel">
            <div className="panel-heading">
              <div><h3>Team Overview</h3><p>Current operational structure</p></div><Users size={22} />
            </div>
            {pods.map(pod => {
              const count = employees.filter(employee => employee.pod_id === pod.id).length;
              return (
                <div className="team-row" key={pod.id}>
                  <div className="team-avatar">{pod.name.charAt(0)}</div>
                  <div className="team-info"><strong>{pod.name}</strong><span>Lead: {pod.lead_name}</span></div>
                  <strong>{count} Members</strong>
                </div>
              );
            })}
          </div>
          <div className="panel">
            <div className="panel-heading">
              <div><h3>Quick Actions</h3><p>Manage your operations</p></div><Activity size={22} />
            </div>
            <div className="quick-actions">
              <button onClick={() => { setPage('Employees'); setShowForm(true); setForm({}); }}><Plus size={17} /> Add 
Employee</button>
              <button onClick={() => setPage('Leave Management')}><CalendarCheck size={17} /> Manage Leaves</button>
              <button onClick={() => setPage('Monthly Roster')}><CalendarDays size={17} /> View Roster</button>
              <button onClick={() => setPage('Assignments')}><ClipboardList size={17} /> View Assignments</button>
            </div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-heading">
            <div><h3>Recent Employees</h3><p>Your latest team members</p></div>
            <button className="text-button" onClick={() => setPage('Employees')}>View All</button>
          </div>
          <Table headers={['Employee', 'Email', 'Role', 'Pod', 'Weekly Off']}>
            {employees.slice(0, 6).map(employee => (
              <tr key={employee.id}>
                <td><strong>{employee.name}</strong></td><td>{employee.email}</td>
                <td>{employee.role}</td><td>{employee.pod_name || '-'}</td><td>{employee.weekly_off}</td>
              </tr>
            ))}
          </Table>
        </div>
      </>
    );
  }
  function EmployeesPage() {
    return (
      <>
        <div className="toolbar">
          <div className="search-box">
            <Search size={18} />
            <input placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="primary-button" onClick={() => { setForm({}); setEditingId(null); setShowForm(true); 
}}><Plus size={18} /> Add Employee</button>
        </div>
        {showForm && (
          <div className="panel form-panel">
            <h3>{editingId ? 'Edit Employee' : 'Add New Employee'}</h3>
            <form onSubmit={saveEmployee} className="form-grid">
              <input placeholder="Employee name" required value={form.name || ''} onChange={e => setForm({ ...form, 
name: e.target.value })} />
              <input type="email" placeholder="Email address" value={form.email || ''} onChange={e => setForm({ ...form,
 email: e.target.value })} />
              <input placeholder="Role" value={form.role || 'Associate'} onChange={e => setForm({ ...form, role: e.
target.value })} />
             {/* Pod Dropdown */}
<select
  value={form.pod_id || ''}
  onChange={(e) =>
    setForm({ ...form, pod_id: e.target.value })
  }
>
  <option value="">Select Pod</option>

  {pods.map((pod) => (
    <option key={pod.id} value={pod.id}>
      {pod.name}
    </option>
  ))}
</select>

{/* Weekly Off Dropdown */}
<select
  value={form.weekly_off || 'Sunday'}
  onChange={(e) =>
    setForm({ ...form, weekly_off: e.target.value })
  }
>
  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
    <option key={day} value={day}>
      {day}
    </option>
  ))}
</select>
<div className="form-actions">
  <button type="submit" className="primary-button">
    Save Employee
  </button>

  <button
    type="button"
    className="secondary-button"
    onClick={() => setShowForm(false)}
  >
    Cancel
  </button>
</div>
</form>
</div>
)}
        <div className="panel">
          <div className="panel-heading"><div><h3>Employee Directory</h3><p>{filteredEmployees.length} employees found</
p></div></div>
          <Table headers={['Employee', 'Email', 'Pod', 'Role', 'Weekly Off', 'Actions']}>
            {filteredEmployees.map(employee => (
              <tr key={employee.id}>
                <td><strong>{employee.name}</strong></td><td>{employee.email}</td><td>{employee.pod_name || '-'}</
td><td>{employee.role}</td><td>{employee.weekly_off}</td>
                <td><div className="action-buttons">
                  <button onClick={() => { setEditingId(employee.id); setForm(employee); setShowForm(true); }}><Pencil 
size={16} /></button>
                  <button className="danger-icon" onClick={() => deleteEmployee(employee.id)}><Trash2 size={16} /></
button>
                </div></td>
              </tr>
            ))}
          </Table>
        </div>
      </>
    );
  }
  function BrandsPage() {
    return <div className="panel">
      <div className="panel-heading"><div><h3>Brand Management</h3><p>All registered client brands</p></div><Store 
size={22} /></div>
      <Table headers={['Brand Name', 'Description', 'Processes', 'Employees']}>
        {filteredBrands.map(brand => <tr key={brand.id}><td><strong>{brand.name}</strong></td><td>{brand.description || 
'-'}</td><td>{brand.process_count}</td><td>{brand.employee_count}</td></tr>)}
      </Table>
    </div>;
  }
  function ProcessesPage() {
    return <div className="panel">
      <div className="panel-heading"><div><h3>Process Management</h3><p>Brand-wise operational processes</p></
div><Layers size={22} /></div>
      <Table headers={['Process', 'Brand', 'Operating Rule', 'Minimum Staff']}>
        {processes.map(process => <tr key={process.id}><td><strong>{process.name}</strong></td><td>{process.
brand_name}</td><td><span className="status-badge">{process.operating_rule}</span></td><td>{process.min_staff}</td></
tr>)}
      </Table>
    </div>;
  }
  function PodsPage() {
    return <div className="pod-grid">
      {pods.map(pod => {
        const members = employees.filter(employee => employee.pod_id === pod.id);
        return <div className="panel pod-card" key={pod.id}>
          <div className="pod-symbol"><Network size={25} /></div>
          <h3>{pod.name}</h3><p>Pod Lead: {pod.lead_name}</p><h2>{members.length}</h2><span>Team Members</span>
          <div className="member-list">{members.map(member => <div key={member.id}><span>{member.name}</span><span>{
member.role}</span></div>)}</div>
        </div>;
      })}
    </div>;
  }
  function AssignmentsPage() {
    return <div className="panel">
      <div className="panel-heading"><div><h3>Resource Assignments</h3><p>Employees mapped to brands and processes</p></
div><ClipboardList size={22} /></div>
      <Table headers={['Employee', 'Brand', 'Process']}>
        {assignments.map((item, index) => <tr key={item.id || index}><td><strong>{item.employee_name}</strong></td><td>{
item.brand_name}</td><td>{item.process_name}</td></tr>)}
      </Table>
    </div>;
  }
  function LeavePage() {
    return <>
      <div className="panel">
        <div className="panel-heading"><div><h3>Add Leave / Comp-off</h3><p>Record employee availability changes</p></
div><CalendarCheck size={22} /></div>
        <form onSubmit={addLeave} className="form-grid">
          <select required value={leaveForm.employee_id} onChange={e => setLeaveForm({ ...leaveForm, employee_id: e.
target.value })}>
            <option value="">Select Employee</option>{employees.map(employee => <option key={employee.id} value={
employee.id}>{employee.name}</option>)}
          </select>
          <input type="date" required value={leaveForm.date} onChange={e => setLeaveForm({ ...leaveForm, date: e.target.
value })} />
          <select value={leaveForm.type} onChange={e => setLeaveForm({ ...leaveForm, type: e.target.value })}>
            <option value="LEAVE">Planned Leave</option><option value="COMP_OFF">Comp-off</option>
          </select>
          <input placeholder="Reason / Note" value={leaveForm.note} onChange={e => setLeaveForm({ ...leaveForm, note: e.
target.value })} />
          <button type="submit" className="primary-button"><Plus size={17} /> Save Request</button>
        </form>
      </div>
      <div className="panel">
        <div className="panel-heading"><div><h3>Leave Records</h3><p>Recorded employee time off</p></div></div>
        <Table headers={['Employee', 'Date', 'Type', 'Status', 'Note']}>
          {leaves.map(item => <tr key={item.id}><td>{item.employee_name}</td><td>{String(item.date).slice(0, 10)}</
td><td>{item.type}</td><td><span className="status-badge">{item.status}</span></td><td>{item.note || '-'}</td></tr>)}
        </Table>
      </div>
    </>;
  }
  function RosterPage() {
    const grouped = roster.reduce((result, item) => {
      const date = String(item.work_date).slice(0, 10);
      if (!result[date]) result[date] = [];
      result[date].push(item);
      return result;
    }, {});
    return <>
      <div className="panel">
        <div className="panel-heading"><div><h3>Monthly Roster Generator</h3><p>Generate and manage team schedules</p></
div><CalendarDays size={22} /></div>
        <div className="roster-controls">
          <input type="month" value={month} onChange={e => setMonth(e.target.value)} />
          <button className="primary-button" disabled={loading} onClick={generateRoster}><RefreshCw size={17} /> 
Generate Roster</button>
          <button className="secondary-button" onClick={loadRoster}>View Roster</button>
          <button className="secondary-button" onClick={exportCSV} disabled={!roster.length}><Download size={17} /> 
Export CSV</button>
        </div>
      </div>
      {Object.keys(grouped).length === 0 ? <div className="empty-state"><CalendarDays size={40} /><h3>No Roster Found</
h3><p>Select a month and generate your roster.</p></div> :
        Object.entries(grouped).map(([date, items]) => <div className="panel" key={date}>
          <div className="panel-heading"><h3>{date}</h3><span>{items.length} assignments</span></div>
          <Table headers={['Employee', 'Brand', 'Process', 'Status', 'Edit']}>
            {items.map(item => <tr key={item.id}>
              <td>{item.employee_name}</td><td>{item.brand_name}</td><td>{item.process_name}</td>
              <td><span className={`status-badge ${item.status.toLowerCase()}`}>{item.status.replace('_', ' ')}</span></
td>
              <td>
                <select value={editStatus[item.id] || item.status} onChange={e => setEditStatus({ ...editStatus, [item.
id]: e.target.value })}>
                  <option value="WORKING">Working</option><option value="WEEKLY_OFF">Weekly Off</option><option 
value="LEAVE">Leave</option><option value="HOLIDAY">Holiday</option>
                </select>
                <button className="save-small" disabled={!editStatus[item.id] || editStatus[item.id] === item.status} 
onClick={() => updateRoster(item.id, editStatus[item.id])}>Save</button>
              </td>
            </tr>)}
          </Table>
        </div>)
      }
    </>;
  }
  function ConflictsPage() {
    return <div className="panel">
      <div className="panel-heading"><div><h3>Roster Conflicts</h3><p>Issues identified during roster generation</p></
div><AlertTriangle color="#e69a31" /></div>
      {issues.length === 0 ? <div className="empty-state"><CheckCircle2 color="green" size={40} /><h3>No Reported 
Conflicts</h3><p>Generate a roster to check its coverage.</p></div> :
        issues.map((issue, index) => <div className="conflict-row" key={index}>
          <AlertTriangle size={20} /><div><strong>{issue.brand} – {issue.process}</strong><p>{issue.date} · {issue.
message}</p>{issue.employee && <small>{issue.employee}</small>}</div>
        </div>)
      }
    </div>;
  }
  function renderPage() {
    switch (page) {
      case 'Dashboard': return <DashboardPage />;
      case 'Employees': return <EmployeesPage />;
      case 'Brands': return <BrandsPage />;
      case 'Processes': return <ProcessesPage />;
      case 'Pods': return <PodsPage />;
      case 'Assignments': return <AssignmentsPage />;
      case 'Leave Management': return <LeavePage />;
      case 'Monthly Roster': return <RosterPage />;
      case 'Conflicts': return <ConflictsPage />;
      default: return <DashboardPage />;
    }
  }
  return <div className="app-layout">
    <aside className={`sidebar ${mobileMenu ? 'open' : ''}`}>
      <div className="brand-logo">
        <div className="logo-icon">D</div><div><h2>DataStraw</h2><span>SMART ROSTER</span></div>
        <button className="close-menu" onClick={() => setMobileMenu(false)}><X size={20} /></button>
      </div>
      <div className="sidebar-label">WORKSPACE</div>
      <nav>{menu.map(item => {
        const Icon = item.icon;
        return <button key={item.name} className={page === item.name ? 'nav-item active' : 'nav-item'}
          onClick={() => {
            setPage(item.name); setSearch(''); setMobileMenu(false);
            if (item.name === 'Monthly Roster') loadRoster();
          }}>
          <Icon size={19} /><span>{item.name}</span>
          {item.name === 'Conflicts' && issues.length > 0 && <span className="nav-count">{issues.length}</span>}
        </button>;
      })}</nav>
      <div className="sidebar-bottom"><Settings size={18} /><span>Roster Management</span></div>
    </aside>
    <main className="main-content">
      <header className="topbar">
        <div className="topbar-left">
          <button className="menu-toggle" onClick={() => setMobileMenu(true)}><Menu size={22} /></button>
          <div><h1>{pageTitle()}</h1><p>Welcome back, Operations Manager</p></div>
        </div>
        <div className="topbar-right">
          <button className="icon-button" onClick={loadData} title="Refresh"><RefreshCw size={19} /></button>
          <button className="icon-button" title="Notifications"><Bell size={19} /></button>
          <div className="profile"><div className="profile-avatar">OM</div><div><strong>Manager</
strong><span>Administrator</span></div><ChevronDown size={16} /></div>
        </div>
      </header>
      <section className="page-content">
        {error && <div className="error-banner"><AlertTriangle size={18} /><span>{error}</span><button onClick={() => 
setError('')}><X size={17} /></button></div>}
        {loading && <div className="loading-line">Loading data...</div>}
        {renderPage()}
      </section>
      <footer className="footer">© 2026 DataStraw Smart Roster Management System<span>Built for Operations Management</
span></footer>
    </main>
  </div>;
}
export default App;
