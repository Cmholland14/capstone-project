"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useCart } from "@/contexts/CartContext"

export default function Navbar() {
    const { data: session } = useSession()
    const { getItemCount } = useCart()
    const cartItemCount = getItemCount()

    return (
        <nav className="navbar navbar-expand-lg navbar-custom">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center" href="/">
                    <span className="logo-text-only">
                        <span className="logo-main">Capstone</span>
                        <span className="logo-sub">Wool</span>
                    </span>
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" href="/">Home</Link>
                        </li>
                        
                        <li className="nav-item">
                            <Link className="nav-link" href="/products">Products</Link>
                        </li>

                        {session && (
                            <li className="nav-item">
                                <Link className="nav-link position-relative" href="/cart">
                                    <span>🛒 Cart</span>
                                    {cartItemCount > 0 && (
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            {cartItemCount}
                                            <span className="visually-hidden">items in cart</span>
                                        </span>
                                    )}
                                </Link>
                            </li>
                        )}

                        {session && session.user?.role === "admin" && (
                            <li className="nav-item">
                                <Link className="nav-link" href="/admin">Admin</Link>
                            </li>
                        )}

                        {session && (
                            <li className="nav-item">
                                <Link className="nav-link" href="/account">Account</Link>
                            </li>
                        )}

                        {!session ? (
                            <li className="nav-item">
                                <Link className="nav-link" href="/auth/signin">Login</Link>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <button
                                    className="btn btn-outline-light ms-2"
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                >
                                    Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}