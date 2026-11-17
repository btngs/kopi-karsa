
import "dotenv/config";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting master data seeding...");

  // 1. USERS
  const passwordHash = await bcrypt.hash("KarsaDummy123!", 10);

  const users = [
    {
      name: "Kopi Karsa Admin",
      email: "admin@kopikarsa.test",
      phone: "081234567890",
      role: "admin" as const,
    },
    {
      name: "Andi Pratama",
      email: "andi@example.test",
      phone: "081234567891",
      role: "customer" as const,
    },
    {
      name: "Siti Rahma",
      email: "siti@example.test",
      phone: "081234567892",
      role: "customer" as const,
    },
    {
      name: "Budi Santoso",
      email: "budi@example.test",
      phone: "081234567893",
      role: "customer" as const,
    },
  ];

  for (const user of users) {
    await prisma.users.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
      create: {
        ...user,
        password: passwordHash,
      },
    });
  }

  console.log("Users seeded.");

  // 2. PRODUCT CATEGORIES
  const categories = [
    {
      name: "Single Origin",
      slug: "single-origin",
      description: "Biji kopi yang berasal dari satu daerah tertentu.",
    },
    {
      name: "House Blend",
      slug: "house-blend",
      description: "Kombinasi beberapa biji kopi untuk menghasilkan profil rasa tertentu.",
    },
    {
      name: "Specialty Coffee",
      slug: "specialty-coffee",
      description: "Koleksi biji kopi berkualitas dengan karakteristik khusus.",
    },
  ];

  for (const category of categories) {
    await prisma.product_categories.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
      },
      create: category,
    });
  }

  console.log("Product categories seeded.");

  // 3. ORIGINS
  const origins = [
    {
      name: "Gayo",
      region: "Aceh, Sumatra",
      description: "Kopi dataran tinggi Gayo dengan karakter rasa kompleks.",
    },
    {
      name: "Toraja",
      region: "Sulawesi Selatan",
      description: "Kopi Toraja dengan karakter rasa khas dan body yang kuat.",
    },
    {
      name: "Pangalengan",
      region: "Jawa Barat",
      description: "Kopi dari kawasan pegunungan Pangalengan.",
    },
  ];

  for (const origin of origins) {
    const existingOrigin = await prisma.origins.findFirst({
      where: { name: origin.name },
    });

    if (existingOrigin) {
      await prisma.origins.update({
        where: { id: existingOrigin.id },
        data: {
          region: origin.region,
          description: origin.description,
        },
      });
    } else {
      await prisma.origins.create({
        data: origin,
      });
    }
  }

  console.log("Origins seeded.");

  // 4. PRODUCTS
  const productData = [
    {
      name: "Gayo Wine Process",
      slug: "gayo-wine-process",
      categorySlug: "single-origin",
      originName: "Gayo",
      coffee_type: "arabica" as const,
      product_type: "single_origin" as const,
      cultivar: "Ateng",
      processing_method: "Wine Process",
      tasting_notes: "Red wine, berry, dark chocolate",
      altitude_min: 1400,
      altitude_max: 1600,
      roast_level: "medium" as const,
      description: "Kopi Arabika Gayo dengan proses fermentasi wine yang menghasilkan karakter rasa buah.",
    },
    {
      name: "Toraja Sapan Semi Wash",
      slug: "toraja-sapan-semi-wash",
      categorySlug: "single-origin",
      originName: "Toraja",
      coffee_type: "arabica" as const,
      product_type: "single_origin" as const,
      cultivar: "S795",
      processing_method: "Semi Wash",
      tasting_notes: "Dark chocolate, spice, caramel",
      altitude_min: 1400,
      altitude_max: 1800,
      roast_level: "medium" as const,
      description: "Kopi Arabika Toraja dengan body kuat dan karakter rasa rempah.",
    },
    {
      name: "Pangalengan Honey Process",
      slug: "pangalengan-honey-process",
      categorySlug: "specialty-coffee",
      originName: "Pangalengan",
      coffee_type: "arabica" as const,
      product_type: "single_origin" as const,
      cultivar: "Lini S",
      processing_method: "Honey Process",
      tasting_notes: "Honey, citrus, brown sugar",
      altitude_min: 1400,
      altitude_max: 1700,
      roast_level: "light" as const,
      description: "Kopi Pangalengan dengan karakter manis dan aroma citrus.",
    },
    {
      name: "House Blend Espresso",
      slug: "house-blend-espresso",
      categorySlug: "house-blend",
      originName: null,
      coffee_type: "blend" as const,
      product_type: "house_blend" as const,
      cultivar: "Arabica Blend",
      processing_method: "Blend",
      tasting_notes: "Chocolate, caramel, nutty",
      altitude_min: null,
      altitude_max: null,
      roast_level: "dark" as const,
      description: "Perpaduan biji kopi pilihan untuk menghasilkan espresso dengan body kuat.",
    },
    {
      name: "Gayo Natural",
      slug: "gayo-natural",
      categorySlug: "single-origin",
      originName: "Gayo",
      coffee_type: "arabica" as const,
      product_type: "single_origin" as const,
      cultivar: "Ateng",
      processing_method: "Natural",
      tasting_notes: "Blueberry, strawberry, chocolate",
      altitude_min: 1400,
      altitude_max: 1600,
      roast_level: "light" as const,
      description: "Kopi Gayo proses natural dengan karakter buah yang menonjol.",
    },
    {
      name: "Toraja Full Washed",
      slug: "toraja-full-washed",
      categorySlug: "specialty-coffee",
      originName: "Toraja",
      coffee_type: "arabica" as const,
      product_type: "single_origin" as const,
      cultivar: "S795",
      processing_method: "Full Washed",
      tasting_notes: "Floral, citrus, dark chocolate",
      altitude_min: 1400,
      altitude_max: 1800,
      roast_level: "medium" as const,
      description: "Kopi Toraja proses full washed dengan karakter rasa bersih dan seimbang.",
    },
  ];

  for (const product of productData) {
    const category = await prisma.product_categories.findUnique({
      where: { slug: product.categorySlug },
    });

    const origin = product.originName
      ? await prisma.origins.findFirst({
          where: { name: product.originName },
        })
      : null;

    if (!category) {
      throw new Error(`Category not found: ${product.categorySlug}`);
    }

    if (product.originName && !origin) {
      throw new Error(`Origin not found: ${product.originName}`);
    }

    const {
      categorySlug,
      originName,
      ...productFields
    } = product;

    const savedProduct = await prisma.products.upsert({
      where: { slug: product.slug },
      update: {
        ...productFields,
        category_id: category.id,
        origin_id: origin?.id ?? null,
      },
      create: {
        ...productFields,
        category_id: category.id,
        origin_id: origin?.id ?? null,
      },
    });

    // 5. PRODUCT IMAGES
    const images = [
      `/images/dummy/${product.slug}-1.jpg`,
      `/images/dummy/${product.slug}-2.jpg`,
    ];

    for (const [index, imagePath] of images.entries()) {
      const existingImage = await prisma.product_images.findFirst({
        where: {
          product_id: savedProduct.id,
          image_path: imagePath,
        },
      });

      if (!existingImage) {
        await prisma.product_images.create({
          data: {
            product_id: savedProduct.id,
            image_path: imagePath,
            is_primary: index === 0,
            sort_order: index + 1,
          },
        });
      }
    }

    // 6. PRODUCT VARIANTS
    const variants = [
      {
        weight_grams: 200,
        price: "65000",
        stock: 30,
      },
      {
        weight_grams: 500,
        price: "145000",
        stock: 20,
      },
      {
        weight_grams: 1000,
        price: "275000",
        stock: 10,
      },
    ];

    for (const variant of variants) {
      const sku = `KK-${product.slug.toUpperCase()}-${variant.weight_grams}`;

      await prisma.product_variants.upsert({
        where: { sku },
        update: {
          ...variant,
          product_id: savedProduct.id,
          is_active: true,
        },
        create: {
          ...variant,
          sku,
          product_id: savedProduct.id,
          is_active: true,
        },
      });
    }
  }

  console.log("Products, images, and variants seeded.");

  // 7. USER ADDRESSES
  const userAndi = await prisma.users.findUnique({ where: { email: "andi@example.test" } });
  const userSiti = await prisma.users.findUnique({ where: { email: "siti@example.test" } });

  if (!userAndi || !userSiti) {
    throw new Error("Required seed users missing");
  }

  const addressesData = [
    {
      user_id: userAndi.id,
      label: "Rumah",
      recipient_name: userAndi.name,
      recipient_phone: userAndi.phone ?? "081234567891",
      address: "Jl. Dago Asri No. 12",
      city: "Bandung",
      province: "Jawa Barat",
      postal_code: "40135",
      is_default: true,
    },
    {
      user_id: userAndi.id,
      label: "Kantor",
      recipient_name: userAndi.name,
      recipient_phone: userAndi.phone ?? "081234567891",
      address: "Menara Sudirman Lt. 8, Jl. Jend. Sudirman Kav. 60",
      city: "Jakarta Selatan",
      province: "DKI Jakarta",
      postal_code: "12190",
      is_default: false,
    },
    {
      user_id: userSiti.id,
      label: "Rumah",
      recipient_name: userSiti.name,
      recipient_phone: userSiti.phone ?? "081234567892",
      address: "Jl. Manyar Kertoarjo No. 45",
      city: "Surabaya",
      province: "Jawa Timur",
      postal_code: "60118",
      is_default: true,
    },
  ];

  const formatShippingAddress = (addr: (typeof addressesData)[0]) => ({
    user_id: Number(addr.user_id),
    label: addr.label,
    recipient_name: addr.recipient_name,
    recipient_phone: addr.recipient_phone,
    address: addr.address,
    city: addr.city,
    province: addr.province,
    postal_code: addr.postal_code,
    is_default: addr.is_default,
  });

  for (const addr of addressesData) {
    const existing = await prisma.user_addresses.findFirst({
      where: { user_id: addr.user_id, label: addr.label },
    });
    if (existing) {
      await prisma.user_addresses.update({
        where: { id: existing.id },
        data: addr,
      });
    } else {
      await prisma.user_addresses.create({ data: addr });
    }
  }
  console.log("User addresses seeded.");

  // 8. ORDERS & ORDER ITEMS
  const variantGayo200 = await prisma.product_variants.findUnique({ where: { sku: "KK-GAYO-WINE-PROCESS-200" } });
  const variantToraja200 = await prisma.product_variants.findUnique({ where: { sku: "KK-TORAJA-SAPAN-SEMI-WASH-200" } });
  const variantBlend500 = await prisma.product_variants.findUnique({ where: { sku: "KK-HOUSE-BLEND-ESPRESSO-500" } });
  const variantPangalengan200 = await prisma.product_variants.findUnique({ where: { sku: "KK-PANGALENGAN-HONEY-PROCESS-200" } });

  if (!variantGayo200 || !variantToraja200 || !variantBlend500 || !variantPangalengan200) {
    throw new Error("Required product variants missing");
  }

  // Order 1: Pending (Andi)
  const order1 = await prisma.orders.upsert({
    where: { order_number: "KK-ORD-0001" },
    update: {
      status: "pending",
      subtotal: "65000",
      shipping_cost: "20000",
      total_amount: "85000",
    },
    create: {
      user_id: userAndi.id,
      order_number: "KK-ORD-0001",
      status: "pending",
      subtotal: "65000",
      shipping_cost: "20000",
      total_amount: "85000",
      shipping_address: formatShippingAddress(addressesData[0]),
      notes: "Tolong kirim biji utuh, jangan digiling.",
    },
  });

  const existingItem1 = await prisma.order_items.findFirst({
    where: { order_id: order1.id, product_variant_id: variantGayo200.id },
  });
  if (!existingItem1) {
    await prisma.order_items.create({
      data: {
        order_id: order1.id,
        product_variant_id: variantGayo200.id,
        product_name: "Gayo Wine Process",
        sku: variantGayo200.sku,
        weight_grams: variantGayo200.weight_grams,
        unit_price: "65000",
        quantity: 1,
        subtotal: "65000",
      },
    });
  }

  // Order 2: Delivered (Andi)
  const order2 = await prisma.orders.upsert({
    where: { order_number: "KK-ORD-0002" },
    update: {
      status: "delivered",
      subtotal: "210000",
      shipping_cost: "20000",
      total_amount: "230000",
    },
    create: {
      user_id: userAndi.id,
      order_number: "KK-ORD-0002",
      status: "delivered",
      subtotal: "210000",
      shipping_cost: "20000",
      total_amount: "230000",
      shipping_address: formatShippingAddress(addressesData[0]),
    },
  });

  let order2Item1 = await prisma.order_items.findFirst({
    where: { order_id: order2.id, product_variant_id: variantToraja200.id },
  });
  if (!order2Item1) {
    order2Item1 = await prisma.order_items.create({
      data: {
        order_id: order2.id,
        product_variant_id: variantToraja200.id,
        product_name: "Toraja Sapan Semi Wash",
        sku: variantToraja200.sku,
        weight_grams: variantToraja200.weight_grams,
        unit_price: "65000",
        quantity: 1,
        subtotal: "65000",
      },
    });
  }

  let order2Item2 = await prisma.order_items.findFirst({
    where: { order_id: order2.id, product_variant_id: variantBlend500.id },
  });
  if (!order2Item2) {
    order2Item2 = await prisma.order_items.create({
      data: {
        order_id: order2.id,
        product_variant_id: variantBlend500.id,
        product_name: "House Blend Espresso",
        sku: variantBlend500.sku,
        weight_grams: variantBlend500.weight_grams,
        unit_price: "145000",
        quantity: 1,
        subtotal: "145000",
      },
    });
  }

  // Order 3: Shipped (Siti)
  const order3 = await prisma.orders.upsert({
    where: { order_number: "KK-ORD-0003" },
    update: {
      status: "shipped",
      subtotal: "130000",
      shipping_cost: "20000",
      total_amount: "150000",
    },
    create: {
      user_id: userSiti.id,
      order_number: "KK-ORD-0003",
      status: "shipped",
      subtotal: "130000",
      shipping_cost: "20000",
      total_amount: "150000",
      shipping_address: formatShippingAddress(addressesData[2]),
    },
  });

  const existingItem3 = await prisma.order_items.findFirst({
    where: { order_id: order3.id, product_variant_id: variantPangalengan200.id },
  });
  if (!existingItem3) {
    await prisma.order_items.create({
      data: {
        order_id: order3.id,
        product_variant_id: variantPangalengan200.id,
        product_name: "Pangalengan Honey Process",
        sku: variantPangalengan200.sku,
        weight_grams: variantPangalengan200.weight_grams,
        unit_price: "65000",
        quantity: 2,
        subtotal: "130000",
      },
    });
  }
  console.log("Orders & order items seeded.");

  // 9. PAYMENTS
  const paymentsData = [
    {
      order_id: order1.id,
      payment_method: "qris" as const,
      payment_provider: "Midtrans",
      transaction_id: "TRX-DUMMY-001",
      payment_code: "https://api.sandbox.midtrans.com/qris/dummy-001",
      checkout_url: "https://app.sandbox.midtrans.com/snap/v2/vtweb/dummy-001",
      amount: "85000",
      status: "pending" as const,
    },
    {
      order_id: order2.id,
      payment_method: "virtual_account" as const,
      payment_provider: "BCA",
      transaction_id: "TRX-DUMMY-002",
      payment_code: "8801234567890",
      checkout_url: null,
      amount: "230000",
      status: "paid" as const,
      paid_at: new Date(),
    },
    {
      order_id: order3.id,
      payment_method: "e_wallet" as const,
      payment_provider: "GoPay",
      transaction_id: "TRX-DUMMY-003",
      payment_code: "GOPAY-QR-003",
      checkout_url: null,
      amount: "150000",
      status: "paid" as const,
      paid_at: new Date(),
    },
  ];

  for (const p of paymentsData) {
    const existing = await prisma.payments.findFirst({
      where: { order_id: p.order_id, transaction_id: p.transaction_id },
    });
    if (existing) {
      await prisma.payments.update({
        where: { id: existing.id },
        data: p,
      });
    } else {
      await prisma.payments.create({ data: p });
    }
  }
  console.log("Payments seeded.");

  // 10. SHIPMENTS
  await prisma.shipments.upsert({
    where: { order_id: order2.id },
    update: {
      courier_name: "JNE",
      courier_service: "REG",
      tracking_number: "JNE-DUMMY-002",
      shipping_cost: "20000",
      status: "delivered",
      shipped_at: new Date(Date.now() - 3 * 86400000),
      delivered_at: new Date(Date.now() - 1 * 86400000),
    },
    create: {
      order_id: order2.id,
      courier_name: "JNE",
      courier_service: "REG",
      tracking_number: "JNE-DUMMY-002",
      shipping_cost: "20000",
      status: "delivered",
      shipped_at: new Date(Date.now() - 3 * 86400000),
      delivered_at: new Date(Date.now() - 1 * 86400000),
    },
  });

  await prisma.shipments.upsert({
    where: { order_id: order3.id },
    update: {
      courier_name: "SiCepat",
      courier_service: "BEST",
      tracking_number: "SICEPAT-DUMMY-003",
      shipping_cost: "20000",
      status: "shipped",
      shipped_at: new Date(Date.now() - 1 * 86400000),
    },
    create: {
      order_id: order3.id,
      courier_name: "SiCepat",
      courier_service: "BEST",
      tracking_number: "SICEPAT-DUMMY-003",
      shipping_cost: "20000",
      status: "shipped",
      shipped_at: new Date(Date.now() - 1 * 86400000),
    },
  });
  console.log("Shipments seeded.");

  // 11. PRODUCT REVIEWS
  const productToraja = await prisma.products.findUnique({ where: { slug: "toraja-sapan-semi-wash" } });
  const productBlend = await prisma.products.findUnique({ where: { slug: "house-blend-espresso" } });

  if (productToraja && order2Item1) {
    await prisma.product_reviews.upsert({
      where: {
        user_id_product_id: {
          user_id: userAndi.id,
          product_id: productToraja.id,
        },
      },
      update: {
        order_item_id: order2Item1.id,
        rating: 5,
        title: "Kopi mantap, aroma rempahnya kuat!",
        comment: "Body tebal dan cocok sekali diseduh tubruk atau V60.",
      },
      create: {
        user_id: userAndi.id,
        product_id: productToraja.id,
        order_item_id: order2Item1.id,
        rating: 5,
        title: "Kopi mantap, aroma rempahnya kuat!",
        comment: "Body tebal dan cocok sekali diseduh tubruk atau V60.",
      },
    });
  }

  if (productBlend && order2Item2) {
    await prisma.product_reviews.upsert({
      where: {
        user_id_product_id: {
          user_id: userAndi.id,
          product_id: productBlend.id,
        },
      },
      update: {
        order_item_id: order2Item2.id,
        rating: 4,
        title: "Crema tebal untuk espresso",
        comment: "Aftertaste cokelat pekat, tidak terlalu asam.",
      },
      create: {
        user_id: userAndi.id,
        product_id: productBlend.id,
        order_item_id: order2Item2.id,
        rating: 4,
        title: "Crema tebal untuk espresso",
        comment: "Aftertaste cokelat pekat, tidak terlalu asam.",
      },
    });
  }
  console.log("Product reviews seeded.");

  // 12. STOCK MOVEMENTS
  const stockLogs = [
    {
      product_variant_id: variantGayo200.id,
      movement_type: "in" as const,
      quantity: 30,
      stock_before: 0,
      stock_after: 30,
      description: "Initial stock intake batch #1",
    },
    {
      product_variant_id: variantToraja200.id,
      movement_type: "out" as const,
      quantity: -1,
      stock_before: 30,
      stock_after: 29,
      description: "Deduction order KK-ORD-0002",
    },
    {
      product_variant_id: variantPangalengan200.id,
      movement_type: "out" as const,
      quantity: -2,
      stock_before: 30,
      stock_after: 28,
      description: "Deduction order KK-ORD-0003",
    },
  ];

  for (const log of stockLogs) {
    const existing = await prisma.stock_movements.findFirst({
      where: {
        product_variant_id: log.product_variant_id,
        description: log.description,
      },
    });
    if (!existing) {
      await prisma.stock_movements.create({ data: log });
    }
  }
  console.log("Stock movements seeded.");

  console.log("Master & transactional data seeding completed.");
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
