const { resources, nextResourceId } = require('../data/resources');

const listResources = (req, res) => {
  const { type } = req.query;
  res.json(type ? resources.filter((r) => r.type === type) : resources);
};

const createResource = (req, res) => {
  const { type, title, description, contact, link } = req.body;
  if (!title || !description) return res.status(400).json({ message: 'Title and description are required' });
  const item = {
    id: nextResourceId(),
    type: ['helpline', 'legal', 'guide'].includes(type) ? type : 'guide',
    title: title.trim(),
    description: description.trim(),
    contact: (contact || '').trim(),
    link: (link || '').trim(),
  };
  resources.push(item);
  res.status(201).json(item);
};

const deleteResource = (req, res) => {
  const index = resources.findIndex((r) => r.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Resource not found' });
  resources.splice(index, 1);
  res.json({ message: 'Resource deleted' });
};

module.exports = { listResources, createResource, deleteResource };
