"use client";

import { useState } from "react";
import { ExtractedEvent } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Trash2, Edit2, Check, X, Plus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { WASTE_TYPES } from "@/lib/constants";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventPreviewProps {
  events: ExtractedEvent[];
  onEventsChange: (events: ExtractedEvent[]) => void;
}

export function EventPreview({ events, onEventsChange }: EventPreviewProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedEvent, setEditedEvent] = useState<ExtractedEvent | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<ExtractedEvent>>({
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'ordures_menageres',
    time: '06:00'
  });

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditedEvent({ ...events[index] });
  };

  const handleSave = () => {
    if (editingIndex !== null && editedEvent) {
      const updatedEvents = [...events];
      updatedEvents[editingIndex] = editedEvent;
      onEventsChange(updatedEvents);
      setEditingIndex(null);
      setEditedEvent(null);
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditedEvent(null);
  };

  const handleDelete = (index: number) => {
    const updatedEvents = events.filter((_, i) => i !== index);
    onEventsChange(updatedEvents);
  };

  const handleAddEvent = () => {
    if (newEvent.date && newEvent.type) {
      const wasteInfo = WASTE_TYPES[newEvent.type as keyof typeof WASTE_TYPES];
      const completeEvent: ExtractedEvent = {
        date: newEvent.date,
        type: newEvent.type as any,
        label: wasteInfo.label,
        color: wasteInfo.color,
        time: newEvent.time || '06:00'
      };
      
      const updatedEvents = [...events, completeEvent];
      updatedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      onEventsChange(updatedEvents);
      
      setIsAddingEvent(false);
      setNewEvent({
        date: format(new Date(), 'yyyy-MM-dd'),
        type: 'ordures_menageres',
        time: '06:00'
      });
    }
  };

  // Group events by month
  const eventsByMonth = events.reduce((acc, event) => {
    const month = format(new Date(event.date), 'MMMM yyyy', { locale: fr });
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(event);
    return acc;
  }, {} as Record<string, ExtractedEvent[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {events.length} événements détectés
        </p>
        
        <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un événement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un événement</DialogTitle>
              <DialogDescription>
                Ajoutez manuellement un jour de collecte
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-date">Date</Label>
                <Input
                  id="new-date"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="new-type">Type de déchet</Label>
                <Select
                  value={newEvent.type}
                  onValueChange={(value) => setNewEvent({ ...newEvent, type: value as any })}
                >
                  <SelectTrigger id="new-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(WASTE_TYPES).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value.icon} {value.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="new-time">Heure de collecte</Label>
                <Input
                  id="new-time"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsAddingEvent(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddEvent}>
                  Ajouter
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6 max-h-96 overflow-y-auto">
        {Object.entries(eventsByMonth).map(([month, monthEvents]) => (
          <div key={month}>
            <h3 className="font-semibold text-gray-900 mb-3 sticky top-0 bg-white py-2">
              {month.charAt(0).toUpperCase() + month.slice(1)}
            </h3>
            <div className="space-y-2">
              {monthEvents.map((event, globalIndex) => {
                const actualIndex = events.indexOf(event);
                const isEditing = editingIndex === actualIndex;
                
                return (
                  <Card key={actualIndex} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      {isEditing && editedEvent ? (
                        <div className="flex items-center gap-4">
                          <Input
                            type="date"
                            value={editedEvent.date}
                            onChange={(e) => 
                              setEditedEvent({ ...editedEvent, date: e.target.value })
                            }
                            className="flex-1"
                          />
                          <Select
                            value={editedEvent.type}
                            onValueChange={(value) => {
                              const wasteInfo = WASTE_TYPES[value as keyof typeof WASTE_TYPES];
                              setEditedEvent({ 
                                ...editedEvent, 
                                type: value as any,
                                label: wasteInfo.label,
                                color: wasteInfo.color
                              });
                            }}
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(WASTE_TYPES).map(([key, value]) => (
                                <SelectItem key={key} value={key}>
                                  {value.icon} {value.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button size="sm" variant="ghost" onClick={handleSave}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={handleCancel}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">
                              {format(new Date(event.date), 'EEEE d', { locale: fr })}
                            </span>
                            <Badge
                              style={{ 
                                backgroundColor: event.color + '20', 
                                color: event.color 
                              }}
                            >
                              {WASTE_TYPES[event.type]?.icon} {event.label}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(actualIndex)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(actualIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}