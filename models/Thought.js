const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
    },
    reactionBody: {
        type: String,
        required: 'A reaction is required to post!',
        minlength: 1,
        maxlength: 280
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    },
},
    {
        toJSON: {
            getters: true,
        },

    });
const ThoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: 'A thought is required to post!',
        minlength: 1,
        maxlength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    },
    username: {
        type: String,
        required: true
    },
    reactions:
        [ReactionSchema]
},
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    });

ThoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
})

const Thoughts = model("Thought", ThoughtSchema);

module.exports = Thoughts;