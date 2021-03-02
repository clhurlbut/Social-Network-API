const { Thoughts, User } = require('../models');

const thoughtController = {
    getAllThoughts(req, res) {
        Thoughts.find({})
            .then(dbThoughts => res.json(dbThoughts))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    getThoughtById({ params }, res) {
        Thoughts.findOne({ _id: params.id })
            .then(dbThoughts => {
                if (!dbThoughts) {
                    return res.status(404).json({ message: 'No thought found :(' });
                }
                res.json(dbThoughts)
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            });
    },
    createThought({ params, body }, res) {
        Thoughts.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: params.userId },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then(dbUser => {
                if (!dbUser) {
                    return res.status(404).json({ message: 'No User with this ID!' });
                }
                res.json(dbUser);
            })
            .catch(err => res.json(err));
    },
    updateThought({ params, body }, res) {
        Thoughts.findOneAndUpdate({ _id: params.id }, body, { new: true })
            .then(dbThoughts => {
                if (!dbThoughts) {
                    return res.status(404).json({ message: 'No thought found to update!' });
                }
                res.json(dbThoughts);
            })
            .catch(err => res.status(400).json(err));
    },
    deleteThought({ params }, res) {
        Thoughts.findOneAndDelete({ _id: params.id })
            .then((dbThoughts) => {
                if (!dbThoughts) {
                    return res.status(404).json({ message: `No thought found!` });
                }
                res.json(dbThoughts);
            })
            .catch((err) => {
                res.status(500).json(err);
            });
    },
    addReaction({ params, body }, res) {
        Thoughts.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true }
        )
            .then(dbReaction => {
                if (!dbReaction) {
                    return res.status(404).json({ message: 'No reaction found!' });
                }
                res.json(dbReaction);
            })
            .catch(err => res.json(err));
    },
    deleteReaction({ params }, res) {
        Thoughts.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
            .then((dbReaction) => {
                if (!dbReaction) {
                    return res.status(404).json({ message: `No reaction found with ID: ${params.reactionID}` });
                }
                res.json(dbReaction);
            })
            .catch((err) => {
                res.status(500).json(err);
            });
    },
};

module.exports = thoughtController;
