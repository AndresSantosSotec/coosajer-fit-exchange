"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins } from "lucide-react";
import { useWebAuth } from "@/contexts/WebAuthContext";

export default function ProfileCard() {
  const { user, collaborator } = useWebAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mi perfil</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={collaborator?.photo_url ?? ""} />
          <AvatarFallback>{(user?.name?.[0] ?? "U").toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{user?.name}</p>
          <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          <div className="mt-2 flex items-center gap-1">
            <Coins className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {collaborator?.fitcoin_account?.balance ?? 0} Fitcoins
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
