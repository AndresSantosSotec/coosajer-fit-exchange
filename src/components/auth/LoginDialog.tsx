"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWebAuth } from "@/contexts/WebAuthContext";
import { Loader2 } from "lucide-react";
import axios from "axios";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onLoggedIn?: () => void;
};

export default function LoginDialog({ open, onOpenChange, onLoggedIn }: Props) {
  const { login, loading: authLoading } = useWebAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ✅ Declaración única
  const canSubmit = email.trim().length > 3 && password.trim().length > 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting || authLoading) return;
    setErr(null);
    setSubmitting(true);
    try {
      await login(email, password);
      onOpenChange(false);
      onLoggedIn?.();
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message || error.response?.data?.errors?.email?.[0]
        : undefined;
      setErr(msg || "No se pudo iniciar sesión");
    } finally {
      setSubmitting(false);
    }
  };

  const isBusy = submitting || authLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Iniciar sesión</DialogTitle>
          <DialogDescription>Accede con tu correo y contraseña para canjear premios.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {err && <p className="text-sm text-destructive">{err}</p>}

          <Button type="submit" className="w-full" disabled={!canSubmit || isBusy}>
            {isBusy ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Entrando...</> : "Entrar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
