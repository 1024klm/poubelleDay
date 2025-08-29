import { PDFConverter } from "@/components/convert/pdf-converter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function ConvertPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Convertissez votre calendrier de collecte
          </h1>
          <PDFConverter />
        </div>
      </main>
      <Footer />
    </div>
  );
}