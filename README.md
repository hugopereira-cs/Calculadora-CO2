Copiar

# 🌱 Calculadora de Emissão de CO₂

Calculadora web para estimar e comparar o impacto ambiental de diferentes modos de transporte, desenvolvida como projeto prático do **Curso de GitHub Copilot da DIO** utilizando Vibe Coding com GitHub Copilot.

---

## 🚀 Acesso

O projeto está publicado via **GitHub Pages** e é atualizado automaticamente a cada push na branch `main`.

---

## 📋 Funcionalidades

- **Cálculo de emissões de CO₂** com base na distância e no modo de transporte selecionado
- **Preenchimento automático de distância** entre cidades brasileiras cadastradas
- **Entrada manual de distância** quando a rota não está cadastrada
- **Comparação entre modos de transporte** com barras de progresso visuais
- **Cálculo de créditos de carbono** equivalentes à emissão gerada
- **Estimativa de valor** dos créditos de carbono em BRL

---

## 🚗 Modos de Transporte Suportados

| Modo        | Ícone | Fator de Emissão (kg CO₂/km) |
|-------------|-------|-------------------------------|
| Bicicleta   | 🚴    | 0,000                         |
| Carro       | 🚗    | 0,120                         |
| Ônibus      | 🚌    | 0,089                         |
| Caminhão    | 🚚    | 0,960                         |

---

## 🗺️ Rotas Cadastradas

O banco de dados inclui rotas entre as principais cidades brasileiras das cinco regiões do país:

- **Sudeste:** São Paulo, Rio de Janeiro, Belo Horizonte, Campinas, Santos, entre outras
- **Nordeste:** Salvador, Recife, Fortaleza, Natal, João Pessoa, entre outras
- **Norte:** Belém, Manaus, Palmas, Boa Vista, entre outras
- **Sul:** Curitiba, Porto Alegre, Florianópolis, Londrina, entre outras
- **Centro-Oeste:** Brasília, Goiânia, Cuiabá, Campo Grande, entre outras

---

## 🧮 Como Funciona

1. Informe a **cidade de origem** e o **destino** (com autocomplete)
2. A **distância é preenchida automaticamente** se a rota estiver cadastrada; caso contrário, é possível inseri-la manualmente
3. Selecione o **modo de transporte**
4. Clique em **Calcular Emissão**
5. Visualize os resultados:
   - Emissão total de CO₂ em kg
   - Economia em relação ao carro
   - Comparativo entre todos os modos de transporte
   - Equivalente em créditos de carbono e seu valor estimado (R$ 50 – R$ 150 por crédito)

---

## 🗂️ Estrutura do Projeto

```
📁 css/
   └── style.css          # Estilos da aplicação
📁 js/
   ├── routes-data.js     # Banco de dados de rotas e distâncias
   ├── config.js          # Fatores de emissão e configurações gerais
   ├── calculator.js      # Lógica de cálculo de emissões e créditos de carbono
   ├── ui.js              # Renderização e manipulação do DOM
   └── app.js             # Controlador principal da aplicação
📁 .github/workflows/
   └── deploy.yml         # Pipeline de deploy automático para GitHub Pages
index.html                # Página principal
```

---

## 🌍 Deploy

O projeto utiliza **GitHub Actions** para deploy automático no **GitHub Pages**. O workflow é disparado a cada push na branch `main` ou manualmente via `workflow_dispatch`.

---

## 👨‍💻 Autor

Desenvolvido com ❤️ por **Hugo Pereira** para o projeto GitHub Copilot da DIO.