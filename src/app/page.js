"use client"

import { useSession } from "next-auth/react"
import Link from 'next/link'
import Collections from "@/components/collections/ProductCollections"
import styles from './page.module.css'

export default function HomePage() {
  const { data: session } = useSession()

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
                  {!session && (
                    <Link href="/auth/signin" className="btn btn-outline-primary btn-lg">
                      Sign In
                    </Link>
                  )}
                  {session && (
                    <Link href="/customer" className="btn btn-outline-primary btn-lg">
                      My Account
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className={styles.heroImage}>
                <img 
                  src="/wool-hero.jpg" 
                  alt="Premium wool throws and blankets" 
                  className="img-fluid rounded-3 shadow-lg"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
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

      {/* Welcome Message for Logged-in Users */}
      {session && (
        <section className={styles.welcomeSection}>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className={`${styles.welcomeCard} card bg-light`}>
                  <div className="card-body text-center py-4">
                    <h3>Welcome back, {session.user?.name || 'Valued Customer'}!</h3>
                    <p className="mb-3">Ready to explore our latest wool collection?</p>
                    <div className={styles.userActions}>
                      <Link href="/customer/orders" className="btn btn-outline-primary me-3">
                        View My Orders
                      </Link>
                      <Link href="/customer" className="btn btn-primary">
                        My Account
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

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
                {!session ? (
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