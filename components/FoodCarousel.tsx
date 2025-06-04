import React, { useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, View, Text } from 'react-native';
import { Image } from 'expo-image';
import { ThemedView } from './ThemedView';

// Importações para Glide.js (apenas para web)
import '@glidejs/glide/dist/css/glide.core.min.css';

const { width: screenWidth } = Dimensions.get('window');

type CarouselItem = {
  id: string;
  title: string;
  image: string;
};

type FoodCarouselProps = {
  data: CarouselItem[];
};

export default function FoodCarousel({ data }: FoodCarouselProps) {
  const glideRef = useRef<HTMLDivElement>(null);
  
  // Verificação de segurança para data
  if (!data || data.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <Text>No data available</Text>
      </ThemedView>
    );
  }

  // Inicializa o Glide.js no ambiente web
  useEffect(() => {
    if (typeof window !== 'undefined' && glideRef.current) {
      // Importação dinâmica do Glide.js
      import('@glidejs/glide').then(({ default: Glide }) => {
        const glideInstance = new Glide(glideRef.current!, {
          type: 'carousel',
          autoplay: 3000,
          perView: 1,
          gap: 0
        });
        
        glideInstance.mount();
        
        return () => {
          glideInstance.destroy();
        };
      });
    }
  }, []);

  // Renderiza o componente para web
  if (typeof window !== 'undefined') {
    return (
      <div style={{ margin: '16px 0' }}>
        <div className="glide" ref={glideRef}>
          <div className="glide__track" data-glide-el="track">
            <ul className="glide__slides">
              {data.map((item) => (
                <li key={item.id} className="glide__slide">
                  <div style={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    height: '200px',
                    position: 'relative'
                  }}>
                    <img 
                      src={item.image} 
                      alt={item.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      padding: '16px'
                    }}>
                      <span style={{
                        color: 'white',
                        textAlign: 'center',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        display: 'block'
                      }}>
                        {item.title}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="glide__bullets" data-glide-el="controls[nav]">
            {data.map((_, index) => (
              <button 
                key={index} 
                className="glide__bullet" 
                data-glide-dir={`=${index}`}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#ccc',
                  margin: '0 4px',
                  border: 'none',
                  padding: 0
                }}
              ></button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Fallback para React Native
  return (
    <ThemedView style={styles.container}>
      <View style={styles.itemContainer}>
        <Image
          source={{ uri: data[0].image }}
          style={styles.image}
          contentFit="cover"
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {data[0].title}
          </Text>
        </View>
      </View>
    </ThemedView>
  );
}

// Estilos para React Native
const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  itemContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 200,
    marginHorizontal: 30,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  title: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  }
});