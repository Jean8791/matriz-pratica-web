import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

function run(command) {
  execSync(command, { stdio: "inherit" });
}

function capture(command) {
  return execSync(command, { encoding: "utf-8" }).trim();
}

function readVersionFromBranch(branch) {
  const packageJson = execSync(`git show ${branch}:package.json`, {
    encoding: "utf-8",
  });
  return JSON.parse(packageJson).version;
}

function versionToNumber(version) {
  return parseInt(version.split(".")[1], 10);
}

function numberToVersion(number) {
  return `0.${String(number).padStart(2, "0")}`;
}

function setVersionInPackageJson(newVersion) {
  const content = readFileSync("package.json", "utf-8");
  const updated = content.replace(
    /"version":\s*"[^"]*"/,
    `"version": "${newVersion}"`,
  );
  writeFileSync("package.json", updated);
}

if (capture("git status --porcelain")) {
  console.error(
    "Existem alterações não commitadas. Faça commit ou stash antes de liberar uma versão.",
  );
  process.exit(1);
}

const masterVersion = readVersionFromBranch("master");
const developmentVersion = readVersionFromBranch("development");

if (versionToNumber(developmentVersion) <= versionToNumber(masterVersion)) {
  console.error(
    `A versão da development (${developmentVersion}) precisa ser maior que a da master (${masterVersion}).`,
  );
  process.exit(1);
}

const newReleaseBranch = `release-${masterVersion}`;
const newDevelopmentVersion = numberToVersion(
  versionToNumber(developmentVersion) + 1,
);

if (capture(`git branch --list ${newReleaseBranch}`)) {
  console.error(`A branch ${newReleaseBranch} já existe.`);
  process.exit(1);
}

console.log(`
Liberando versão:
  ${newReleaseBranch} (nova)  <- master  (${masterVersion})
  master                      <- development (${developmentVersion})
  development                 -> ${newDevelopmentVersion}
`);

run("git checkout master");
run(`git branch ${newReleaseBranch} master`);

try {
  run("git merge development --no-edit");
} catch {
  console.error(
    `\nConflito ao mesclar development em master. Resolva manualmente, finalize o merge e depois rode:\n  git push origin master development ${newReleaseBranch}`,
  );
  process.exit(1);
}

run("git checkout development");
setVersionInPackageJson(newDevelopmentVersion);
run("git add package.json");
run(`git commit -m "chore: bump version to ${newDevelopmentVersion}"`);

run(`git push origin master development ${newReleaseBranch}`);

console.log(
  `\nPronto! ${newReleaseBranch} criada, master em ${developmentVersion}, development em ${newDevelopmentVersion}.`,
);
