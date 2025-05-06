import { db, transactions, rejectedTransactions } from "../src/db"; // Ajuste o caminho se necessário

async function clearDatabaseTables() {
  console.log(
    "⚠️ ATENÇÃO: Tentando limpar todas as linhas das tabelas transactions e rejectedTransactions...",
  );

  try {
    const deletedRejected = await db.delete(rejectedTransactions);
    console.log(
      `- Tabela 'rejectedTransactions': ${deletedRejected.rowCount ?? 0} linhas deletadas.`,
    );

    const deletedValid = await db.delete(transactions);
    console.log(
      `- Tabela 'transactions': ${deletedValid.rowCount ?? 0} linhas deletadas.`,
    );

    console.log("✅ Tabelas limpas com sucesso.");
    return;
  } catch (error) {
    console.error("❌ Erro ao limpar as tabelas do banco de dados:", error);
    process.exit(1);
  }
}

clearDatabaseTables();
