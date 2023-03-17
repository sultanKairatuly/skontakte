export function useImageGetter() {
    const getImageUrl = (name: string) => {
      return new URL(name, import.meta.url).href;
    };
  
    const includes = <T, K extends keyof T>(item: T & {[key: string]: any}, where: Array<T>, propName: K) => {
      return where.filter((el) => {
        return el[propName] === item[propName] // Type 'C' cannot be used to index type 'T'.ts(2536)
      }).length !== 0
    }

    return {
      getImageUrl,
      includes
    };
  }