# Selus - DApp para Registro e Verificação de Certificados em Blockchain

Este DApp permite que instituições registrem certificados na blockchain Ethereum (Sepolia Test Network) e que qualquer pessoa verifique a autenticidade desses certificados.

## Como Usar

### Pré-requisitos

Antes de começar, certifique-se de ter o seguinte instalado:

* **Node.js e npm:** Necessários para rodar o frontend React. Baixe a versão LTS em [nodejs.org](https://nodejs.org/).
* **MetaMask:** Extensão de navegador para interagir com a blockchain. Configure-a para a rede Sepolia Test Network e obtenha algum SepoliaETH (ETH de teste).

### Instalação

1.  Clone este repositório:

    ```bash
    git clone [https://github.com/FelipeBragaUEA/Selus.git](https://github.com/FelipeBragaUEA/Selus.git)
    cd Selus
    ```

2.  Instale as dependências do frontend:

    ```bash
    cd frontend
    npm install
    ```

### Rodando o DApp

1.  Inicie o frontend React:

    ```bash
    npm start
    ```

    O DApp será aberto no seu navegador.

2.  Conecte sua carteira MetaMask (na rede Sepolia) para interagir com o contrato.

---

### **Aviso Importante sobre o Contrato Inteligente (Deployment)**

**Cada vez que o código Solidity do contrato é modificado e reimplantado em uma rede blockchain (como a Sepolia), uma nova instância do contrato é criada em um ENDEREÇO COMPLETAMENTE NOVO.** Além disso, a descrição da interface do contrato (o **ABI**) também pode mudar se houver alterações nas funções ou estrutura dos dados.

**Se você modificar o arquivo `contracts/CertificateRegistry.sol` e quiser que seu frontend interaja com a versão mais recente dessas mudanças, você DEVE:**

1.  **Recompilar o contrato** no Remix IDE.
2.  **Implantá-lo novamente** na rede Sepolia.
3.  **Após o deploy, copiar o NOVO ENDEREÇO do contrato** "Deploy & run transactions > deployed contracts" que o Remix fornecer.
4.  **Copiar o NOVO ABI** (Solidity compiler > Compilation details > ABI (copiar)) do contrato que o Remix fornecer.
5.  **Atualizar manualmente** as constantes `CONTRACT_ADDRESS` e `CONTRACT_ABI` no arquivo `frontend/src/App.js` com esses novos valores.
6.  **Reiniciar seu frontend** (`npm start`) para que ele use os novos dados.

---

### Configurando o Remix IDE (Opcional)

Se você quiser editar e compilar o contrato Solidity diretamente no Remix IDE:

1.  Abra o Remix IDE em [remix.ethereum.org](remix.ethereum.org).
2.  Ative o plugin do GitHub:
    * Na barra lateral esquerda, clique no ícone do Plugin Manager (parece uma tomada).
    * Procure por "GitHub" e clique em "Activate".
3.  Conecte o Remix ao seu repositório GitHub:
    * Clique no ícone do GitHub na barra lateral.
    * Autorize o Remix a acessar seu GitHub (siga as instruções).
    * Cole a URL do seu repositório (ex: `https://github.com/FelipeBragaUEA/Selus.git`) no campo "Clone Repository".
    * Clique em "Clone".
4.  O contrato `CertificateRegistry.sol` estará disponível para edição e compilação no Remix.
    * As alterações podem ser enviadas diretamente para o GitHub pelo Remix.

### Estrutura do Projeto

* `frontend/`: Código fonte do frontend React.
* `contracts/`: Contrato inteligente Solidity (`CertificateRegistry.sol`).
* `ABI CONTRATO.txt`: Arquivo ABI do contrato (você pode usá-lo como referência ou para salvar o ABI atual manualmente, mas o `App.js` usa o ABI hardcoded).
