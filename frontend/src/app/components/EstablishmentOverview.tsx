import { useContext } from "react";
import { Building2, BadgeInfo } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AuthContext } from "../contexts/AuthContext";

export function EstablishmentOverview() {
  const { user } = useContext(AuthContext);

  const establishmentName = user?.estabelecimentoNome || "Estabelecimento não identificado";
  const establishmentId = user?.estabelecimentoId || "---";

  return (
    <Card className="rounded-2xl border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-accent" />
          {establishmentName}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-muted/40 p-4">
          <p className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <BadgeInfo className="h-4 w-4" />
            Perfil logado
          </p>
          <p className="font-semibold text-foreground">{user?.role || "Usuário"}</p>
        </div>
        <div className="rounded-xl border border-border bg-muted/40 p-4">
          <p className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            Origem dos dados
          </p>
          <p className="font-semibold text-foreground">Banco de dados do backend</p>
        </div>
      </CardContent>
    </Card>
  );
}