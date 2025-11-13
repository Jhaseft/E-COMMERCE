export default function Footer() {
  return (
    <footer className="bg-brandBlack text-center py-6 mt-10 border-t border-[#333]">
      <p className="text-brandGold">
        © {new Date().getFullYear()} Automatizando Todos los derechos reservados.
      </p>
    </footer>
  );
}
