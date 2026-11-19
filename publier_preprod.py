"""Envoie une version du site vitrine sur la pré-prod OVH (colokeo.com/preprod/).

    python publier_preprod.py                      le dossier du site, tel qu'il est
    python publier_preprod.py --branche NOM        une branche (ou un commit) du site
    python publier_preprod.py --dossier CHEMIN     un autre dossier (copie de travail)
    python publier_preprod.py --zip CHEMIN         un zip (le dossier qui contient index.html)
    python publier_preprod.py --essai              montre ce qui partirait, sans rien envoyer
    python publier_preprod.py --changer-mot-de-passe   nouveau mot de passe de la pré-prod

Le mot de passe FTP d'OVH est demandé à chaque envoi et n'est écrit nulle part.
Le vrai site (colokeo.fr, GitHub Pages) n'est jamais touché.
Bibliothèque standard de Python seulement.
"""

from __future__ import annotations

import argparse
import base64
import datetime as dt
import getpass
import hashlib
import http.client
import io
import json
import re
import secrets
import socket
import subprocess
import sys
import tarfile
import urllib.parse
import zipfile
from pathlib import Path

ICI = Path(__file__).resolve().parent
CONFIG = ICI / "preprod.json"
MANIFESTE = ".envoi-preprod.json"  # dans le dossier de la pré-prod (interdit en lecture web)
FICHIER_MDP = ".htpasswd-preprod"  # à la racine du compte FTP, hors du dossier web
MARQUE = "# Colokeo - fichier gere par publier_preprod.py"
EXCLUS = {"CNAME"}  # propre à GitHub Pages
# Site statique seulement : rien qui s'exécute chez OVH (.php, .py, .htaccess...).
STATIQUES = {
    ".html", ".htm", ".css", ".js", ".mjs", ".json", ".xml", ".txt", ".svg", ".png", ".jpg",
    ".jpeg", ".webp", ".avif", ".gif", ".ico", ".woff", ".woff2", ".ttf", ".otf", ".pdf",
    ".mp4", ".webm", ".webmanifest", ".map",
}


# ---------------------------------------------------------------- fichiers du site

def _a_publier(nom: str) -> bool:
    parties = nom.split("/")
    if any(p.startswith(".") for p in parties):  # .git, .nojekyll, .gitignore...
        return False
    if nom in EXCLUS or nom.lower().endswith(".md"):  # notes de travail
        return False
    return True


def fichiers_du_dossier(dossier: Path) -> dict[str, bytes]:
    """Fichiers suivis par git et nouveaux fichiers non ignorés, lus sur le disque."""
    sortie = subprocess.run(
        ["git", "-C", str(dossier), "ls-files", "-z", "--cached", "--others", "--exclude-standard"],
        capture_output=True, check=True,
    ).stdout.decode("utf-8")
    res = {}
    for nom in filter(None, sortie.split("\0")):
        chemin = dossier / nom
        if chemin.is_file() and _a_publier(nom):
            res[nom] = chemin.read_bytes()
    return res


def fichiers_de_la_branche(dossier: Path, ref: str) -> dict[str, bytes]:
    subprocess.run(["git", "-C", str(dossier), "fetch", "-q", "origin"], check=False)
    for essai in (ref, f"origin/{ref}"):
        p = subprocess.run(["git", "-C", str(dossier), "archive", "--format=tar", essai],
                           capture_output=True)
        if p.returncode == 0:
            break
    else:
        sys.exit(f"Branche ou commit introuvable : {ref}")
    res = {}
    with tarfile.open(fileobj=io.BytesIO(p.stdout)) as tar:
        for m in tar.getmembers():
            if m.isfile() and _a_publier(m.name):
                res[m.name] = tar.extractfile(m).read()
    return res


def fichiers_du_zip(chemin: Path) -> dict[str, bytes]:
    """Le dossier du zip qui contient index.html (le moins profond)."""
    with zipfile.ZipFile(chemin) as z:
        noms = [i.filename for i in z.infolist() if not i.is_dir()]
        index = sorted((n for n in noms if n == "index.html" or n.endswith("/index.html")),
                       key=lambda n: n.count("/"))
        if not index:
            sys.exit(f"Pas de index.html dans {chemin}")
        prefixe = index[0][: -len("index.html")]
        return {n[len(prefixe):]: z.read(n) for n in noms
                if n.startswith(prefixe) and _a_publier(n[len(prefixe):])}


def adapter_au_sous_dossier(fichiers: dict[str, bytes], sous: str) -> int:
    """Les liens qui partent de la racine (/assets/...) pointent vers /preprod/assets/..."""
    motif = re.compile(rb"""((?:href|src|action)\s*=\s*["'])/(?!/)""")
    changes = 0
    for nom, contenu in fichiers.items():
        if nom.endswith((".html", ".htm")):
            nouveau, n = motif.subn(rb"\1/" + sous.encode("ascii") + rb"/", contenu)
            fichiers[nom], changes = nouveau, changes + n
    return changes


def empreinte(contenu: bytes) -> str:
    return hashlib.sha256(contenu).hexdigest()


# ---------------------------------------------------------------- mot de passe Apache

_ITOA64 = "./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"


def apr1(mot_de_passe: str, sel: str) -> str:
    """Empreinte « $apr1$ » d'Apache (htpasswd -m)."""
    pw, s, magie = mot_de_passe.encode("utf-8"), sel.encode("ascii"), b"$apr1$"
    final = hashlib.md5(pw + s + pw).digest()
    ctx = pw + magie + s
    for i in range(len(pw), 0, -16):
        ctx += final[: min(16, i)]
    i = len(pw)
    while i:
        ctx += b"\x00" if i & 1 else pw[:1]
        i >>= 1
    final = hashlib.md5(ctx).digest()
    for i in range(1000):
        c = pw if i & 1 else final
        if i % 3:
            c += s
        if i % 7:
            c += pw
        c += final if i & 1 else pw
        final = hashlib.md5(c).digest()

    def b64(v: int, n: int) -> str:
        out = ""
        for _ in range(n):
            out += _ITOA64[v & 0x3F]
            v >>= 6
        return out

    f = final
    code = "".join([
        b64((f[0] << 16) | (f[6] << 8) | f[12], 4),
        b64((f[1] << 16) | (f[7] << 8) | f[13], 4),
        b64((f[2] << 16) | (f[8] << 8) | f[14], 4),
        b64((f[3] << 16) | (f[9] << 8) | f[15], 4),
        b64((f[4] << 16) | (f[10] << 8) | f[5], 4),
        b64(f[11], 2),
    ])
    return f"$apr1${sel}${code}"


def nouvel_utilisateur() -> tuple[str, str]:
    print("\nIdentifiants de la pré-prod (ceux que tu taperas dans le navigateur).")
    while True:
        nom = input("  Nom d'utilisateur (Entrée = colokeo) : ").strip() or "colokeo"
        if input(f"  Le nom sera « {nom} ». C'est bon ? (Entrée = oui, n = non) : ").strip().lower() != "n":
            break
    while True:
        mdp = getpass.getpass("  Mot de passe (8 caractères au moins, rien ne s'affiche) : ")
        if len(mdp) < 8:
            print("  Trop court.")
            continue
        if getpass.getpass("  Encore une fois : ") != mdp:
            print("  Les deux ne sont pas pareils.")
            continue
        return nom, mdp


# ---------------------------------------------------------------- fichiers Apache

def htaccess_racine(cfg: dict) -> str:
    sous = cfg["sous_dossier"]
    return "\n".join([
        MARQUE,
        "# colokeo.com renvoie vers le vrai site, sauf la pre-prod et les fichiers",
        "# dont OVH a besoin pour renouveler le certificat HTTPS.",
        "RewriteEngine On",
        f"RewriteCond %{{REQUEST_URI}} !^/{sous}(/|$)",
        "RewriteCond %{REQUEST_URI} !^/\\.well-known/",
        f"RewriteRule ^(.*)$ {cfg['site_public']}/$1 [R=302,L]",
        "",
    ])


def htaccess_preprod(cfg: dict) -> str:
    return "\n".join([
        MARQUE,
        "# Pre-prod de la vitrine : mot de passe, HTTPS seulement, jamais indexee.",
        "AuthType Basic",
        'AuthName "Colokeo - pre-prod"',
        f'AuthUserFile "{cfg["chemin_absolu"]}/{FICHIER_MDP}"',
        "<RequireAll>",
        f"    Require expr \"%{{SERVER_PORT}} == '{cfg['port_https']}'\"",
        "    Require valid-user",
        "</RequireAll>",
        f"ErrorDocument 403 {cfg['adresse']}",
        f"ErrorDocument 404 /{cfg['sous_dossier']}/404.html",
        "<IfModule mod_headers.c>",
        '    Header always set X-Robots-Tag "noindex, nofollow"',
        '    Header always set Strict-Transport-Security "max-age=31536000"',
        "</IfModule>",
        '<FilesMatch "^\\.">',
        "    Require all denied",
        "</FilesMatch>",
        "",
    ])


# ---------------------------------------------------------------- SFTP (chiffré)

class Distant:
    """Compte OVH par SFTP. Les chemins sont relatifs au dossier du compte (/home/<identifiant>)."""

    def __init__(self, cfg: dict):
        try:
            import paramiko
        except ImportError:
            sys.exit("Il manque paramiko : python -m pip install paramiko")
        self.cfg = cfg
        attendues = set(cfg["empreintes_serveur"])

        class Verifier(paramiko.MissingHostKeyPolicy):
            def missing_host_key(self, client, hostname, key):
                vue = "SHA256:" + base64.b64encode(hashlib.sha256(key.asbytes()).digest()).decode().rstrip("=")
                if vue not in attendues:
                    raise SystemExit(f"Le serveur {hostname} ne présente pas la clé attendue ({vue})."
                                     " Arrêt sans rien envoyer.")

        # OVH bloque l'adresse après quelques refus : on vérifie qu'il répond avant de demander
        # le mot de passe, et un seul essai par lancement.
        try:
            socket.create_connection((cfg["serveur"], 22), timeout=10).close()
        except OSError:
            sys.exit("OVH ne répond pas sur le port SFTP. Après plusieurs mots de passe refusés,"
                     " OVH bloque ton adresse internet pendant un moment : réessaie plus tard, ou"
                     " depuis une autre connexion (partage de connexion du téléphone)."
                     " Rien n'a été modifié.")
        mdp = getpass.getpass(f"Mot de passe FTP OVH de {cfg['identifiant']} (rien ne s'affiche) : ")
        self.client = paramiko.SSHClient()
        self.client.set_missing_host_key_policy(Verifier())
        try:
            self.client.connect(cfg["serveur"], port=22, username=cfg["identifiant"], password=mdp,
                                look_for_keys=False, allow_agent=False, timeout=30)
        except paramiko.AuthenticationException:
            sys.exit("OVH refuse ce mot de passe. Rien n'a été modifié. Il se change dans l'espace"
                     " client OVH : Hébergements > colokeo.com > onglet FTP - SSH > crayon. Un nouveau"
                     " mot de passe met quelques minutes à marcher. Attention : après 2 ou 3 refus,"
                     " OVH bloque ton adresse pendant un moment.")
        except OSError as e:
            sys.exit(f"Connexion à OVH impossible ({type(e).__name__}). Rien n'a été modifié.")
        self.sftp = self.client.open_sftp()
        self._dossiers: set[str] = set()

    def web(self, nom: str = "") -> str:
        return f"{self.cfg['dossier_web']}/{nom}".rstrip("/")

    def preprod(self, nom: str = "") -> str:
        return self.web(f"{self.cfg['sous_dossier']}/{nom}")

    def lire(self, chemin: str) -> bytes | None:
        try:
            with self.sftp.open(chemin, "rb") as f:
                return f.read()
        except FileNotFoundError:
            return None

    def ecrire(self, chemin: str, contenu: bytes) -> None:
        if "/" in chemin:
            self._creer_dossiers(chemin.rsplit("/", 1)[0])
        self.sftp.putfo(io.BytesIO(contenu), chemin)

    def supprimer(self, chemin: str) -> None:
        try:
            self.sftp.remove(chemin)
        except FileNotFoundError:
            pass

    def lister(self, dossier: str) -> list[str]:
        try:
            return sorted(self.sftp.listdir(dossier))
        except FileNotFoundError:
            return []

    def fermer(self) -> None:
        self.sftp.close()
        self.client.close()

    def _creer_dossiers(self, dossier: str) -> None:
        courant = ""
        for partie in dossier.split("/"):
            courant = f"{courant}/{partie}" if courant else partie
            if courant not in self._dossiers:
                try:
                    self.sftp.stat(courant)
                except FileNotFoundError:
                    self.sftp.mkdir(courant)
                self._dossiers.add(courant)


# ---------------------------------------------------------------- HTTP

def demander(url: str, auth: tuple[str, str] | None = None) -> tuple[int, str | None, bytes]:
    u = urllib.parse.urlsplit(url)
    classe = http.client.HTTPSConnection if u.scheme == "https" else http.client.HTTPConnection
    conn = classe(u.hostname, timeout=30)
    entetes = {"User-Agent": "publier-preprod", "Cache-Control": "no-cache"}
    if auth:
        jeton = base64.b64encode(f"{auth[0]}:{auth[1]}".encode("utf-8")).decode("ascii")
        entetes["Authorization"] = f"Basic {jeton}"
    conn.request("GET", u.path or "/", headers=entetes)
    r = conn.getresponse()
    corps = r.read()
    conn.close()
    return r.status, r.getheader("Location"), corps


# ---------------------------------------------------------------- programme

def main() -> None:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--branche", help="branche ou commit du site à envoyer")
    p.add_argument("--dossier", help="dossier à envoyer (par défaut : le dossier du site)")
    p.add_argument("--zip", help="zip à envoyer")
    p.add_argument("--essai", action="store_true", help="montrer sans rien envoyer")
    p.add_argument("--tout", action="store_true", help="tout renvoyer, même ce qui n'a pas changé")
    p.add_argument("--changer-mot-de-passe", action="store_true")
    args = p.parse_args()

    cfg = json.loads(CONFIG.read_text(encoding="utf-8"))
    dossier = Path(args.dossier or cfg["dossier_site"])
    if args.zip:
        fichiers, source = fichiers_du_zip(Path(args.zip)), f"zip {Path(args.zip).name}"
    elif args.branche:
        fichiers, source = fichiers_de_la_branche(dossier, args.branche), f"branche {args.branche}"
    else:
        fichiers, source = fichiers_du_dossier(dossier), f"dossier {dossier}"
    ecartes = sorted(n for n in fichiers if Path(n).suffix.lower() not in STATIQUES)
    for nom in ecartes:
        del fichiers[nom]
    if "index.html" not in fichiers:
        sys.exit(f"Pas de index.html dans : {source}")
    liens = adapter_au_sous_dossier(fichiers, cfg["sous_dossier"])
    taille = sum(len(c) for c in fichiers.values()) / 1_048_576
    print(f"Source : {source} — {len(fichiers)} fichiers, {taille:.1f} Mo")
    if ecartes:
        print("Pas envoyés (pas des fichiers de site statique) :", ", ".join(ecartes))
    if liens:
        print(f"{liens} lien(s) partant de la racine adapté(s) à /{cfg['sous_dossier']}/")

    if args.essai:
        for nom in sorted(fichiers):
            print("  ", nom)
        print("Essai : rien n'a été envoyé.")
        return
    distant = Distant(cfg)
    compte = distant.sftp.normalize(".")
    if compte not in (cfg["chemin_absolu"], "/"):
        sys.exit(f"Dossier du compte inattendu : {compte} (attendu {cfg['chemin_absolu']})."
                 " Rien n'a été modifié.")
    print("Connecté à OVH (SFTP). Dossier web :", ", ".join(distant.lister(distant.web())) or "(vide)")

    # 1. Fichiers Apache existants : on ne remplace jamais ce qu'on n'a pas écrit.
    racine_actuelle = distant.lire(distant.web(".htaccess"))
    preprod_actuel = distant.lire(distant.preprod(".htaccess"))
    for nom, contenu in (("www/.htaccess", racine_actuelle), ("pré-prod/.htaccess", preprod_actuel)):
        if contenu is not None and not contenu.decode("utf-8", "replace").startswith(MARQUE):
            copie = ICI / f"copie-{nom.replace('/', '-')}-{dt.datetime.now():%Y%m%d-%H%M%S}.txt"
            copie.write_bytes(contenu)
            sys.exit(f"Un fichier {nom} existe déjà chez OVH et ne vient pas de cet outil."
                     f" Rien n'a été modifié. Copie : {copie}")

    # 2. Mot de passe de la pré-prod, avant tout fichier : rien n'est visible sans lui.
    auth = None
    if args.changer_mot_de_passe or distant.lire(FICHIER_MDP) is None:
        auth = nouvel_utilisateur()
        sel = "".join(secrets.choice(_ITOA64) for _ in range(8))
        distant.ecrire(FICHIER_MDP, f"{auth[0]}:{apr1(auth[1], sel)}\n".encode("ascii"))
        print("Mot de passe de la pré-prod enregistré chez OVH.")
    attendu = htaccess_preprod(cfg).encode("ascii")
    if preprod_actuel != attendu:
        distant.ecrire(distant.preprod(".htaccess"), attendu)

    # 3. Fichiers du site : seulement ce qui a changé depuis le dernier envoi.
    ancien = json.loads(distant.lire(distant.preprod(MANIFESTE)) or b"{}").get("fichiers", {})
    nouveau = {nom: empreinte(c) for nom, c in fichiers.items()}
    a_envoyer = sorted(n for n in nouveau if args.tout or ancien.get(n) != nouveau[n])
    a_retirer = sorted(n for n in ancien if n not in nouveau)
    for i, nom in enumerate(a_envoyer, 1):
        distant.ecrire(distant.preprod(nom), fichiers[nom])
        print(f"\r  Envoi {i}/{len(a_envoyer)}", end="", flush=True)
    if a_envoyer:
        print()
    for nom in a_retirer:
        distant.supprimer(distant.preprod(nom))
    manifeste = {"source": source, "date": dt.datetime.now().isoformat(timespec="seconds"),
                 "fichiers": nouveau}
    distant.ecrire(distant.preprod(MANIFESTE), json.dumps(manifeste, indent=1).encode("utf-8"))
    print(f"{len(a_envoyer)} fichier(s) envoyé(s), {len(a_retirer)} retiré(s),"
          f" {len(nouveau) - len(a_envoyer)} inchangé(s).")

    # 4. colokeo.com renvoie vers le vrai site (sauf la pré-prod).
    attendu = htaccess_racine(cfg).encode("ascii")
    if racine_actuelle != attendu:
        distant.ecrire(distant.web(".htaccess"), attendu)
        print("colokeo.com renvoie maintenant vers", cfg["site_public"])
    distant.fermer()

    # 5. Vérifications depuis Internet.
    print("\nVérifications :")
    ok = True
    adresse = cfg["adresse"]
    statut, _, _ = demander(adresse)
    bon = statut == 401
    ok &= bon
    print(f"  {'OK ' if bon else 'NON'} sans mot de passe : {statut} (attendu 401, mot de passe demandé)")
    statut, lieu, _ = demander(adresse.replace("https://", "http://", 1))
    bon = statut in (301, 302) and (lieu or "").startswith("https://")
    ok &= bon
    print(f"  {'OK ' if bon else 'NON'} en http : {statut} vers {lieu} (attendu : renvoi en https)")
    racine = "https://" + urllib.parse.urlsplit(adresse).hostname + "/"
    statut, lieu, _ = demander(racine)
    bon = statut in (301, 302) and (lieu or "").startswith(cfg["site_public"])
    ok &= bon
    print(f"  {'OK ' if bon else 'NON'} {racine} : {statut} vers {lieu}")
    if auth:
        statut, _, corps = demander(adresse, auth)
        bon = statut == 200 and corps == fichiers["index.html"]
        ok &= bon
        print(f"  {'OK ' if bon else 'NON'} avec le mot de passe : {statut}"
              f"{', page identique à la source' if bon else ''}")
    print(f"\n{'Pré-prod à jour' if ok else 'ATTENTION : une vérification a échoué'} : {adresse}")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
