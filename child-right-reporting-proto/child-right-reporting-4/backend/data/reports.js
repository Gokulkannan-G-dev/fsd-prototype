// In-memory report store. Resets on restart.
const now = new Date().toISOString();

const reports = [
  {
    id: 1,
    trackingId: 'CR-DEMO01',
    category: 'Child labour',
    description: 'A child around 11 years old works at a roadside tea stall during school hours.',
    location: 'Near the bus stand',
    childAge: '10-12',
    urgency: 'medium',
    contact: '',
    anonymous: true,
    reporterId: null,
    status: 'under_review',
    internalNotes: [{ text: 'Forwarded to the district child protection unit.', by: 'Reviewer', at: now }],
    updates: [
      { text: 'Report received.', at: now },
      { text: 'Status changed to under review.', at: now },
    ],
    createdAt: now,
  },
];

let nextId = 2;
const nextReportId = () => nextId++;

const makeTrackingId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id;
  do {
    id = 'CR-' + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  } while (reports.some((r) => r.trackingId === id));
  return id;
};

module.exports = { reports, nextReportId, makeTrackingId };
