import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

export function run(command) {
  execSync(command, { stdio: "inherit" });
}

export function capture(command) {
  return execSync(command, { encoding: "utf-8" }).trim();
}

export function ensureCleanWorkingTree() {
  if (capture("git status --porcelain")) {
    console.error(
      "Existem alterações não commitadas. Faça commit ou stash antes de continuar.",
    );
    process.exit(1);
  }
}

export function readVersionFromBranch(branch) {
  const packageJson = execSync(`git show ${branch}:package.json`, {
    encoding: "utf-8",
  });
  return JSON.parse(packageJson).version;
}

export function versionToNumber(version) {
  return parseInt(version.split(".")[2], 10);
}

export function numberToVersion(number) {
  return `0.0.${number}`;
}

// Atualiza o "version" do package.json e as duas ocorrências correspondentes
// no package-lock.json (raiz e packages[""]), sem tocar na versão de nenhuma
// dependência.
export function setVersion(newVersion) {
  const pkgPath = "package.json";
  const pkgContent = readFileSync(pkgPath, "utf-8");
  const pkgName = JSON.parse(pkgContent).name;
  const updatedPkg = pkgContent.replace(
    /"version":\s*"[^"]*"/,
    `"version": "${newVersion}"`,
  );
  writeFileSync(pkgPath, updatedPkg);

  const lockPath = "package-lock.json";
  const lockContent = readFileSync(lockPath, "utf-8");
  const escapedName = pkgName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const updatedLock = lockContent.replace(
    new RegExp(
      `("name":\\s*"${escapedName}",\\s*\\n\\s*"version":\\s*")[^"]*(")`,
      "g",
    ),
    `$1${newVersion}$2`,
  );
  writeFileSync(lockPath, updatedLock);
}

export function isAncestor(ancestorBranch, descendantBranch) {
  try {
    execSync(
      `git merge-base --is-ancestor ${ancestorBranch} ${descendantBranch}`,
      { stdio: "ignore" },
    );
    return true;
  } catch {
    return false;
  }
}

export function tagExists(tagName) {
  return Boolean(capture(`git tag -l ${tagName}`));
}
