"use client"

import { useState } from "react"
import { User, UserSettings } from "@/lib/types/user"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Crown, Eye, Bell, Palette } from "lucide-react"

interface ProfileSettingsProps {
  user: User
  onSaveSettings: (settings: UserSettings) => Promise<void>
}

export function ProfileSettings({ user, onSaveSettings }: ProfileSettingsProps) {
  const [settings, setSettings] = useState<UserSettings>(user.settings)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await onSaveSettings(settings)
    setIsSaving(false)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ustawienia Profilu</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="privacy">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="privacy">
              <Eye className="w-4 h-4 mr-2" />
              Prywatność
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Powiadomienia
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="w-4 h-4 mr-2" />
              Wygląd
            </TabsTrigger>
            {user.isDonator && (
              <TabsTrigger value="donator">
                <Crown className="w-4 h-4 mr-2" />
                Donator
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="privacy" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Widoczność Profilu</Label>
                <RadioGroup
                  value={settings.privacy.profileVisibility}
                  onValueChange={(value: UserSettings["privacy"]["profileVisibility"]) =>
                    setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, profileVisibility: value }
                    })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public">Publiczny</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="friends" id="friends" />
                    <Label htmlFor="friends">Tylko Znajomi</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private">Prywatny</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="watch-status">Pokaż Status Oglądania</Label>
                <Switch
                  id="watch-status"
                  checked={settings.privacy.showWatchStatus}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, showWatchStatus: checked }
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="online-status">Pokaż Status Online</Label>
                <Switch
                  id="online-status"
                  checked={settings.privacy.showOnlineStatus}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, showOnlineStatus: checked }
                    })
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="friendRequests">Zaproszenia do Znajomych</Label>
                <Switch
                  id="friendRequests"
                  checked={settings.notifications.friendRequests}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, friendRequests: checked }
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="messages">Wiadomości</Label>
                <Switch
                  id="messages"
                  checked={settings.notifications.messages}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, messages: checked }
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="activityUpdates">Aktualizacje Aktywności</Label>
                <Switch
                  id="activityUpdates"
                  checked={settings.notifications.activityUpdates}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, activityUpdates: checked }
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="animeUpdates">Aktualizacje Anime</Label>
                <Switch
                  id="animeUpdates"
                  checked={settings.notifications.animeUpdates}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, animeUpdates: checked }
                    })
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode">Tryb Ciemny</Label>
                <Switch
                  id="dark-mode"
                  checked={settings.theme.prefersDark}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      theme: { ...settings.theme, prefersDark: checked }
                    })
                  }
                />
              </div>

              <div>
                <Label>Kolor Akcentu</Label>
                <Input
                  type="color"
                  value={settings.theme.accentColor}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      theme: { ...settings.theme, accentColor: e.target.value }
                    })
                  }
                />
              </div>
            </div>
          </TabsContent>

          {user.isDonator && (
            <TabsContent value="donator" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Kolor Nicku</Label>
                  <Input
                    type="color"
                    value={user.customization.nicknameColor || "#000000"}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        customization: { ...user.customization, nicknameColor: e.target.value }
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Ramka Awatara</Label>
                  <div className="grid grid-cols-4 gap-4 mt-2">
                    {["border1.gif", "border2.gif", "border3.gif"].map((border) => (
                      <div
                        key={border}
                        className={`cursor-pointer rounded-lg p-2 border-2 ${
                          user.customization.avatarBorder === border
                            ? "border-primary"
                            : "border-transparent"
                        }`}
                        onClick={() =>
                          setSettings({
                            ...settings,
                            customization: { ...user.customization, avatarBorder: border }
                          })
                        }
                      >
                        <img src={`/borders/${border}`} alt={border} className="w-full" />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Animacja Awatara</Label>
                  <div className="grid grid-cols-4 gap-4 mt-2">
                    {[
                      ["none", "Brak"],
                      ["rotate", "Obrót"],
                      ["pulse", "Pulsowanie"],
                      ["sparkle", "Błyszczenie"]
                    ].map(([value, label]) => (
                      <Button
                        key={value}
                        variant={user.customization.avatarAnimation === value ? "default" : "outline"}
                        onClick={() =>
                          setSettings({
                            ...settings,
                            customization: { ...user.customization, avatarAnimation: value }
                          })
                        }
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Zapisywanie..." : "Zapisz Zmiany"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 