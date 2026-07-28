import {
  run,
  ensureCleanWorkingTree,
  readVersionFromBranch,
  tagExists,
} from "./lib/release-utils.js";

ensureCleanWorkingTree();

const masterVersion = readVersionFromBranch("master");
const tagName = `v${masterVersion}`;

if (tagExists(tagName)) {
  console.error(
    `A versão ${masterVersion} já foi promovida para produção (tag ${tagName} já existe).`,
  );
  process.exit(1);
}

console.log(`
Promovendo para produção:
  release     <- master (${masterVersion})
  tag         ${tagName}
`);

run("git checkout release");

try {
  run("git merge master --no-edit");
} catch {
  console.error(`
Conflito ao mesclar master em release. Para resolver:
  1. Resolva os conflitos nos arquivos indicados
  2. git add <arquivos resolvidos>
  3. git commit
  4. Rode novamente: npm run release:production
`);
  process.exit(1);
}

run(`git tag ${tagName}`);
run("git push origin release --tags");

console.log(`
Pronto! release atualizada e tag ${tagName} criada e enviada.

Para reverter esta versão em produção, se precisar:
  - Use "Promote to Production" no deployment anterior, direto no dashboard da Vercel; ou
  - Reverta manualmente para a tag anterior com git (com cautela, pois reescreve o histórico da release).
`);