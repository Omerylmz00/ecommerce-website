import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="pt-32 pb-16 px-4 min-h-screen bg-(--isabelline) flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-2xl font-bold text-(--jet) mb-2">Giriş Yap</h1>
        <p className="text-gray-500 mb-6">
          Hesabınıza erişmek için bilgilerinizi girin.
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="E-posta Adresi"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-(--raw-umber) outline-none"
          />
          <input
            type="password"
            placeholder="Şifre"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-(--raw-umber) outline-none"
          />
          <button className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-(--raw-umber) transition-colors">
            Giriş Yap
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          Hesabınız yok mu?{" "}
          <Link
            href="/register"
            className="text-(--raw-umber) font-semibold hover:underline"
          >
            Kayıt Ol
          </Link>
        </div>
      </div>
    </main>
  );
}
