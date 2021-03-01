const { User } = require('../models');

const userController = {
    getAllUsers(req, res) {
        User.find({})
            .populate({
                path: 'thoughts',
                select: '__v'
            })
            .select('-__v')
            .sort(({ _id: -1 }))
            .then(dbUser => res.json(dbUser))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({
                path: 'thoughts',
                select: '__v'
            })
            .select('__v')
            .then(dbUser => {
                if (!dbUser) {
                    return res.status(404).json({ message: 'No user with this ID found!' });
                }
                res.json(dbUser)
            })
            .catch(err =>
                res.status(400).json(err));
    },

    createUser({ body }, res) {
        User.create(body)
            .then(dbUser => res.json(dbUser))
            .catch(err => res.status(400).json(err));
    },
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, {
            new: true
        })
            .then((dbUser) => {
                if (!dbUser) {
                    return res.status(404).json({ message: 'No user found!' });
                }
                res.json(dbUser);
            })
            .catch(err => res.status(400).json(err));
    },
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then((dbUser) => {
                if (!dbUser) {
                    return res.status(404)({ message: 'No user found!' });
                }
                res.json(dbUser);
            })
            .catch(err =>
                res.status(400).json(err));

    },

    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { friends: params.friendId } },
            { new: true }
        )
            .then(dbUser => {
                if (!dbUser) {
                    return res.status(404).json({ message: 'No user found!' });
                }
                res.json(dbUser);
            })
            .catch(err => res.json(err));
    },
    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true }
        )
            .then(dbUser => res.json(dbUser))
            .catch(err => res.json(err));
    },
};

module.exports = userController;
