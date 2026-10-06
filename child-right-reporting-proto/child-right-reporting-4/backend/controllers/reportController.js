const { reports, nextReportId, makeTrackingId } = require('../data/reports');

const STATUSES = ['received', 'under_review', 'action_taken', 'resolved', 'closed'];
const URGENCIES = ['low', 'medium', 'high'];

// What a reporter may see (no internal notes, no description).
const publicView = (r) => ({
  trackingId: r.trackingId,
  category: r.category,
  status: r.status,
  urgency: r.urgency,
  updates: r.updates,
  createdAt: r.createdAt,
});

const createReport = (req, res) => {
  const { category, description, location, childAge, urgency, contact, anonymous } = req.body;
  if (!category || !description || description.trim().length < 20) {
    return res.status(400).json({ message: 'Choose a category and describe what happened (at least 20 characters)' });
  }
  const now = new Date().toISOString();
  const isAnonymous = anonymous !== false;
  const report = {
    id: nextReportId(),
    trackingId: makeTrackingId(),
    category,
    description: description.trim(),
    location: (location || '').trim(),
    childAge: childAge || 'unknown',
    urgency: URGENCIES.includes(urgency) ? urgency : 'medium',
    contact: isAnonymous ? '' : (contact || '').trim(),
    anonymous: isAnonymous,
    reporterId: req.user && !isAnonymous ? req.user.id : null,
    status: 'received',
    internalNotes: [],
    updates: [{ text: 'Report received.', at: now }],
    createdAt: now,
  };
  reports.unshift(report);
  res.status(201).json({ trackingId: report.trackingId, message: 'Report submitted' });
};

const trackReport = (req, res) => {
  const id = (req.params.trackingId || '').trim().toUpperCase();
  const report = reports.find((r) => r.trackingId === id);
  if (!report) return res.status(404).json({ message: 'No report found with that tracking ID' });
  res.json(publicView(report));
};

const myReports = (req, res) => {
  res.json(reports.filter((r) => r.reporterId === req.user.id).map(publicView));
};

const listReports = (req, res) => {
  const { status, urgency } = req.query;
  let list = reports;
  if (status) list = list.filter((r) => r.status === status);
  if (urgency) list = list.filter((r) => r.urgency === urgency);
  res.json(list);
};

const updateReport = (req, res) => {
  const report = reports.find((r) => r.id === Number(req.params.id));
  if (!report) return res.status(404).json({ message: 'Report not found' });

  const { status, internalNote, publicUpdate } = req.body;
  const now = new Date().toISOString();

  if (status) {
    if (!STATUSES.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    if (status !== report.status) {
      report.status = status;
      report.updates.push({ text: `Status changed to ${status.replace('_', ' ')}.`, at: now });
    }
  }
  if (publicUpdate && publicUpdate.trim()) report.updates.push({ text: publicUpdate.trim(), at: now });
  if (internalNote && internalNote.trim()) {
    report.internalNotes.push({ text: internalNote.trim(), by: req.user.name, at: now });
  }
  res.json(report);
};

const stats = (req, res) => {
  const byStatus = Object.fromEntries(STATUSES.map((s) => [s, reports.filter((r) => r.status === s).length]));
  const byCategory = {};
  reports.forEach((r) => { byCategory[r.category] = (byCategory[r.category] || 0) + 1; });
  res.json({
    total: reports.length,
    highUrgencyOpen: reports.filter((r) => r.urgency === 'high' && !['resolved', 'closed'].includes(r.status)).length,
    byStatus,
    byCategory,
  });
};

module.exports = { createReport, trackReport, myReports, listReports, updateReport, stats };
