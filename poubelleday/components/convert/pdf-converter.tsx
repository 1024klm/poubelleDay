"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  FileText, 
  Calendar, 
  Download, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  Settings,
  Eye
} from "lucide-react";
import { ConversionConfig } from "./conversion-config";
import { EventPreview } from "./event-preview";
import { ExtractedEvent, ConversionConfig as ConfigType } from "@/types";
import { DEFAULT_REMINDER_CONFIG, WASTE_TYPES } from "@/lib/constants";
import { toast } from "sonner";

export function PDFConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedEvents, setExtractedEvents] = useState<ExtractedEvent[]>([]);
  const [config, setConfig] = useState<ConfigType>({
    timezone: "Europe/Paris",
    reminders: DEFAULT_REMINDER_CONFIG,
    colors: Object.fromEntries(
      Object.entries(WASTE_TYPES).map(([key, value]) => [key, value.color])
    ) as Record<string, string>
  });
  const [icsUrl, setIcsUrl] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<"upload" | "config" | "preview" | "download">("upload");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFile = acceptedFiles[0];
    if (pdfFile && pdfFile.type === "application/pdf") {
      setFile(pdfFile);
      setCurrentStep("upload");
      setExtractedEvents([]);
      setIcsUrl(null);
    } else {
      toast.error("Veuillez sélectionner un fichier PDF valide");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"]
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleProcessPDF = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/conversion/parse", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'analyse du PDF");
      }

      const data = await response.json();
      setExtractedEvents(data.events);
      setCurrentStep("config");
      toast.success(`${data.events.length} événements détectés`);
    } catch (error) {
      console.error("Error processing PDF:", error);
      toast.error("Impossible d'analyser le PDF. Veuillez réessayer.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateICS = async () => {
    if (extractedEvents.length === 0) return;

    setIsProcessing(true);
    try {
      const response = await fetch("/api/conversion/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          events: extractedEvents,
          config
        })
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la génération du fichier ICS");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setIcsUrl(url);
      setCurrentStep("download");
      toast.success("Calendrier généré avec succès !");
    } catch (error) {
      console.error("Error generating ICS:", error);
      toast.error("Impossible de générer le calendrier. Veuillez réessayer.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (icsUrl) {
      const a = document.createElement("a");
      a.href = icsUrl;
      a.download = "calendrier-collecte-dechets.ics";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Téléchargement démarré !");
    }
  };

  const handleReset = () => {
    setFile(null);
    setExtractedEvents([]);
    setIcsUrl(null);
    setCurrentStep("upload");
    if (icsUrl) {
      window.URL.revokeObjectURL(icsUrl);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between max-w-2xl mx-auto mb-8">
        {[
          { step: "upload", label: "Upload PDF", icon: Upload },
          { step: "config", label: "Configuration", icon: Settings },
          { step: "preview", label: "Aperçu", icon: Eye },
          { step: "download", label: "Télécharger", icon: Download }
        ].map((item, index) => (
          <div key={item.step} className="flex items-center">
            <div className={`
              flex items-center justify-center w-10 h-10 rounded-full
              ${currentStep === item.step ? "bg-green-600 text-white" : 
                index < ["upload", "config", "preview", "download"].indexOf(currentStep) 
                  ? "bg-green-100 text-green-600" 
                  : "bg-gray-200 text-gray-400"}
            `}>
              <item.icon className="h-5 w-5" />
            </div>
            {index < 3 && (
              <div className={`w-20 h-1 mx-2 ${
                index < ["upload", "config", "preview", "download"].indexOf(currentStep)
                  ? "bg-green-600" 
                  : "bg-gray-200"
              }`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Upload Step */}
        {currentStep === "upload" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>1. Uploadez votre calendrier PDF</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`
                    border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
                    transition-colors duration-200
                    ${isDragActive ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-gray-400"}
                  `}
                >
                  <input {...getInputProps()} />
                  {file ? (
                    <div className="space-y-4">
                      <FileText className="h-12 w-12 text-green-600 mx-auto" />
                      <div>
                        <p className="font-semibold">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <div className="flex gap-4 justify-center">
                        <Button onClick={handleProcessPDF} disabled={isProcessing}>
                          {isProcessing ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Analyse en cours...
                            </>
                          ) : (
                            "Analyser le PDF"
                          )}
                        </Button>
                        <Button variant="outline" onClick={handleReset}>
                          Changer de fichier
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="font-semibold">
                          {isDragActive 
                            ? "Déposez le fichier ici" 
                            : "Glissez-déposez votre PDF ici"}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          ou cliquez pour parcourir (max 10 MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Configuration Step */}
        {currentStep === "config" && extractedEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>2. Configurez vos rappels</CardTitle>
              </CardHeader>
              <CardContent>
                <ConversionConfig 
                  config={config} 
                  onConfigChange={setConfig}
                  extractedEvents={extractedEvents}
                />
                <div className="flex gap-4 justify-end mt-6">
                  <Button variant="outline" onClick={handleReset}>
                    Recommencer
                  </Button>
                  <Button onClick={() => setCurrentStep("preview")}>
                    Voir l'aperçu
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Preview Step */}
        {currentStep === "preview" && extractedEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>3. Aperçu des événements</CardTitle>
              </CardHeader>
              <CardContent>
                <EventPreview 
                  events={extractedEvents}
                  onEventsChange={setExtractedEvents}
                />
                <div className="flex gap-4 justify-end mt-6">
                  <Button variant="outline" onClick={() => setCurrentStep("config")}>
                    Retour
                  </Button>
                  <Button onClick={handleGenerateICS} disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      "Générer le calendrier"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Download Step */}
        {currentStep === "download" && icsUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>4. Téléchargez votre calendrier</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-6">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Votre calendrier est prêt !
                    </h3>
                    <p className="text-gray-600">
                      Téléchargez le fichier .ics et importez-le dans votre calendrier préféré
                    </p>
                  </div>
                  
                  <div className="flex gap-4 justify-center">
                    <Button onClick={handleDownload} size="lg">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger le calendrier
                    </Button>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 text-left">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Comment importer dans votre calendrier ?
                    </h4>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li>
                        <strong>Google Calendar :</strong> Paramètres → Importer → Sélectionner le fichier
                      </li>
                      <li>
                        <strong>Apple Calendar :</strong> Fichier → Importer → Sélectionner le fichier
                      </li>
                      <li>
                        <strong>Outlook :</strong> Fichier → Ouvrir et exporter → Importer
                      </li>
                    </ul>
                  </div>

                  <Button variant="outline" onClick={handleReset}>
                    Convertir un autre calendrier
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}