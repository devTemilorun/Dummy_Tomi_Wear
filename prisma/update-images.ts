import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const imageUpdates = [
  { slug: 'iphone-15-pro-max', images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', 'https://images.unsplash.com/photo-1592899677977-9e10ca2e5f0b?w=400'] },
  { slug: 'samsung-galaxy-s24-ultra', images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400', 'https://images.unsplash.com/photo-1624103622364-93d21164e6f5?w=400'] },
  { slug: 'macbook-pro-14-m3', images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400'] },
  { slug: 'nike-air-max-90', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400'] },
  { slug: 'adidas-ultraboost-22', images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400', 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400'] },
  { slug: 'sony-wh-1000xm5', images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400', 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400'] },
  { slug: 'dell-xps-15', images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400', 'https://images.unsplash.com/photo-1593642702821-c8ca677a638c?w=400'] },
  { slug: 'the-alchemist-book', images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'] },
  { slug: 'atomic-habits-book', images: ['https://images.unsplash.com/photo-1589998059171-988d887df646?w=400'] },
  { slug: 'dyson-v15-detect', images: ['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400', 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400'] },
  { slug: 'instant-pot-duo-plus', images: ['https://images.unsplash.com/photo-1585664811001-39660b2c90a1?w=400', 'https://images.unsplash.com/photo-1585664811001-39660b2c90a1?w=400'] },
  { slug: 'nintendo-switch-oled', images: ['https://images.unsplash.com/photo-1578303512597-81e6cc55ef2a?w=400', 'https://images.unsplash.com/photo-1611069569557-ce7a62f60b8c?w=400'] },
]

async function main() {
  console.log('🖼️ Updating product images...')
  
  for (const update of imageUpdates) {
    await prisma.product.update({
      where: { slug: update.slug },
      data: { images: update.images }
    })
    console.log(`   ✅ Updated: ${update.slug}`)
  }
  
  console.log('✅ All product images updated!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())