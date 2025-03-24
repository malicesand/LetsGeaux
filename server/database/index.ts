import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // await prisma.user.create ({
  //   data: {
  //     username: 'Bob', 
  //     email: 'kid2luv@yahoo.com', 
  //     isVerified: true,
  //     phoneNum: '3413791',
  //     isNotified: false,
  //   },
  // }),
  const allUsers = await prisma.user.findMany()
  console.dir(allUsers)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
