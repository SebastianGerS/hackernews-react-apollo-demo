import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { APP_SECRET } from '../secrets.mjs';


async function signup(parent, args, context, info) {
    const password = await bcrypt.hash(args.password, 10);
    const user = await context.prisma.user.create({data: {...args, password}})
    const token = jwt.sign({userId: user.id}, APP_SECRET);

    return {
        token, 
        user
    }
};

async function login(parent, args, context, info) {
    const user = await context.prisma.user.findUnique({where: {email: args.email}})
    if(!user) {
        throw new Error('no such user found')
    }

    const valid = await bcrypt.compare(args.password, user.password);

    if (!valid) {
        throw new Error('Invalid password')
    }

    const token = jwt.sign({userId: user.id}, APP_SECRET);

    return {
        token, 
        user
    }
};

async function createLink(_, args, context, info) {
    const { userId } = context;
    const newLink = await context.prisma.link.create({
        data: {
            description: args.description,
            url: args.url,
            postedBy: {connect: {id: userId}},
        }
    })
    console.log(newLink)
    context.pubsub.publish("NEW_LINK", newLink)
    return newLink;
};

async function updateLink(_, args, context, info) {
    const updatedLink = context.prisma.link.update({
        where: {
            id: +args.id
        },
        data: {
            description: args.description,
            url: args.url
        }
        })
    return updatedLink
};

async function deleteLink(_, args, context, info) {
    const deletedLink = context.prisma.link.delete({
        where: {
            id: +args.id
        }
    })
    return deletedLink
};

async function vote(parent, args, context, info) {
    const { userId } = context;

    const vote = await context.prisma.vote.findUnique({
        where: {
            linkId_userId: {
                linkId: +args.linkId,
                userId: userId
            }
        }
    });

    if (vote) {
        throw new Error(`Already voted for link: ${args.linkId}`);
    }

    const newVote = await context.prisma.vote.create({
        data: {
            user: {connect: {id: userId}},
            link : {connect: {id: +args.linkId}}
        }
    });

    console.log(newVote)
    context.pubsub.publish("NEW_VOTE", newVote);

    return newVote;
}

const Mutation = {
    signup,
    login,
    createLink,
    updateLink,
    deleteLink,
    vote,
};

export default Mutation;