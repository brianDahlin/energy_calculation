import { TronWeb } from "tronweb";
import "dotenv/config";

const API_KEY = process.env.API_KEY;

const tronWeb = new TronWeb({
  fullHost: "https://api.trongrid.io",
  headers: { "TRON-PRO-API-KEY": API_KEY },
});

const pad64 = (hex) => hex.replace(/^0x/, "").padStart(64, "0");

// Собираем ABI-параметры transfer(address,uint256)
function encodeTransferParams(toBase58, rawAmountBigInt) {
  const toHex41 = tronWeb.address
    .toHex(toBase58)
    .replace(/^0x/, "")
    .toLowerCase();
  const toHex20 = toHex41.replace(/^41/, "");
  const amountHex = BigInt(rawAmountBigInt).toString(16);
  return pad64(toHex20) + pad64(amountHex);
}

async function main() {
  const owner = "TEMHdRPkMDzwXQGbrUw7z2UsKW9w42CoJy";
  const usdt = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

  // ВАРИАНТ 1: перевод «на себя» (валидный Base58)
  const to = owner;

  const amount = 1_000_000; // 1 USDT при decimals=6

  const body = {
    owner_address: owner,
    contract_address: usdt,
    function_selector: "transfer(address,uint256)",
    parameter: encodeTransferParams(to, amount),
    fee_limit: 100000000,
    call_value: 0,
    visible: true,
  };

  const url = "https://api.trongrid.io/wallet/triggerconstantcontract"; // симуляция

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "TRON-PRO-API-KEY": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  console.log(await res.json());
}

main().catch(console.error);
