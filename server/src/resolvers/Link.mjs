function postedBy(parent, args, context) {
    return context.prisma.link.findUnique({where: {id: +parent.id}}).postedBy()
};

function votes(parent, args, context) {
    return context.prisma.link.findUnique({where: {id: +parent.id}}).votes()
};

const Link = {
    postedBy,
    votes,
};

export default Link;