
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const PRESET_GAMES = [
  { name: "Candy Crush Saga", icon_url: "https://play-lh.googleusercontent.com/89f9upF4qeic1ROzXu0-Ax9pcCB2vwYNYfFzqrE74-Oaeb9_1isDyVqeW7E8Fv90KA=w480-h960-rw" },
  { name: "Clash Royale", icon_url: "https://play-lh.googleusercontent.com/gnSC6s8-6Tjc4uhvDW7nfrSJxpbhllzYhgX8y374N1LYvWBStn2YhozS9XXaz1T_Pi2q=w480-h960-rw" },
  { name: "Diablo Immortal", icon_url: "https://play-lh.googleusercontent.com/9DvmwGV53li3CTxN8S1Koz-tNd_zepJJqWmkAGQrfRvEuTXn_s-5b5usnWGWqe2JuAQ9AvZzIrisTvYvL0bpo4k=w480-h960-rw" },
  { name: "Dragon City: Mobile Adventure", icon_url: "https://play-lh.googleusercontent.com/GTd1rUAswLuzMP1i4DlWX5z88McGJEklF-Dap0eCPleKO77rrdrKeJVEWnwQe18sGxyw1NKHQnLUcc4ba1W7uC8=w480-h960-rw" },
  { name: "Dragons: Rise of Berk", icon_url: "https://play-lh.googleusercontent.com/5kxF8Mkd_151LbbREO3zolW7b6q5XBNKicjLdRP4VTwX69GVqF5K-cm0YJjRJQz1ZNzN-g3HaHoplUNXwiku=w480-h960-rw" },
  { name: "Galaxy Legion", icon_url: "https://galaxylegion1-1faae.kxcdn.com/images/logos/mainlogo2-128.png" },
  { name: "Godzilla Defense Force", icon_url: "https://play-lh.googleusercontent.com/hmF3QxPS_yJLiI4-BePz47dxEHCbMRKt41HodNK__Ey3cpSskYn42H7TKAC3NruGNg=w480-h960-rw" },
  { name: "Jurassic World Alive", icon_url: "https://play-lh.googleusercontent.com/Vc2N7C5VxwdCe7tbnloLzoCqugjqUFwMhFmOmVzlWJpRu5nJFa3Q0eLg2cpTbvZ0Xg=w480-h960-rw" },
  { name: "Jurassic World: The Game", icon_url: "https://play-lh.googleusercontent.com/7q9T0W5_qIu_qykhYm0CloMD_6ZWhKqFhCas3P-8XKQyHLqMQ2KyrRtzmMsSLg6FNdI=s96-rw" },
  { name: "Kingshot", icon_url: "https://play-lh.googleusercontent.com/DLovyLDLznCbkDw39T-d9BUXkDbUjO9ne3_eJyA27IcfgIXR2Hmu3HqEDlYxGXnwrp0=w480-h960-rw" },
  { name: "MapleStory: Idle RPG", icon_url: "https://play-lh.googleusercontent.com/jV9Qr5SJcdTxjSNM83_T0voYwyFWnErzyM9HsQLopigYZM4unH-_2HRTVLSmJv17OrSW=w480-h960-rw" },
  { name: "Minecraft: Dream it, Build it!", icon_url: "https://play-lh.googleusercontent.com/27O5tpaYE82W6m30rJ_MX3-UvshlDM6O8oXDxb6GseYW2T7P8UNT19727MGmz-0q3w=w480-h960-rw" },
  { name: "Raid: Shadow Legends", icon_url: "https://play-lh.googleusercontent.com/jpZN9QMGMvMLCFSQpOczjKBJCX_kBkRPA1JBeV1dQZUbPdcjM823JUZvjAWyKIBmy0-f_rkbjCYINGiVKiblDQ=w480-h960-rw" },
  { name: "Roblox", icon_url: "https://play-lh.googleusercontent.com/7cIIPlWm4m7AGqVpEsIfyL-HW4cQla4ucXnfalMft1TMIYQIlf2vqgmthlZgbNAQoaQ=w480-h960-rw" },
  { name: "Subway Surfers", icon_url: "https://play-lh.googleusercontent.com/ScN4CEEgrYh-Bs-HYOIwBmw6zNpQs1ujW_ywRVHALWQaO2P5RuxKNXWzwRz7H9Wz3NTOTj7AIreVEDKrDz4E=w480-h960-rw" },
  { name: "Township", icon_url: "https://play-lh.googleusercontent.com/87ZWG0h0ohRprr_B-ikfu66EgiL__wNWROk9yW5xl918h0RSzfAjRC4OnIaXhTux_mRW=w480-h960-rw" },
  { name: "Whiteout Survival", icon_url: "https://play-lh.googleusercontent.com/gtcDOls1xCaV_qtRKx3dsk75bNBqel81gWkhK2xvgq5KKHj_71lnZjXYO6He97w0j-U=w480-h960-rw" },
  { name: "World of Warcraft", icon_url: "https://blz-contentstack-images.akamaized.net/v3/assets/blt3452e3b114fab0cd/blte82ef8135378a09b/5d4883cabf384b03afd01553/Logo-wow.png" }
];

export default function GameSelection() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customIconUrl, setCustomIconUrl] = useState("");

  const { data: settings } = useQuery({
    queryKey: ['appSettings'],
    queryFn: async () => {
      const allSettings = await base44.entities.AppSettings.list();
      return allSettings[0];
    },
  });

  const { data: games = [] } = useQuery({
    queryKey: ['games'],
    queryFn: () => base44.entities.Game.list(),
    initialData: [],
  });

  const createGameMutation = useMutation({
    mutationFn: (gameData) => base44.entities.Game.create(gameData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      navigate(createPageUrl("Games"));
    },
  });

  const isPremium = settings?.is_premium || false;
  const canAddMore = isPremium || games.length < 1;

  const filteredGames = PRESET_GAMES.filter(game =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectGame = (game) => {
    if (!canAddMore) return;
    createGameMutation.mutate({
      name: game.name,
      icon_url: game.icon_url,
      is_custom: false
    });
  };

  const handleCreateCustom = () => {
    if (!customName.trim() || !customIconUrl.trim()) return;
    createGameMutation.mutate({
      name: customName,
      icon_url: customIconUrl,
      is_custom: true
    });
    setShowCustomDialog(false);
    setCustomName("");
    setCustomIconUrl("");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pb-6">
      <div className="sticky top-0 z-10 bg-[var(--background)] border-b border-[var(--border)]">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(createPageUrl("Games"))}
              className="w-10 h-10 rounded-xl hover:bg-[var(--surface)]"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-light tracking-tight">Select Game</h1>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
            <Input
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[var(--surface)] border-[var(--border)] rounded-xl h-12"
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {!canAddMore && (
          <div className="mb-6 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
            <p className="text-sm text-[var(--text-secondary)]">
              Upgrade to premium to add unlimited games
            </p>
          </div>
        )}

        <div className="mb-6">
          <Button
            onClick={() => setShowCustomDialog(true)}
            disabled={!canAddMore}
            className="w-full bg-[var(--surface)] hover:bg-[var(--surface-elevated)] text-[var(--text)] border border-[var(--border)] rounded-xl h-14"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Custom Game
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredGames.map((game) => (
            <button
              key={game.name}
              onClick={() => handleSelectGame(game)}
              disabled={!canAddMore}
              className="bg-[var(--surface)] rounded-2xl p-4 hover:bg-[var(--surface-elevated)] transition-all duration-200 border border-[var(--border)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="aspect-square rounded-xl bg-[var(--surface-elevated)] mb-3 overflow-hidden flex items-center justify-center p-2">
                <img
                  src={game.icon_url}
                  alt={game.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-medium text-sm truncate">{game.name}</h3>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
        <DialogContent className="bg-[#1A1A1A] border-[#333333]">
          <DialogHeader>
            <DialogTitle className="text-white">Add Custom Game</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-white">Game Name</Label>
              <Input
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Enter game name"
                className="mt-2 bg-[#0A0A0A] border-[#333333] text-white"
              />
            </div>
            <div>
              <Label className="text-white">Icon URL</Label>
              <Input
                value={customIconUrl}
                onChange={(e) => setCustomIconUrl(e.target.value)}
                placeholder="https://..."
                className="mt-2 bg-[#0A0A0A] border-[#333333] text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCustomDialog(false)}
              className="border-[#333333] text-white hover:bg-[#0A0A0A]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCustom}
              disabled={!customName.trim() || !customIconUrl.trim()}
              className="bg-[var(--primary-blue)] hover:bg-[var(--blue-hover)] text-white"
            >
              Add Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
