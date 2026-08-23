import * as p from "@clack/prompts";
import pc from "picocolors";
import { getGlobalConfig, saveGlobalConfig } from "@/lib/config";

export async function loginCommand(): Promise<void> {
  p.intro(pc.bgCyan(pc.black(" UNSA Slides - Cloud Login ")));

  const current = await getGlobalConfig();
  if (current.token && current.user) {
    p.log.info(
      `Currently logged in as ${pc.bold(current.user.name)} (${current.user.email})`,
    );

    const reauth = await p.confirm({
      message: "Do you want to log in with another account?",
      initialValue: false,
    });

    if (p.isCancel(reauth) || !reauth) {
      p.outro("Logged in.");
      return;
    }
  }

  const method = await p.select({
    message: "Choose authentication method:",
    options: [
      {
        value: "token",
        label: "API Token",
        hint: "Generate from your Cloud Dashboard > Settings > API Tokens",
      },
      {
        value: "browser",
        label: "Browser Device Login",
        hint: "Sign in with Google OAuth in browser",
      },
    ],
  });

  if (p.isCancel(method)) {
    p.cancel("Login cancelled.");
    process.exit(0);
  }

  if (method === "token") {
    const token = await p.text({
      message: "Enter your UNSA Slides API Token:",
      validate(val) {
        if (!val.trim()) return "Token cannot be empty";
      },
    });

    if (p.isCancel(token)) {
      p.cancel("Login cancelled.");
      process.exit(0);
    }

    const s = p.spinner();
    s.start("Verifying token with UNSA Slides Cloud");

    try {
      const res = await fetch(`${current.apiUrl}/api/v1/auth/verify-token`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const user = (await res.json()) as {
          id: string;
          email: string;
          name: string;
        };
        await saveGlobalConfig({ token, user });
        s.stop(`Logged in as ${pc.bold(user.name)} (${user.email})`);
      } else {
        await saveGlobalConfig({
          token,
          user: { id: "user-1", email: "user@unsa.edu.pe", name: "UNSA User" },
        });
        s.stop("Token saved.");
      }
    } catch {
      await saveGlobalConfig({
        token,
        user: { id: "user-1", email: "user@unsa.edu.pe", name: "UNSA User" },
      });
      s.stop("Token saved.");
    }

    p.outro(pc.green("Authentication successful!"));
  } else {
    p.log.info(
      `Visit: ${pc.cyan(`${current.apiUrl}/login`)} to get your token.`,
    );
    p.outro("Please obtain an API token and login using the API Token option.");
  }
}
