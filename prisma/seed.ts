import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // 1. CREATE ADMIN USER
  console.log('📝 Creating admin user...')

  const adminEmail = 'admin@shophub.com'
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin123!', 10)
    
    await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: adminEmail,
        hashedPassword: hashedPassword,
        role: 'admin',
      }
    })
    console.log('✅ Admin user created!')
    console.log('   Email: admin@shophub.com')
    console.log('   Password: Admin123!')
  } else {
    console.log('⚠️ Admin user already exists, skipping...')
  }

  // 2. CREATE DEMO PRODUCTS with working placeholder images
  console.log('📦 Creating demo products...')

  const products = [
    {
      name: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max',
      description: 'The latest iPhone with A17 Pro chip, titanium design, and incredible camera system. 6.7-inch Super Retina XDR display with ProMotion.',
      price: 1450000,
      images: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
        'https://images.unsplash.com/photo-1592899677977-9e10ca2e5f0b?w=400',
      ],
      category: 'electronics',
      stock: 25,
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      description: 'Premium Android smartphone with 200MP camera, S Pen, and 6.8-inch Dynamic AMOLED display. Powered by Snapdragon 8 Gen 3.',
      price: 1350000,
      images: [
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
        'https://images.unsplash.com/photo-1624103622364-93d21164e6f5?w=400',
      ],
      category: 'electronics',
      stock: 30,
    },
    {
      name: 'MacBook Pro 14" M3',
      slug: 'macbook-pro-14-m3',
      description: 'Apple MacBook Pro with M3 Pro chip, 14-inch Liquid Retina XDR display, 18GB RAM, 512GB SSD. Perfect for developers and creatives.',
      price: 2350000,
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400',
      ],
      category: 'electronics',
      stock: 15,
    },
    {
      name: 'Nike Air Max 90',
      slug: 'nike-air-max-90',
      description: 'Classic Nike Air Max 90 sneakers. Comfortable, stylish, and durable. Available in multiple colors. Perfect for daily wear.',
      price: 85000,
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400',
      ],
      category: 'clothing',
      stock: 100,
    },
    {
      name: 'Adidas Ultraboost 22',
      slug: 'adidas-ultraboost-22',
      description: 'Ultraboost 22 running shoes with responsive cushioning, energy return, and breathable Primeknit upper. Perfect for runners.',
      price: 95000,
      images: [
        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
        'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400',
      ],
      category: 'clothing',
      stock: 80,
    },
    {
      name: 'Sony WH-1000XM5',
      slug: 'sony-wh-1000xm5',
      description: 'Industry-leading noise canceling headphones with exceptional sound quality, 30-hour battery life, and premium comfort.',
      price: 350000,
      images: [
        'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
        'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400',
      ],
      category: 'electronics',
      stock: 45,
    },
    {
      name: 'Dell XPS 15',
      slug: 'dell-xps-15',
      description: 'Premium Windows laptop with 15.6-inch 4K display, Intel Core i7, 32GB RAM, 1TB SSD. Perfect for business and creative work.',
      price: 1850000,
      images: [
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400',
        'https://images.unsplash.com/photo-1593642702821-c8ca677a638c?w=400',
      ],
      category: 'electronics',
      stock: 20,
    },
    {
      name: 'The Alchemist',
      slug: 'the-alchemist-book',
      description: 'International bestseller by Paulo Coelho. A mystical story about following your dreams. Perfect for inspiration and personal growth.',
      price: 5000,
      images: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
      ],
      category: 'books',
      stock: 200,
    },
    {
      name: 'Atomic Habits',
      slug: 'atomic-habits-book',
      description: 'by James Clear. Tiny changes, remarkable results. An easy and proven way to build good habits and break bad ones.',
      price: 7500,
      images: [
        'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
      ],
      category: 'books',
      stock: 150,
    },
    {
      name: 'Dyson V15 Detect',
      slug: 'dyson-v15-detect',
      description: 'Intelligent cordless vacuum cleaner with laser detection, LCD screen, and powerful suction. Perfect for pet hair and hard floors.',
      price: 550000,
      images: [
        'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400',
        'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400',
      ],
      category: 'home',
      stock: 12,
    },
    {
      name: 'Instant Pot Duo Plus',
      slug: 'instant-pot-duo-plus',
      description: '9-in-1 multi-functional pressure cooker, slow cooker, rice cooker, steamer, and more. Saves time in the kitchen.',
      price: 95000,
      images: [
        'https://images.unsplash.com/photo-1585664811001-39660b2c90a1?w=400',
        'https://images.unsplash.com/photo-1585664811001-39660b2c90a1?w=400',
      ],
      category: 'home',
      stock: 35,
    },
    {
      name: 'Nintendo Switch OLED',
      slug: 'nintendo-switch-oled',
      description: 'Nintendo Switch with vibrant 7-inch OLED screen, wide adjustable stand, and enhanced audio. Play anywhere.',
      price: 320000,
      images: [
        'https://images.unsplash.com/photo-1578303512597-81e6cc55ef2a?w=400',
        'https://images.unsplash.com/photo-1611069569557-ce7a62f60b8c?w=400',
      ],
      category: 'electronics',
      stock: 40,
    },
  ]

  let createdCount = 0
  for (const product of products) {
    const existingProduct = await prisma.product.findUnique({
      where: { slug: product.slug }
    })
    
    if (!existingProduct) {
      await prisma.product.create({
        data: product
      })
      createdCount++
      console.log(`   ✅ Created: ${product.name}`)
    } else {
      console.log(`   ⚠️ Skipped: ${product.name} (already exists)`)
    }
  }
  
  console.log(`✅ Created ${createdCount} new products!`)

  // 3. CREATE DEMO COUPONS
  console.log('🏷️ Creating demo coupons...')

  const coupons = [
    {
      code: 'WELCOME10',
      discount: 10,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
      usageLimit: 100,
      usedCount: 0,
    },
    {
      code: 'SAVE20',
      discount: 20,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), 
      usageLimit: 50,
      usedCount: 0,
    },
    {
      code: 'FREESHIP',
      discount: 0,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), 
      usageLimit: 200,
      usedCount: 0,
    },
  ]

  let couponCount = 0
  for (const coupon of coupons) {
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code: coupon.code }
    })
    
    if (!existingCoupon) {
      await prisma.coupon.create({
        data: coupon
      })
      couponCount++
      console.log(`   ✅ Created coupon: ${coupon.code} (${coupon.discount}% off)`)
    } else {
      console.log(`   ⚠️ Skipped coupon: ${coupon.code} (already exists)`)
    }
  }
  
  console.log(`✅ Created ${couponCount} new coupons!`)

  console.log('\n🎉 Database seeding completed!')
  console.log('====================================')
  console.log('📋 SUMMARY:')
  console.log(`   👑 Admin: admin@shophub.com / Admin123!`)
  console.log(`   📦 Products: ${createdCount} added`)
  console.log(`   🏷️ Coupons: ${couponCount} added`)
  console.log('====================================')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })