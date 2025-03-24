import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD0dOoNhR7d8xsB74JjqGpJyRuIJpIx0tA",
  authDomain: "gothamhearts-a18bb.firebaseapp.com",
  projectId: "gothamhearts-a18bb",
  storageBucket: "gothamhearts-a18bb.firebasestorage.app",
  messagingSenderId: "797556309235",
  appId: "1:797556309235:web:206cb0102c50b2ff1c0b86",
  measurementId: "G-50MH8Q73N9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("signup");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error("User rejected the request");
      }
    } else {
      alert("MetaMask is not installed.");
    }
  };

  const handlePayPalPayment = () => {
    window.open("https://www.paypal.com/paypalme/yourusername/19.99", "_blank");
  };

  const handleCryptoPayment = () => {
    const address = "0x6bC332a05c45D630026F0112B630Eb6A8451759C";
    const amountEth = 0.01;
    const url = `https://metamask.app.link/send/pay-${address}?value=${amountEth}`;
    window.open(url, "_blank");
  };

  const handleAuth = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (mode === "signup") {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => setUser(userCredential.user))
        .catch((error) => alert(error.message));
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => setUser(userCredential.user))
        .catch((error) => alert(error.message));
    }
  };

  const handleLogout = () => signOut(auth).then(() => setUser(null));

  if (user) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "black", color: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#ec4899" }}>Welcome, {user.email}!</h1>
        <p style={{ marginTop: "1rem", color: "#ccc" }}>Your profile is ready.</p>
        <button onClick={handleLogout} style={{ marginTop: "2rem", backgroundColor: "#9333ea", padding: "0.75rem 1.5rem", borderRadius: "1rem", border: "none", color: "white", fontSize: "1rem", cursor: "pointer" }}>Log Out</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundImage: "url('https://images.unsplash.com/photo-1495195134817-aeb325a55b65?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')", backgroundSize: "cover", backgroundPosition: "center", color: "white", padding: "2rem", textAlign: "center" }}>
      <header style={{ marginBottom: "2rem" }}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Heart_corazon.svg/2048px-Heart_corazon.svg.png" alt="Logo" style={{ width: "120px", height: "120px", marginBottom: "1rem" }} />
        <h1 style={{ fontSize: "2rem", color: "#ec4899" }}>Gotham Hearts</h1>
        <p style={{ maxWidth: "600px", margin: "1rem auto", color: "#f3f3f3" }}>
          Where New York falls in love – one rooftop at a time.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
          <button onClick={handlePayPalPayment} style={{ backgroundColor: "#ec4899" }}>PayPal – $19.99 / ₿0.0003</button>
          <button onClick={handleCryptoPayment} style={{ backgroundColor: "#10b981" }}>Crypto (ETH ≈ 0.01 / ₿0.0003)</button>
          <button onClick={connectWallet} style={{ backgroundColor: "#9333ea" }}>
            {walletAddress ? `Wallet: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect Wallet"}
          </button>
        </div>
      </header>

      <section style={{ maxWidth: "900px", margin: "2rem auto" }}>
        <h2>{mode === "signup" ? "Create Your Account" : "Log In"}</h2>
        <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "1rem", backgroundColor: "rgba(31, 41, 55, 0.85)", padding: "2rem", borderRadius: "1rem" }}>
          <input type="email" name="email" placeholder="Email Address" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit" style={{ backgroundColor: "#ec4899" }}>
            {mode === "signup" ? "Sign Up" : "Log In"}
          </button>
        </form>
        <p style={{ marginTop: "1rem" }}>
          {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
          <span onClick={() => setMode(mode === "signup" ? "login" : "signup")} style={{ textDecoration: "underline", cursor: "pointer", color: "#93c5fd" }}>
            {mode === "signup" ? "Log In" : "Sign Up"}
          </span>
        </p>
      </section>
    </div>
  );
}
