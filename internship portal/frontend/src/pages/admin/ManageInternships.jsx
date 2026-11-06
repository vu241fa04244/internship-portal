import React, { useState, useEffect } from 'react';
import { internshipAPI } from '../../services/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Building,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

const CATEGORIES = [
  'Software Development',
  'Data Science',
  'UI/UX Design',
  'Product Management',
  'DevOps & Cloud',
  'Digital Marketing',
  'Finance',
  'Other',
];

const INITIAL_FORM = {
  title: '',
  company: '',
  category: 'Software Development',
  workType: 'Remote',
  duration: '3 Months',
  stipend: 1500,
  stipendType: 'Paid',
  currency: 'USD',
  location: 'Remote',
  deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  vacancies: 2,
  status: 'Active',
  skillsRequired: '',
  description: '',
  requirements: '',
  responsibilities: '',
};

const ManageInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  };

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const res = await internshipAPI.getAll({ limit: 50, status: 'All' });
      if (res.data.success) {
        setInternships(res.data.internships || []);
      }
    } catch (err) {
      console.error('Failed to fetch internships:', err);
      addToast('Could not load internships', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData(INITIAL_FORM);
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setIsEditing(true);
    setEditingId(item._id);
    setFormData({
      title: item.title,
      company: item.company,
      category: item.category,
      workType: item.workType,
      duration: item.duration,
      stipend: item.stipend,
      stipendType: item.stipendType || 'Paid',
      currency: item.currency || 'USD',
      location: item.location,
      deadline: new Date(item.deadline).toISOString().split('T')[0],
      vacancies: item.vacancies || 1,
      status: item.status,
      skillsRequired: item.skillsRequired ? item.skillsRequired.join(', ') : '',
      description: item.description,
      requirements: item.requirements ? item.requirements.join('\n') : '',
      responsibilities: item.responsibilities ? item.responsibilities.join('\n') : '',
    });
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.description) {
      addToast('Title, company, and description are required.', 'error');
      return;
    }

    try {
      setSaving(true);
      if (isEditing) {
        const res = await internshipAPI.update(editingId, formData);
        if (res.data.success) {
          addToast('Internship updated successfully!');
          setModalOpen(false);
          fetchInternships();
        }
      } else {
        const res = await internshipAPI.create(formData);
        if (res.data.success) {
          addToast('New internship opportunity posted!');
          setModalOpen(false);
          fetchInternships();
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save internship.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDelete = (id) => {
    setDeletingId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await internshipAPI.delete(deletingId);
      if (res.data.success) {
        addToast('Internship deleted successfully.');
        setInternships((prev) => prev.filter((item) => item._id !== deletingId));
        setDeleteModalOpen(false);
      }
    } catch (err) {
      addToast('Failed to delete internship.', 'error');
    }
  };

  const filteredInternships = internships.filter((item) => {
    const s = search.toLowerCase();
    return (
      item.title?.toLowerCase().includes(s) ||
      item.company?.toLowerCase().includes(s) ||
      item.category?.toLowerCase().includes(s)
    );
  });

  return (
    <DashboardLayout
      title="Manage Internship Opportunities"
      subtitle="Create, edit, close, and manage active internship postings across the platform."
      action={
        <button onClick={handleOpenCreate} className="btn btn-primary btn-sm">
          <Plus size={16} /> Post New Internship
        </button>
      }
    >
      <Toast toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />

      {/* Search Toolbar */}
      <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', maxWidth: 450 }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search internships by title, company, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading internships table..." />
      ) : (
        <div className="table-wrapper">
          <div className="table-header-bar">
            <h3 className="table-header-title">All Posted Roles ({filteredInternships.length})</h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Role & Company</th>
                  <th>Category</th>
                  <th>Compensation</th>
                  <th>Deadline</th>
                  <th>Applicants</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInternships.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--navy-900)' }}>{item.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.company} • {item.location} ({item.workType})</div>
                    </td>
                    <td><span className="badge badge-category">{item.category}</span></td>
                    <td>
                      {item.stipend > 0 ? `$${item.stipend}/mo` : 'Unpaid'}
                    </td>
                    <td>{new Date(item.deadline).toLocaleDateString()}</td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{item.applicantsCount || 0}</span>
                    </td>
                    <td>
                      <span className={`badge ${item.status === 'Active' ? 'badge-accepted' : 'badge-withdrawn'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.3rem 0.5rem' }}
                          title="Edit Internship"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(item._id)}
                          className="btn btn-sm"
                          style={{ padding: '0.3rem 0.5rem', color: 'var(--danger)', backgroundColor: 'transparent', border: '1px solid var(--danger-border)' }}
                          title="Delete Internship"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? 'Edit Internship Opportunity' : 'Create New Internship Opportunity'}
        size="lg"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setModalOpen(false)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish Opportunity'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Internship Title</label>
              <input
                type="text"
                name="title"
                required
                className="form-input"
                placeholder="e.g. Full Stack Developer Intern"
                value={formData.title}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hiring Company</label>
              <input
                type="text"
                name="company"
                required
                className="form-input"
                placeholder="e.g. CloudScale Technologies"
                value={formData.company}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleFormChange}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Work Arrangement</label>
              <select
                name="workType"
                className="form-select"
                value={formData.workType}
                onChange={handleFormChange}
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                required
                className="form-input"
                placeholder="Remote, or City, State"
                value={formData.location}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Duration</label>
              <input
                type="text"
                name="duration"
                className="form-input"
                placeholder="e.g. 3 Months, 6 Months"
                value={formData.duration}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Monthly Stipend ($)</label>
              <input
                type="number"
                name="stipend"
                min="0"
                className="form-input"
                value={formData.stipend}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Application Deadline</label>
              <input
                type="date"
                name="deadline"
                required
                className="form-input"
                value={formData.deadline}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Vacancies</label>
              <input
                type="number"
                name="vacancies"
                min="1"
                className="form-input"
                value={formData.vacancies}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleFormChange}
              >
                <option value="Active">Active (Accepting Applications)</option>
                <option value="Closed">Closed</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Required Skills (Comma separated)
            </label>
            <input
              type="text"
              name="skillsRequired"
              required
              className="form-input"
              placeholder="e.g. React, Node.js, MongoDB, JavaScript, Git"
              value={formData.skillsRequired}
              onChange={handleFormChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Job Overview & Description</label>
            <textarea
              name="description"
              required
              rows={3}
              className="form-textarea"
              placeholder="Provide a detailed summary of the internship role..."
              value={formData.description}
              onChange={handleFormChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Key Responsibilities (One per line)</label>
            <textarea
              name="responsibilities"
              rows={3}
              className="form-textarea"
              placeholder="Develop user interfaces&#10;Write unit tests&#10;Participate in standups"
              value={formData.responsibilities}
              onChange={handleFormChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Candidate Requirements (One per line)</label>
            <textarea
              name="requirements"
              rows={3}
              className="form-textarea"
              placeholder="Knowledge of modern JavaScript&#10;Familiarity with REST APIs&#10;Enrolled in Computer Science or related degree"
              value={formData.requirements}
              onChange={handleFormChange}
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Internship Posting"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleConfirmDelete}
            >
              Yes, Delete Opportunity
            </button>
          </>
        }
      >
        <p style={{ color: 'var(--navy-800)', lineHeight: 1.6 }}>
          Are you sure you want to delete this internship posting? This action cannot be undone and will permanently remove the opportunity and all student applications attached to it.
        </p>
      </Modal>
    </DashboardLayout>
  );
};

export default ManageInternships;
