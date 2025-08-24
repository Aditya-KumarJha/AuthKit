export default function Footer() {
    return (
      <footer className="py-10 text-center text-sm">
        <p>© {new Date().getFullYear()} AuthKit. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-4">
          <a href="/docs">Docs</a>
          <a href="https://github.com">GitHub</a>
          <a href="/contact">Contact</a>
        </div>
      </footer>
    );
}