import {
  run,
  ensureCleanWorkingTree,
  readVersionFromBranch,
  versionToNumber,
  numberToVersion,
  setVersion,
  isAncestor,
} from "./lib/release-utils.js";

ensureCleanWorkingTree();

const masterVersion = readVersionFromBranch("master");
const developmentVersion = readVersionFromBranch("development");
const masterNumber = versionToNumber(masterVersion);
const developmentNumber = versionToNumber(developmentVersion);

if (developmentNumber < masterNumber) {
  console.error(
    `A versão da development (${developmentVersion}) é menor que a da master (${masterVersion}). Verifique o histórico antes de continuar.`,
  );
  process.exit(1);
}

if (developmentNumber === masterNumber && !isAncestor("development", "master")) {
  console.error(
    `A versão da development (${developmentVersion}) precisa ser maior que a da master (${masterVersion}).`,
  );
  process.exit(1);
}

console.log(`
Promovendo para stage:
  master      <- development (${developmentVersion})
`);

run("git checkout master");

try {
  run("git merge development --no-edit");
} catch {
  console.error(`
Conflito ao mesclar development em master. Para resolver:
  1. Resolva os conflitos nos arquivos indicados
  2. git add <arquivos resolvidos>
  3. git commit
  4. Rode novamente: npm run release:staging
     (o script detecta que o merge já foi concluído e só falta atualizar a versão da development)
`);
  process.exit(1);
}

const masterVersionNow = readVersionFromBranch("master");
const developmentVersionNow = readVersionFromBranch("development");

if (versionToNumber(developmentVersionNow) > versionToNumber(masterVersionNow)) {
  console.log(
    `development já está em ${developmentVersionNow}, à frente da master (${masterVersionNow}). Nada para bumpar.`,
  );
} else {
  const newDevelopmentVersion = numberToVersion(
    versionToNumber(masterVersionNow) + 1,
  );

  run("git checkout development");
  setVersion(newDevelopmentVersion);
  run("git add package.json package-lock.json");
  run(`git commit -m "chore: bump version to ${newDevelopmentVersion}"`);
  console.log(`development atualizada para ${newDevelopmentVersion}.`);
}

run("git push origin master development");

console.log(
  "\nPronto! master e development sincronizadas e enviadas para o origin.",
);