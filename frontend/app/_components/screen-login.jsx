"use client";

import { useState } from "react";

export function LoginScreen({ onLogin }) {
  const [submitting, setSubmitting] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    setTimeout(onLogin, 500);
  };

  return (
    <section className="login-screen">
      <div className="login-watermark" aria-hidden="true">A</div>
      <div className="brand-mark">A</div>
      <p className="eyebrow">AIssistant</p>
      <h1>
        Tüm hesaplarınız,
        <br />
        <span>tek bir yerde.</span>
      </h1>
      <p className="login-copy">Bankalarınızı bağlayın, finansal durumunuzu tek mobil panoda izleyin.</p>
      <form className="login-form" onSubmit={submit}>
        <label>
          <span>E-posta</span>
          <input defaultValue="demo@aissistant.app" type="email" />
        </label>
        <label>
          <span>Şifre</span>
          <input defaultValue="demo1234" type="password" />
        </label>
        <button className="primary-button" type="submit">
          {submitting ? <span className="spinner" /> : "Giriş Yap"}
        </button>
      </form>
    </section>
  );
}
