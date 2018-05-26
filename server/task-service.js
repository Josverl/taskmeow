const Task = require("./task-model");
const ReadPreference = require("mongodb").ReadPreference;

require("./mongo").connect();

function get(req, res) {
  const docquery = Task.find({ user: req.user._id }).read(
    ReadPreference.NEAREST
  );
  docquery
    .exec()
    .then(tasks => {
      res.json(tasks);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

function create(req, res) {
  const task = new Task({
    user: req.user._id,
    title: req.body.title,
    order: req.body.order
  });

  task
    .save()
    .then(() => {
      res.json(task);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

function update(req, res) {
  Task.findOne({ _id: req.params.id })
    .then(task => {
      task.title = req.body.title;
      task.completed = req.body.completed;
      task.starred = req.body.starred;
      task.order = req.body.order;
      return task.save();
    })
    .then(task => {
      res.json(task);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

function remove(req, res) {
  Task.findOneAndRemove({ _id: req.params.id })
    .then(task => {
      res.status(204).send(task);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

module.exports = {
  get,
  create,
  update,
  remove
};
