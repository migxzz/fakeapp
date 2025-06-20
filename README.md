# Animação 3D com Three.js e SkyBox

Este projeto implementa uma animação 3D interativa utilizando Three.js com técnicas de SkyBox e controles personalizados de teclado e mouse.

## Características

- Modelo 3D interativo
- SkyBox para ambiente 3D imersivo
- Controles de teclado para movimentação e rotação do objeto
- Controles de mouse personalizados para orbitar a câmera
- Iluminação e sombras

## Como usar

1. Navegue até a aba "3D SkyBox" no menu inferior
2. Interaja com o modelo 3D usando:
   - **W/S/A/D/Q/E**: Mover o objeto
   - **Setas**: Rotacionar o objeto
   - **Mouse**: Clique e arraste para orbitar a câmera
   - **Roda do mouse**: Zoom

## Configuração do SkyBox

Para completar a implementação do SkyBox, adicione 6 imagens na pasta `assets/skybox/`:

1. px.jpg - Face positiva X (direita)
2. nx.jpg - Face negativa X (esquerda)
3. py.jpg - Face positiva Y (cima)
4. ny.jpg - Face negativa Y (baixo)
5. pz.jpg - Face positiva Z (frente)
6. nz.jpg - Face negativa Z (trás)

Depois de adicionar as imagens, descomente o código do SkyBox no arquivo `app/enhanced3d.tsx`.

## Tecnologias utilizadas

- React Native
- Expo
- Three.js
- React Three Fiber