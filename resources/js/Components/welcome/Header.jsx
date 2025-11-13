import { Link } from '@inertiajs/react';

export default function Header({ auth }) {
  return (
    <header className="w-full bg-brandBlack text-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* LOGO A LA IZQUIERDA */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="https://res.cloudinary.com/dnbklbswg/image/upload/v1763039388/automatizando_logo-removebg-preview_eekag0.png"
            alt="Logo de la empresa"
            className="h-20 w-20 md:h-32 md:w-32 object-contain rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
          />
        </Link>

        {/* NAVEGACIÓN A LA DERECHA */}
        <nav className="flex gap-6 text-lg md:text-xl font-medium">
          {auth?.user ? (
            <Link
              href={route('dashboard')}
              className="relative hover:text-brandGold transition duration-300 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-brandGold after:transition-all after:duration-300 hover:after:w-full"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href={route('login')}
                className="relative hover:text-brandGold transition duration-300 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-brandGold after:transition-all after:duration-300 hover:after:w-full"
              >
                Iniciar sesión
              </Link>
              <Link
                href={route('register')}
                className="relative hover:text-brandGold transition duration-300 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-brandGold after:transition-all after:duration-300 hover:after:w-full"
              >
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
