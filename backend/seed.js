require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');

const sampleProducts = [
  {
    _id: "65a1234567890abcdef00001",
    title: "Aranmula Metal Mirror (Kannadi)",
    artisan: "Gopakumar V.",
    village: "Aranmula",
    state: "Kerala",
    price: 18500,
    image: "/images/products/aranmula_mirror.png",
    image2: "/images/products/aranmula_mirror.png",
    artisanImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100",
    authentic: true,
    category: "Metalwork",
    material: "Metal Alloy",
    isBestseller: true,
    priceBreakdown: { artisan: 18500, platformFee: 0, middleman: 0 }
  },
  {
    _id: "65a1234567890abcdef00002",
    title: "Gond Painting on Canvas",
    artisan: "Ramesh Shyam",
    village: "Patangarh",
    state: "Madhya Pradesh",
    price: 5400,
    image: "/images/products/gond_painting.png",
    image2: "/images/products/gond_painting.png",
    artisanImage: "https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?auto=format&fit=crop&q=80&w=100",
    authentic: true,
    category: "Paintings",
    material: "Canvas",
    isBestseller: true,
    priceBreakdown: { artisan: 5400, platformFee: 0, middleman: 0 }
  },
  {
    _id: "65a1234567890abcdef00003",
    title: "Bagh Print Textile",
    artisan: "Mohammed Yusuf Khatri",
    village: "Bagh",
    state: "Madhya Pradesh",
    price: 3200,
    image: "/images/products/bagh_print.png",
    image2: "/images/products/bagh_print.png",
    artisanImage: "https://images.unsplash.com/photo-1543881473-b2db8de3dafa?auto=format&fit=crop&q=80&w=100",
    authentic: true,
    category: "Textiles",
    material: "Cotton",
    isBestseller: false,
    priceBreakdown: { artisan: 3200, platformFee: 0, middleman: 0 }
  },
  {
    title: "Warli Tribal Canvas Art",
    artisan: "Jivya Soma Mashe",
    village: "Dahanu",
    state: "Maharashtra",
    price: 4500,
    image: "/images/products/warli_painting.png",
    image2: "/images/products/warli_painting.png",
    artisanImage: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=100",
    authentic: true,
    category: "Paintings",
    material: "Canvas",
    isBestseller: false,
    priceBreakdown: { artisan: 4500, platformFee: 0, middleman: 0 }
  },
  {
    _id: "65a1234567890abcdef00005",
    title: "Wooden Lacquer Toys",
    artisan: "Srinivas Rao",
    village: "Channapatna",
    state: "Karnataka",
    price: 1800,
    image: "/images/products/lacquer_toys.png",
    image2: "/images/products/lacquer_toys.png",
    artisanImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
    authentic: true,
    category: "Decor",
    material: "Wood",
    isBestseller: true,
    priceBreakdown: { artisan: 1800, platformFee: 0, middleman: 0 }
  },
  {
    _id: "65a1234567890abcdef00006",
    title: "Manipuri Handloom Weaving",
    artisan: "Ibemhal Devi",
    village: "Imphal",
    state: "Manipur",
    price: 6500,
    image: "/images/products/manipuri_handloom.png",
    image2: "/images/products/manipuri_handloom.png",
    artisanImage: "https://images.unsplash.com/photo-1620188989504-20d0f4d34cd6?q=80&w=100",
    authentic: true,
    category: "Textiles",
    material: "Silk & Cotton",
    isBestseller: false,
    priceBreakdown: { artisan: 6500, platformFee: 0, middleman: 0 }
  },
  {
    title: "Pipli Applique Wall Hanging",
    artisan: "Hemchandra Goswami",
    village: "Pipli",
    state: "Odisha",
    price: 8900,
    image: "/images/products/jagannath_pattachitra.jpg",
    image2: "/images/products/jagannath_pattachitra.jpg",
    artisanImage: "https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?auto=format&fit=crop&q=80&w=100",
    authentic: true,
    category: "Decor",
    material: "Fabric & Sequins",
    isBestseller: false,
    priceBreakdown: { artisan: 8900, platformFee: 0, middleman: 0 }
  },
  {
    title: "Odisha Pattachitra Scroll Art",
    artisan: "Anita Paswan",
    village: "Raghurajpur",
    state: "Odisha",
    price: 6400,
    image: "/images/products/odisha_dance_art.jpg",
    image2: "/images/products/odisha_dance_art.jpg",
    artisanImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
    authentic: true,
    category: "Paintings",
    material: "Paper",
    isBestseller: true,
    priceBreakdown: { artisan: 6400, platformFee: 0, middleman: 0 }
  },
  {
    title: "Bishnupur Terracotta Art Pottery",
    artisan: "Ramesh Kumar",
    village: "Bishnupur",
    state: "West Bengal",
    price: 3200,
    image: "/images/products/jagannath_pattachitra.jpg",
    image2: "/images/products/jagannath_pattachitra.jpg",
    artisanImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100",
    authentic: true,
    category: "Pottery",
    material: "Clay",
    isBestseller: false,
    priceBreakdown: { artisan: 3200, platformFee: 0, middleman: 0 }
  },
  {
    _id: "65a1234567890abcdef00010",
    title: "Bastar Dhokra Metal Craft",
    artisan: "Budhan Ram",
    village: "Bastar",
    state: "Chhattisgarh",
    price: 8500,
    image: "/images/products/dhokra_figurines.jpg",
    image2: "/images/products/dhokra_figurines.jpg",
    artisanImage: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=100",
    authentic: true,
    category: "Metalwork",
    material: "Brass",
    isBestseller: true,
    priceBreakdown: { artisan: 8500, platformFee: 0, middleman: 0 }
  },
  {
    title: "Aranmula Brass Metal Wall Art",
    artisan: "Shivu Lohar",
    village: "Kondagaon",
    state: "Chhattisgarh",
    price: 4100,
    image: "/images/products/aranmula_mirror.png",
    image2: "/images/products/dhokra_figurines.jpg",
    artisanImage: "https://images.unsplash.com/photo-1543881473-b2db8de3dafa?auto=format&fit=crop&q=80&w=100",
    authentic: true,
    category: "Metalwork",
    material: "Iron",
    isBestseller: false,
    priceBreakdown: { artisan: 4100, platformFee: 0, middleman: 0 }
  },
  {
    title: "Madhubani Folk Art Print",
    artisan: "Sunita Kumhar",
    village: "Jitwarpur",
    state: "Bihar",
    price: 2100,
    image: "/images/products/madhubani_folk_art.jpg",
    image2: "/images/products/madhubani_folk_art.jpg",
    artisanImage: "https://images.unsplash.com/photo-1620188989504-20d0f4d34cd6?q=80&w=100",
    authentic: true,
    category: "Pottery",
    material: "Clay",
    isBestseller: false,
    priceBreakdown: { artisan: 2100, platformFee: 0, middleman: 0 }
  },
  {
    title: "Lord Jagannath Wooden Deity Idol",
    artisan: "Praveen Acharya",
    village: "Puri",
    state: "Odisha",
    price: 2600,
    image: "/images/products/jagannath_idol.jpg",
    image2: "/images/products/jagannath_idol.jpg",
    artisanImage: "https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?auto=format&fit=crop&q=80&w=100",
    authentic: true,
    category: "Decor",
    material: "Wood",
    isBestseller: false,
    priceBreakdown: { artisan: 2600, platformFee: 0, middleman: 0 }
  },
  {
    title: "Zardozi Embroidery Panel",
    artisan: "Lakshmi Narayana",
    village: "Srikalahasti",
    state: "Andhra Pradesh",
    price: 4100,
    image: "/images/products/zardozi_camel.jpg",
    image2: "/images/products/zardozi_camel.jpg",
    artisanImage: "https://images.unsplash.com/photo-1543881473-b2db8de3dafa?auto=format&fit=crop&q=80&w=100",
    authentic: true,
    category: "Textiles",
    material: "Velvet & Gold Thread",
    isBestseller: true,
    priceBreakdown: { artisan: 4100, platformFee: 0, middleman: 0 }
  },
  {
    title: "Handwoven Bamboo Basket Collection",
    artisan: "Kamla T.",
    village: "Sualkuchi",
    state: "Assam",
    price: 2850,
    image: "/images/products/bamboo_baskets_colorful.jpg",
    image2: "/images/products/woven_basket_set.jpg",
    artisanImage: "https://images.unsplash.com/photo-1620188989504-20d0f4d34cd6?q=80&w=100",
    authentic: true,
    category: "Decor",
    material: "Bamboo",
    isBestseller: false,
    priceBreakdown: { artisan: 2850, platformFee: 0, middleman: 0 }
  },
  {
    title: "Tribal Pine Needle Woven Basket Set",
    artisan: "Tenzin Norbu",
    village: "Tawang",
    state: "Arunachal Pradesh",
    price: 11500,
    image: "/images/products/woven_basket_set.jpg",
    image2: "/images/products/bamboo_baskets_colorful.jpg",
    artisanImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100",
    authentic: true,
    category: "Decor",
    material: "Wood",
    isBestseller: true,
    priceBreakdown: { artisan: 11500, platformFee: 0, middleman: 0 }
  },
  {
    title: "Kashmir Kani Embroidered Shawl",
    artisan: "Anjali Gogoi",
    village: "Sualkuchi",
    state: "Assam",
    price: 14500,
    image: "/images/products/kashmir_kani_shawl.jpg",
    image2: "/images/products/kashmir_kani_shawl.jpg",
    artisanImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
    authentic: true,
    category: "Textiles",
    material: "Assam Silk",
    isBestseller: false,
    priceBreakdown: { artisan: 14500, platformFee: 0, middleman: 0 }
  },
  {
    _id: "65a1234567890abcdef00017",
    title: "Sambalpuri Ikkat Handloom Saree - Elephant Motif",
    artisan: "Meher Weavers",
    village: "Bargarh",
    state: "Odisha",
    price: 8500,
    image: "/images/products/odisha_saree_1.jpg",
    image2: "/images/products/odisha_saree_1.jpg",
    artisanImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100",
    authentic: true,
    category: "Textiles",
    material: "Pure Cotton",
    isBestseller: true,
    priceBreakdown: { artisan: 8500, platformFee: 0, middleman: 0 }
  },
  {
    _id: "65a1234567890abcdef00018",
    title: "Odisha Ikat Saree - Traditional Blue Geometry",
    artisan: "Patnaik Handlooms",
    village: "Nuapatna",
    state: "Odisha",
    price: 9200,
    image: "/images/products/odisha_saree_2.jpg",
    image2: "/images/products/odisha_saree_2.jpg",
    artisanImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100",
    authentic: true,
    category: "Textiles",
    material: "Pure Silk",
    isBestseller: false,
    priceBreakdown: { artisan: 9200, platformFee: 0, middleman: 0 }
  }
];


const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hastkala');
    
    await Product.deleteMany();
    await User.deleteMany();
    await Order.deleteMany();
    
    const products = await Product.insertMany(sampleProducts);

    // Create hashed passwords for demo users
    const hash = async (pw) => bcrypt.hash(pw, 10);
    await User.insertMany([
      { 
        name: 'Demo Buyer',   
        email: 'buyer@hastkala.com',   
        password: await hash('buyer123'),   
        role: 'buyer',
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2000&auto=format&fit=crop',
        location: 'Mumbai, Maharashtra',
        upi: 'buyer@upi'
      },
      {
        name: 'Kamla Devi',
        email: 'artisan@hastkala.com',
        password: await hash('artisan123'),
        role: 'artisan',
        location: 'Raghurajpur, Odisha',
        specialty: 'Traditional Pottery',
        upi: 'kamla@aadhaar',
        image: 'https://images.unsplash.com/photo-1620188989504-20d0f4d34cd6?q=80&w=2070&auto=format&fit=crop',
        isVerified: true,
        metrics: { totalEarnings: 42850, priceMirrorSavings: 18200, pendingOrders: 4, shippingToday: 2 },
        liveProducts: [
          { name: 'Terracotta Horse Figurine', price: 1200, stock: 5, views: 142, orders: 8,  image: '/images/products/img2_3.jpg' },
          { name: 'Painted Clay Vase',          price: 850,  stock: 2, views: 89,  orders: 3,  image: '/images/products/img2_6.jpg' },
          { name: 'Kondapalli Traditional Toy', price: 450,  stock: 12,views: 45,  orders: 12, image: '/images/products/img3_1.jpg' }
        ]
      },
      { name: 'Admin User', email: 'admin@hastkala.com', password: await hash('admin123'), role: 'admin' },
    ]);

    // Seed some orders for the demo buyer
    await Order.create({
      customerInfo: {
        name: "Demo Buyer",
        email: "buyer@hastkala.com",
        address: "45 Heritage Street",
        city: "Mumbai",
        zipCode: "400001"
      },
      items: [
        {
          productId: products[0]._id,
          title: products[0].title,
          quantity: 1,
          price: products[0].price,
          image: products[0].image
        },
        {
          productId: products[1]._id,
          title: products[1].title,
          quantity: 2,
          price: products[1].price,
          image: products[1].image
        }
      ],
      totalAmount: products[0].price + (products[1].price * 2),
      status: 'shipped',
      orderStatus: 'Shipped',
      paymentStatus: 'Completed',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    });

    await Order.create({
      customerInfo: {
        name: "Demo Buyer",
        email: "buyer@hastkala.com",
        address: "45 Heritage Street",
        city: "Mumbai",
        zipCode: "400001"
      },
      items: [
        {
          productId: products[3]._id,
          title: products[3].title,
          quantity: 1,
          price: products[3].price,
          image: products[3].image
        }
      ],
      totalAmount: products[3].price,
      status: 'pending',
      orderStatus: 'Placed',
      paymentStatus: 'Pending',
      createdAt: new Date()
    });
    
    console.log('Database seeded successfully!');
    console.log('');
    console.log('--- Demo Login Credentials ---');
    console.log('Buyer:   buyer@hastkala.com   / buyer123');
    console.log('Artisan: artisan@hastkala.com / artisan123');
    console.log('Admin:   admin@hastkala.com   / admin123');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
