"use client"

import Link from 'next/link'
import Collections from "@/components/collections/ProductCollections"
import styles from './page.module.css'
import { useSimpleAuth } from '@/contexts/SimpleAuthContext'

export default function HomePage() {
  const { user, loading } = useSimpleAuth()

  return (
    <div className={styles.homepage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>
                  Premium New Zealand 
                  <span className={styles.accent}> Wool Products</span>
                </h1>
                <p className={styles.heroSubtitle}>
                  Discover our handcrafted collection of luxurious wool throws, blankets, 
                  and home essentials. Made with 100% pure New Zealand wool for ultimate 
                  comfort and style.
                </p>
                <div className={styles.heroActions}>
                  <Link href="/products" className="btn btn-primary btn-lg me-3">
                    Shop Collection
                  </Link>
                  {!loading && (
                    <>
                      {!user && (
                        <Link href="/auth/signin" className="btn btn-outline-primary btn-lg">
                          Sign In
                        </Link>
                      )}
                      {user && (
                        <Link href="/customer" className="btn btn-outline-primary btn-lg">
                          My Account
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className={styles.heroImage}>
                <img 
                  src="https://www.inkandbrayer.co.nz/cdn/shop/collections/Weave-Home_designer-throw-blanket-nz_1200x953.webp?v=1744929383" 
                  alt="Premium wool throws and blankets" 
                  className="img-fluid rounded-3 shadow-lg"
                  onError={(e) => {
                    e.target.src = "https://www.inkandbrayer.co.nz/cdn/shop/collections/Weave-Home_designer-throw-blanket-nz_1200x953.webp?v=1744929383"
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className="container py-5">
          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🐑</div>
                <h3>100% Pure Wool</h3>
                <p>Sourced directly from New Zealand&apos;s finest sheep farms for guaranteed quality and authenticity.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>✋</div>
                <h3>Handcrafted</h3>
                <p>Each piece is carefully crafted by skilled artisans who take pride in every stitch and detail.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🌿</div>
                <h3>Sustainable</h3>
                <p>Environmentally conscious production methods that respect both nature and tradition.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.aboutSection}>
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className={styles.aboutImage}>
                <img 
                  src="https://images-ap-prod.cms.commerce.dynamics.com/cms/api/tstpxgfmq/imageFileData/search?fileName=/Products%2FICP0120_000_001.jpg&w=0&h=772&q=80&m=6&f=jpg&cropfocalregion=true" 
                   alt="Traditional wool crafting process"
                  className="img-fluid rounded-3 shadow-lg"
                  onError={(e) => {
                    e.target.src = "https://images-ap-prod.cms.commerce.dynamics.com/cms/api/tstpxgfmq/imageFileData/search?fileName=/Products%2FICP0120_000_001.jpg&w=0&h=772&q=80&m=6&f=jpg&cropfocalregion=true"
                  }}
                />
                <div className={styles.aboutImageOverlay}>
                  <span className={styles.aboutBadge}>Est. 2020</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className={styles.aboutContent}>
                <h2 className={styles.aboutTitle}>
                  Our Story of <span className={styles.accent}>Wool Excellence</span>
                </h2>
                <p className={styles.aboutText}>
                  For over four years, we&apos;ve been dedicated to bringing you the finest wool products 
                  from New Zealand&apos;s pristine landscapes. Our journey began with a simple mission: 
                  to share the unmatched comfort and quality of authentic New Zealand wool with families around the world.
                </p>
                <p className={styles.aboutText}>
                  Each product in our collection tells a story of tradition, craftsmanship, and sustainable practices. 
                  We work directly with local farmers and artisans who share our passion for quality, ensuring that 
                  every piece meets our exacting standards for softness, durability, and beauty.
                </p>
                <div className={styles.aboutStats}>
                  <div className={styles.aboutStat}>
                    <h4>1000+</h4>
                    <p>Happy Customers</p>
                  </div>
                  <div className={styles.aboutStat}>
                    <h4>50+</h4>
                    <p>Premium Products</p>
                  </div>
                  <div className={styles.aboutStat}>
                    <h4>100%</h4>
                    <p>Natural Wool</p>
                  </div>
                </div>
                <div className={styles.aboutActions}>
                  <Link href="/products" className="btn btn-primary btn-lg me-3">
                    Shop Our Collection
                  </Link>
                  <Link href="#collections" className="btn btn-outline-primary btn-lg">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Collection */}
      <section id="collections" className={styles.collectionsSection}>
        <div className="container py-5">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className={styles.sectionTitle}>Our Premium Collection</h2>
              <p className={styles.sectionSubtitle}>
                Discover handpicked wool products that bring warmth and elegance to your home
              </p>
            </div>
          </div>
          <Collections />
          <div className="row">
            <div className="col-12 text-center mt-4">
              <Link href="/products" className="btn btn-primary btn-lg">
                Browse All Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.cta}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className={`${styles.ctaCard} text-center text-white py-5`}>
                <h2>Experience the Comfort of Premium Wool</h2>
                <p className="lead mb-4">
                  Join thousands of satisfied customers who have made our wool products 
                  part of their daily comfort routine.
                </p>
                {!loading && (
                  <>
                    {!user ? (
                      <div>
                        <Link href="/auth/signup" className="btn btn-light btn-lg me-3">
                          Create Account
                        </Link>
                        <Link href="/auth/signin" className="btn btn-outline-light btn-lg">
                          Sign In
                        </Link>
                      </div>
                    ) : (
                      <Link href="#collections" className="btn btn-light btn-lg">
                        Continue Shopping
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className={styles.footerInfo}>
        <div className="container py-4">
          <div className="row text-center">
            <div className="col-md-3 mb-3">
              <h5>Free Shipping</h5>
              <p className="small text-muted">On orders over $200</p>
            </div>
            <div className="col-md-3 mb-3">
              <h5>Quality Guarantee</h5>
              <p className="small text-muted">30-day return policy</p>
            </div>
            <div className="col-md-3 mb-3">
              <h5>Secure Payment</h5>
              <p className="small text-muted">Safe & encrypted checkout</p>
            </div>
            <div className="col-md-3 mb-3">
              <h5>Expert Support</h5>
              <p className="small text-muted">Dedicated customer service</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}