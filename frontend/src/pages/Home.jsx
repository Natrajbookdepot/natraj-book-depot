import React from 'react';
import HeroCarousel from '../components/HeroCarousel';

const slides = [
  {
    headline: 'Back to School Made Easy with Ready-to-Go Kits',
    subheading: 'Simplify school prep with curated sets for every class and board — trusted by parents across Jhansi for 25+ years.',
    buttonText: 'Shop Now',
    route: '/products/school-sets',
    image: '/assets/banners/banner1.jpg'
  },
  {
    headline: '25 Years of Educational Trust — Now Online',
    subheading: 'From Sipri Bazar to your screen — Jhansi’s go-to bookstore now delivers books, stationery, and more with care and commitment.',
    buttonText: 'Explore Our Story',
    route: '/about',
    image: '/assets/banners/banner1.jpg'
  },
  {
    headline: 'From Notebooks to Calculators – Everything in One Place',
    subheading: 'Books, stationery, schoolware, and office supplies — explore 1000+ essentials under one trusted roof.',
    buttonText: 'View All Categories',
    route: '/categories',
    image: '/assets/banners/banner1.jpg'
  },
  {
    headline: 'Bulk Orders? School Tie-ups? We’ve Got You Covered.',
    subheading: 'Partner with Natraj Book Depot for class-wise kits, staff supplies, or institutional needs. Competitive rates. Timely delivery. Personalized care.',
    buttonText: 'Request a Callback',
    route: '/contact?inquiry=bulk-order',
    image: '/assets/banners/banner1.jpg'
  },
  {
    headline: 'Click, Pay, Relax – We Deliver in Jhansi',
    subheading: 'Fast, local delivery for school sets, notebooks, and stationery. 100% original products. Easy returns. Cash & online payments supported.',
    buttonText: 'Start Shopping',
    route: '/shop',
    image: '/assets/banners/banner1.jpg'
  }
];

const Home = () => {
  return <HeroCarousel slides={slides} />;
};

export default Home;
