"use client";

import type { ConversionConfig, ExtractedEvent } from "@/types";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { TIMEZONES, WASTE_TYPES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

interface ConversionConfigProps {
  config: ConversionConfig;
  onConfigChange: (config: ConversionConfig) => void;
  extractedEvents: ExtractedEvent[];
}

export function ConversionConfig({ config, onConfigChange, extractedEvents }: ConversionConfigProps) {
  const uniqueWasteTypes = Array.from(new Set(extractedEvents.map(e => e.type)));
  
  return (
    <div className="space-y-6">
      {/* Timezone */}
      <div className="space-y-2">
        <Label htmlFor="timezone">Fuseau horaire</Label>
        <Select
          value={config.timezone}
          onValueChange={(value) => onConfigChange({ ...config, timezone: value })}
        >
          <SelectTrigger id="timezone">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIMEZONES.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Types de déchets détectés */}
      <div className="space-y-2">
        <Label>Types de déchets détectés</Label>
        <div className="flex flex-wrap gap-2">
          {uniqueWasteTypes.map((type) => (
            <Badge
              key={type}
              style={{ backgroundColor: config.colors[type] + '20', color: config.colors[type] }}
            >
              {WASTE_TYPES[type].icon} {WASTE_TYPES[type].label}
            </Badge>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          {extractedEvents.length} événements trouvés au total
        </p>
      </div>

      {/* Rappel la veille */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="evening-reminder">Rappel la veille au soir</Label>
            <p className="text-sm text-gray-500">
              Recevez une notification pour sortir vos poubelles
            </p>
          </div>
          <Switch
            id="evening-reminder"
            checked={config.reminders.evening}
            onCheckedChange={(checked) => 
              onConfigChange({
                ...config,
                reminders: { ...config.reminders, evening: checked }
              })
            }
          />
        </div>
        
        {config.reminders.evening && (
          <div className="ml-4 space-y-2">
            <Label htmlFor="evening-time">Heure du rappel</Label>
            <Input
              id="evening-time"
              type="time"
              value={config.reminders.eveningTime}
              onChange={(e) => 
                onConfigChange({
                  ...config,
                  reminders: { ...config.reminders, eveningTime: e.target.value }
                })
              }
            />
          </div>
        )}
      </div>

      {/* Rappel le matin */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="morning-reminder">Rappel le matin même</Label>
            <p className="text-sm text-gray-500">
              Un dernier rappel avant la collecte
            </p>
          </div>
          <Switch
            id="morning-reminder"
            checked={config.reminders.morning}
            onCheckedChange={(checked) => 
              onConfigChange({
                ...config,
                reminders: { ...config.reminders, morning: checked }
              })
            }
          />
        </div>
        
        {config.reminders.morning && (
          <div className="ml-4 space-y-2">
            <Label htmlFor="morning-time">Heure du rappel</Label>
            <Input
              id="morning-time"
              type="time"
              value={config.reminders.morningTime}
              onChange={(e) => 
                onConfigChange({
                  ...config,
                  reminders: { ...config.reminders, morningTime: e.target.value }
                })
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}