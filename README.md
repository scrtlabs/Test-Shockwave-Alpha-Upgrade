```bash
# Clone repo
git clone https://github.com/scrtlabs/SecretNetwork /tmp/SecrtNetwork

# Compile v1.2
(
    cd /tmp/SecrtNetwork
    git checkout v1.2.2
    echo not_a_key | tee ./spid.txt ./api_key.txt > /dev/null
    SGX_MODE=SW make build-linux
)

cp /tmp/SecrtNetwork/{secretd,go-cosmwasm/librust_cosmwasm_enclave.signed.so,go-cosmwasm/api/libgo_cosmwasm.so} ./v1.2

# Compile v1.3
(
    cd /tmp/SecrtNetwork
    git checkout backport-cw-crypto-apis-to-v0.10
    echo not_a_key | tee ./spid.txt ./api_key.txt > /dev/null
    SGX_MODE=SW make build-linux
)

cp /tmp/SecrtNetwork/{secretd,go-cosmwasm/librust_cosmwasm_enclave.signed.so,go-cosmwasm/api/libgo_cosmwasm.so} ./v1.3

# Start a new testnet with v1.2
rm -f ./libgo_cosmwasm.so ./librust_cosmwasm_enclave.signed.so ./secretd
ln -s ./v1.2/libgo_cosmwasm.so ./libgo_cosmwasm.so
ln -s ./v1.2/librust_cosmwasm_enclave.signed.so ./librust_cosmwasm_enclave.signed.so
ln -s ./v1.2/secretd ./secretd

./secretd --home "$(pwd)/.secretd" config keyring-backend test
./secretd --home "$(pwd)/.secretd" config chain-id shockwavealpha-1
./secretd --home "$(pwd)/.secretd" config output json

./secretd --home "$(pwd)/.secretd" init my-node-moniker --chain-id shockwavealpha-1
perl -i -pe 's/"stake"/"uscrt"/g' ./.secretd/config/genesis.json
./secretd --home "$(pwd)/.secretd" keys add a --recover --keyring-backend test
./secretd --home "$(pwd)/.secretd" add-genesis-account "$(./secretd --home "$(pwd)/.secretd" keys show -a --keyring-backend test a)" 1000000000000uscrt
./secretd --home "$(pwd)/.secretd" gentx a 1000000uscrt --chain-id shockwavealpha-1 --keyring-backend test
./secretd --home "$(pwd)/.secretd" collect-gentxs
./secretd --home "$(pwd)/.secretd" validate-genesis

mkdir -p ./.sgx_secrets
SGX_MODE=SW SCRT_SGX_STORAGE="$(pwd)/.sgx_secrets" ./secretd --home "$(pwd)/.secretd" init-bootstrap node-master-cert.der io-master-cert.der
./secretd --home "$(pwd)/.secretd" validate-genesis

SGX_MODE=SW SCRT_SGX_STORAGE="$(pwd)/.sgx_secrets" LD_LIBRARY_PATH="$LD_LIBRARY_PATH:$(pwd)" RUST_BACKTRACE=1 ./secretd --home "$(pwd)/.secretd" start --bootstrap

```
