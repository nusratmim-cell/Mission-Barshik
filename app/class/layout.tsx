import { PartnerLogos } from "@/components/partner-logos"

export default function ClassLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-shikho-cta-light flex flex-col items-center justify-center p-4 font-sans overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-shikho-primary rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-shikho-cta rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="w-full max-w-md space-y-8 z-10 relative">
        <PartnerLogos />
        {children}
      </div>
      
      <footer className="mt-12 text-center text-sm text-shikho-muted z-10 font-hind">
        <p>© {new Date().getFullYear()} Shikho Technologies Bangladesh Ltd.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="https://shikho.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-shikho-primary transition-colors">
            প্রাইভেসি পলিসি
          </a>
          <span>•</span>
          <a href="https://shikho.com/terms-of-service" target="_blank" rel="noopener noreferrer" className="hover:text-shikho-primary transition-colors">
            শর্তাবলী
          </a>
        </div>
      </footer>
    </main>
  )
}