async function feed(parent, args, context) {

    const where = args.filter 
    ? {
        OR: [
            {description: {contains: args.filter}}, 
            {url: {contains: args.filter}}
        ]
    } : {};

    const links = await context.prisma.link.findMany({
        where,
        skip: args.skip,
        take: args.take,
        orderBy: args.orderBy,
    });

    const count = await context.prisma.link.count({where})

    return {
        links,
        count,
    };
}

function link(parent, args, context) {
    return context.prisma.link.findUnique({where: {id: +args.id}})
}
const Query = {
    feed,
    link
}

export default Query