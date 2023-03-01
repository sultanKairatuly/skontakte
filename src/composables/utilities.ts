export function useImageGetter() {
    const getImageUrl = (name: string) => {
      return new URL(name, import.meta.url).href;
    };
  
    return {
      getImageUrl,
    };
  }