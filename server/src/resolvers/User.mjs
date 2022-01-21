function links(parent, args, context) {
    return context.prisma.user.findUnique({where:{id: +parent.id}}).links();
};

function votes(parent, args, context) {
    return context.prisma.user.findUnique({where:{id: +parent.id}}).votes();
};

const User = {
    links,
    votes
};

export default User;