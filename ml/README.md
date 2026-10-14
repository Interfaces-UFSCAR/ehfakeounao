# #ÉFakeOuNão? — ML

Módulo de treinamento do projeto: rotular tweets sobre o segundo turno da eleição presidencial de 2022 (Lula e Bolsonaro) como **fake news** (`1`) ou **não fake** (`0`) usando **aprendizagem fraca** (Snorkel), e refinar o modelo com **aprendizagem ativa**: os tweets em que o modelo tem pouca confiança são rotulados por pessoas na [aplicação web](../web/README.md) e voltam para o retreino.

O processo e os resultados estão descritos no artigo *"Detecção de Fake News em eleições no Brasil: Sistema Web para Rotulamento de Tweets Usando Aprendizagem Fraca e Aprendizagem Ativa"* (Karen Anne Aciole Alves e Eanes Torres Pereira, UFCG).

O trabalho foi feito em notebooks Jupyter. Este README só descreve o processo; não é um pipeline para ser executado de ponta a ponta.

## Stack

- **Python 3.10** + **Jupyter**
- **pandas**: manipulação dos dados
- **NLTK**: stopwords em português
- **Snorkel**: labeling functions e `LabelModel` (supervisão fraca)
- **scikit-learn**: métricas de avaliação
- **matplotlib / seaborn**: gráficos

## Dados

Amostra da base do grupo **INTERFACES (UFSCar)**, que reúne cerca de 282 milhões de tweets coletados pela API do Twitter/X durante as eleições de 2022. A amostra usada tem **34.217 tweets** de 09/10/2022 a 14/11/2022, obtidos por buscas com os nomes e apelidos dos candidatos e pelos perfis oficiais (`from:LulaOficial`, `from:jairbolsonaro`). Depois de remover duplicados, restam **27.459 tweets únicos**.

## Fluxo

```
amostras .parquet ──► EDA + limpeza ──► labeling functions (Snorkel) ──► LabelModel
                                                                            │
                                                          confiança < 70%   ▼
                                       aplicação web ◄── tweets de baixa confiança
                                             │
                                             ▼
                              rótulos humanos ──► validação e retreino
```

1. **Análise exploratória** (`eda.ipynb`, seção I): junta as amostras `.parquet` em `tweets.parquet` e analisa tweets por dia, engajamento (curtidas, retweets, quotes, respostas), correlação de Pearson entre essas métricas e palavras mais frequentes. Os 3.500 tweets com mais engajamento serviram de base para escolher as palavras-chave das heurísticas. As figuras estão em `assets/`.
2. **Pré-processamento** (seção II): remove duplicados, menções, URLs, quebras de linha, pontuação, acentos e stopwords (inclusive abreviações como "vc" e "pq"), converte para minúsculas e mantém só `id` e `text`, gerando `clean_tweets.parquet`.
3. **Rotulagem fraca** (seção III): **15 labeling functions** baseadas em palavras-chave, criadas a partir dos tweets mais engajados e de um dossiê de checagens do INTERFACES. Narrativas falsas conhecidas (canibalismo, maçonaria, satanismo, fraude em urnas, Lei Rouanet, aborto, comunismo etc.) votam **FAKE**; declarações de voto (`lula13`, `bolsonaro22`...) votam **não fake**; caso contrário, a função se abstém. O `LabelModel` combina os votos e rotulou **5.438 tweets** (19,8% da base: 4.960 fake e 468 não fake), com confiança média de **78,5%**.
4. **Baixa confiança → rotulagem humana**: os **3.513 tweets** com confiança abaixo de 70% foram exportados em JSON para o MongoDB da aplicação web. Lá, um tweet só recebe o rótulo final depois de **3 votos concordantes** (Falso, Verdadeiro ou Irrelevante). As palavras-chave sugeridas pelos usuários levaram a uma nova LF, `keyword_zema`, totalizando **16 LFs** no retreino.
5. **Normalização dos rótulos humanos** (`retrain.ipynb`): junta os CSVs exportados do MongoDB, combina as colunas de tags, converte `fake` → `1` e `true` → `0`, descarta os `irrelevant` e salva `tweets_rotulados_normalizados.csv`.
6. **Validação e retreino** (`eda.ipynb`, parte final):
   - Compara as 16 LFs no conjunto inicial e no de baixa confiança (cobertura, sobreposições e conflitos, com `LFAnalysis`).
   - Retreina o `LabelModel` nos 3.513 tweets de baixa confiança usando os 48 rótulos humanos como `Y_dev` ("modelo refinado").
   - Compara os modelos inicial e refinado nos 48 tweets rotulados por pessoas e analisa as 5 divergências (`resultados.txt`).

## Resultados

Rotulagem pela aplicação web, de 13/03/2025 a 27/03/2025: 72 contas criadas, 56 verificadas e 31 usuários que votaram em pelo menos um tweet. **50 tweets** atingiram o consenso de 3 votos: 44 falsos, 4 verdadeiros e 2 irrelevantes. Os 2 irrelevantes ficaram de fora, então o ground truth tem **48 tweets**.

| Modelo | Acurácia | F1-Score (fake) | Confiança média |
|---|---|---|---|
| Inicial (15 LFs) | 99,29% | 99,64% | 78,5% |
| Refinado (16 LFs + rótulos humanos) | 99,43% | 99,71% | 97,79% |

O principal efeito do retreino foi o aumento da confiança média nos tweets de baixa confiança, de 78,5% para 97,79%. As divergências aparecem principalmente em tweets que ativam ao mesmo tempo LFs de fake news (ex.: `lf_ladrao`) e a LF de declaração de voto.

## Arquivos

| Arquivo | Conteúdo |
|---|---|
| `eda.ipynb` | Análise exploratória, limpeza, labeling functions, `LabelModel`, validação e retreino |
| `retrain.ipynb` | Normalização dos rótulos humanos exportados da aplicação web |
| `merge.py` | Junta dois JSON de tweets removendo duplicados |
| `validation.py` | Junta os lotes `low_confidence_tweets/*.json` em um único arquivo |
| `final_labels.csv` | Os 3.513 tweets de baixa confiança com rótulo final, confiança e `is_ground_truth` (se o rótulo veio de pessoas) |
| `resultados.txt` | Matriz de confusão e divergências entre o modelo e os rótulos humanos |
| `confidence_distribution*.png`, `combined_confidence.png` | Distribuição da confiança do `LabelModel` antes e depois do retreino |
| `confusion_matrix_comparison.png` | Matriz de confusão: modelo refinado × rótulos manuais |
| `assets/` | Figuras da análise exploratória |
| `requirements.txt`, `requirements_2.txt` | Dependências (veja abaixo) |

## Observações

- Os dados brutos e intermediários (`data/`, arquivos `.parquet` e CSVs de rótulos) **não estão no repositório**.
- Os notebooks têm caminhos absolutos (`/home/kaka/tcc/ml/...`) e células que foram executadas fora de ordem. Para reproduzir algo, é preciso ter os dados e ajustar os caminhos.
- `requirements.txt` lista os pacotes principais. `requirements_2.txt` tem as versões fixadas do ambiente usado (ex.: `snorkel==0.9.9`, `pandas==2.2.3`, `scikit-learn==1.6.1`, `numpy==2.1.0`), mas o arquivo está com o encoding corrompido e o `pip` não consegue lê-lo diretamente.
