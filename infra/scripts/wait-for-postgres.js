import * as child_process from "node:child_process";

function checkPostgres() {
  child_process.exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout, stderr) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    }
    console.log("\nPostgres está pronto e aceitando conexões!\n");
  }

}


process.stdout.write("\n\n Aguardando Postgres aceitar conexões...");
checkPostgres();