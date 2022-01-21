import prisma from '@prisma/client';
const { PrismaClient } = prisma;
const prismacli = new PrismaClient();

async function main() {
    const newLink = await prismacli.link.create({
        data: {
          description: 'Fullstack tutorial for GraphQL',
          url: 'www.howtographql.com',
        },
      })
    const allLinks = await prismacli.link.findMany();
    console.log(allLinks);
}

main()
    .catch(e => {
        throw e;
    })
    .finally(async() => {
        await prismacli.$disconnect();
    });