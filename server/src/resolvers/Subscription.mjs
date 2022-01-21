const newLinkSubscriber = function(parent, args, context, info) {
    return  context.pubsub.asyncIterator("NEW_LINK")
};

const newLink = {
    subscribe: newLinkSubscriber,
    resolve: (payload, args, context, info) => {
        return payload
    },
};

const newVoteSubscriber = function(parent, args, context, info) {
    return context.pubsub.asyncIterator("NEW_VOTE")
};

const newVote = {
    subscribe: newVoteSubscriber,
    resolve: (payload, args, context, info) => {
        return payload
    },
};


const Subscription = {
    newLink,
    newVote,
};

export default Subscription;