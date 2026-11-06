import React, { useState, useEffect } from 'react';
import { internshipAPI } from '../../services/api';
import InternshipCard from '../../components/cards/InternshipCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Software Development',
  'Data Science',
  'UI/UX Design',
  'Product Management',
  'DevOps & Cloud',
  'Digital Marketing',
  'Finance',
];

const WORK_TYPES = ['All', 'Remote', 'Hybrid', 'On-site'];

const InternshipList = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  // Filters state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [workType, setWorkType] = useState('All');
  const [minStipend, setMinStipend] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 8,
        sortBy,
        order,
      };

      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (workType !== 'All') params.workType = workType;
      if (minStipend && !isNaN(Number(minStipend))) params.minStipend = Number(minStipend);

      const res = await internshipAPI.getAll(params);
      if (res.data.success) {
        setInternships(res.data.internships || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch internships:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [page, category, workType, sortBy, order]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchInternships();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setWorkType('All');
    setMinStipend('');
    setSortBy('createdAt');
    setOrder('desc');
    setPage(1);
  };

  return (
    <div className="internships-container">
      <div className="container">
        {/* Header Title & Search Toolbar */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
            Explore Verified Internships
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 650 }}>
            Discover student roles tailored to your career goals. Log in to preview your AI skill match scores.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              gap: '0.75rem',
              marginTop: '1.5rem',
              maxWidth: 750,
            }}
          >
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search by job title, company, or required skill (e.g. React, Python, ML)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '2.6rem', height: 46 }}
              />
              <Search
                size={18}
                color="#94a3b8"
                style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ height: 46 }}>
              Search
            </button>
            {(search || category !== 'All' || workType !== 'All' || minStipend) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn btn-secondary"
                style={{ height: 46 }}
                title="Reset all filters"
              >
                <RotateCcw size={16} />
              </button>
            )}
          </form>
        </div>

        {/* Main Grid: Sidebar Filters & Results List */}
        <div className="internships-grid-layout">
          {/* Filters Sidebar */}
          <aside className="filter-card">
            <div className="filter-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <SlidersHorizontal size={18} color="var(--sky-600)" /> Filters
              </span>
              <button
                onClick={handleResetFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--sky-600)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Reset
              </button>
            </div>

            {/* Category Filter */}
            <div className="filter-section">
              <div className="filter-heading">Category</div>
              {CATEGORIES.map((cat) => (
                <label key={cat} className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    checked={category === cat}
                    onChange={() => {
                      setCategory(cat);
                      setPage(1);
                    }}
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>

            {/* Work Type Filter */}
            <div className="filter-section">
              <div className="filter-heading">Work Type</div>
              {WORK_TYPES.map((type) => (
                <label key={type} className="filter-option">
                  <input
                    type="radio"
                    name="workType"
                    checked={workType === type}
                    onChange={() => {
                      setWorkType(type);
                      setPage(1);
                    }}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>

            {/* Minimum Stipend */}
            <div className="filter-section">
              <div className="filter-heading">Min. Monthly Stipend ($)</div>
              <input
                type="number"
                min="0"
                step="250"
                className="form-input"
                placeholder="e.g. 1500"
                value={minStipend}
                onChange={(e) => {
                  setMinStipend(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </aside>

          {/* Results Area */}
          <main>
            {/* Results bar & Sorting */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ color: 'var(--navy-800)', fontWeight: 600 }}>
                Showing {internships.length} of {total} Opportunities
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Sort by:</span>
                <select
                  className="form-select"
                  style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                  value={`${sortBy}-${order}`}
                  onChange={(e) => {
                    const [newSort, newOrder] = e.target.value.split('-');
                    setSortBy(newSort);
                    setOrder(newOrder);
                    setPage(1);
                  }}
                >
                  <option value="createdAt-desc">Newest Added</option>
                  <option value="deadline-asc">Approaching Deadline</option>
                  <option value="stipend-desc">Highest Stipend</option>
                  <option value="title-asc">Title (A-Z)</option>
                </select>
              </div>
            </div>

            {loading ? (
              <LoadingSpinner message="Searching opportunities..." />
            ) : internships.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No internships match your criteria"
                description="Try adjusting your keywords, work type, or clearing filters to see more results."
                action={
                  <button onClick={handleResetFilters} className="btn btn-secondary btn-sm">
                    Clear All Filters
                  </button>
                }
              />
            ) : (
              <div className="internship-cards-list">
                {internships.map((internship) => (
                  <InternshipCard key={internship._id} internship={internship} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  marginTop: '2.5rem',
                }}
              >
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--navy-800)' }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default InternshipList;
