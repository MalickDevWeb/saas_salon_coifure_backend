const bcrypt = require("bcryptjs");
const { PrismaClient, UserRole } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 10);

  const salonOwner = await prisma.user.upsert({
    where: { email: "owner@suniou.app" },
    update: {},
    create: {
      name: "Aicha Beauty",
      email: "owner@suniou.app",
      passwordHash,
      role: UserRole.SALON
    }
  });

  const client = await prisma.user.upsert({
    where: { email: "client@suniou.app" },
    update: {},
    create: {
      name: "Fatou Client",
      email: "client@suniou.app",
      passwordHash,
      role: UserRole.CLIENT
    }
  });

  const salon = await prisma.salon.upsert({
    where: { id: "seed-salon-dkr-plateau" },
    update: {},
    create: {
      id: "seed-salon-dkr-plateau",
      name: "Suniou Dakar Plateau",
      address: "Plateau, Dakar",
      latitude: 14.6709,
      longitude: -17.4339,
      ownerId: salonOwner.id
    }
  });

  const braidService = await prisma.service.upsert({
    where: { id: "seed-service-braids" },
    update: {},
    create: {
      id: "seed-service-braids",
      salonId: salon.id,
      name: "Braids Premium",
      price: 15000,
      durationMinutes: 120
    }
  });

  await prisma.service.upsert({
    where: { id: "seed-service-manicure" },
    update: {},
    create: {
      id: "seed-service-manicure",
      salonId: salon.id,
      name: "Manicure Express",
      price: 7000,
      durationMinutes: 45
    }
  });

  const shampoo = await prisma.product.upsert({
    where: { id: "seed-product-shampoo" },
    update: {},
    create: {
      id: "seed-product-shampoo",
      salonId: salon.id,
      name: "Shampoo Karite",
      price: 5500,
      stock: 25
    }
  });

  const serum = await prisma.product.upsert({
    where: { id: "seed-product-serum" },
    update: {},
    create: {
      id: "seed-product-serum",
      salonId: salon.id,
      name: "Serum Capillaire",
      price: 9000,
      stock: 10
    }
  });

  const existingBooking = await prisma.booking.findFirst({
    where: { userId: client.id, serviceId: braidService.id }
  });

  if (!existingBooking) {
    const startTime = new Date();
    startTime.setDate(startTime.getDate() + 1);
    startTime.setHours(10, 0, 0, 0);
    const endTime = new Date(startTime.getTime() + 120 * 60 * 1000);

    await prisma.booking.create({
      data: {
        userId: client.id,
        salonId: salon.id,
        serviceId: braidService.id,
        startTime,
        endTime,
        status: "CONFIRMED"
      }
    });
  }

  const existingOrder = await prisma.order.findFirst({
    where: { userId: client.id }
  });

  if (!existingOrder) {
    await prisma.order.create({
      data: {
        userId: client.id,
        status: "PAID",
        totalAmount: 14500,
        items: {
          create: [
            { productId: shampoo.id, quantity: 1, unitPrice: 5500 },
            { productId: serum.id, quantity: 1, unitPrice: 9000 }
          ]
        }
      }
    });
  }

  console.log("Seed complete");
  console.log("Salon owner: owner@suniou.app / Password123!");
  console.log("Client: client@suniou.app / Password123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
