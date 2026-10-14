# #ÉFakeOuNão?

Código do artigo **Detecção de *Fake News* em eleições no Brasil: Sistema Web para Rotulamento de *Tweets* Usando Aprendizagem Fraca e Aprendizagem Ativa**.

## Resumo

As redes sociais modificaram a forma como as informações são divulgadas, aplicativos como Twitter/X tornaram-se o principal meio de comunicação sobre notícias da atualidade, associado a isso houve um crescimento no compartilhamento de *fake news*. Na eleição presidencial do Brasil em 2022 vimos um aumento na proliferação da desinformação. Estudos mostram que a divulgação de *fake news* teve um papel importante na decisão de voto dos cidadãos, e que a maioria dos brasileiros tem dificuldade em identificar se uma notícia é falsa ou não. Diante deste cenário, esta pesquisa desenvolveu um sistema web e aplicou a metodologia de aprendizagem fraca para classificar tweets relacionados às eleições presidenciais brasileiras de 2022 como notícia falsa ou verdadeira, aplicadas a um conjunto de dados do Twitter/X. O modelo inicial atribuiu rótulos probabilísticos a 19.8% dos tweets com uma confiança média de 78.5%. Para refinar o modelo, implementou-se um ciclo de aprendizagem ativa: 3.513 tweets com baixa confiança (<70%) foram identificados, e 48 destes foram rotulados manualmente por usuários através do sistema web desenvolvido. A avaliação do modelo refinado apresentou Acurácia de 99.43% e F1-Score 99.71% para a classe *fake news*. Após o re-treinamento utilizando estes rótulos manuais, a confiança média do modelo refinado nas predições do conjunto de baixa confiança aumentou significativamente para 97.79%.

## Estrutura

| Pasta | Conteúdo |
|---|---|
| [`ml/`](ml/README.md) | Módulo de treinamento: análise exploratória, pré-processamento, funções de rotulagem com Snorkel e retreino com os rótulos manuais (notebooks Jupyter) |
| [`web/`](web/README.md) | Aplicação web onde os usuários rotulam os tweets de baixa confiança: [backend](web/backend/README.md) em Node.js + Express + MongoDB e [frontend](web/frontend/README.md) em Next.js |

Para rodar a aplicação web localmente (com ou sem Docker), veja o [`web/README.md`](web/README.md).

## Aplicação em produção

A aplicação está disponível em **[ehfakeounao.vercel.app](https://ehfakeounao.vercel.app)**. Para votar nos tweets, é preciso criar uma conta e confirmar o e-mail.

| Parte | Hospedagem |
|---|---|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com), plano gratuito |
| Banco de dados | [MongoDB Atlas](https://www.mongodb.com/atlas), plano gratuito |
| E-mails | API do Gmail |

## Dados

Os tweets são uma amostra da base disponibilizada pelo grupo INTERFACES, da Universidade Federal de São Carlos (UFSCar), coletada pela API do Twitter/X durante as eleições de 2022. Os dados brutos não estão neste repositório.
