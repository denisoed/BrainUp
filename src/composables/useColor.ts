const useColor = () => {
  function getRandomGradient() {
    const gradients = [
      "rgb(255, 127, 80)", // коралловый
      "rgb(240, 128, 128)", // светло-коралловый
      "rgb(255, 160, 122)", // светло-лососевый
      "rgb(250, 128, 114)", // лососевый
      "rgb(255, 99, 71)", // помидорный
      "rgb(255, 69, 0)", // оранжево-красный
      "rgb(255, 165, 0)", // оранжевый
      "rgb(255, 215, 0)", // золотой
      "rgb(127, 255, 0)", // липовый
      "rgb(0, 255, 127)", // весенне-зеленый
      "rgb(0, 250, 154)", // средний весенне-зеленый
      "rgb(0, 255, 255)", // циан
      "rgb(64, 224, 208)", // бирюзовый
      "rgb(72, 209, 204)", // средний бирюзовый
      "rgb(0, 206, 209)", // темно-бирюзовый
      "rgb(70, 130, 180)", // стальной синий
      "rgb(100, 149, 237)", // васильковый синий
      "rgb(123, 104, 238)"  // средний фиолетовый
    ];
    
    const randomIndex = Math.floor(Math.random() * gradients.length);
    return gradients[randomIndex];
  }

  function rgbToHex(rgb: string) {
    const rgbArray = rgb.replace(/[^\d,]/g, "").split(',');
    const r = parseInt(rgbArray[0]);
    const g = parseInt(rgbArray[1]);
    const b = parseInt(rgbArray[2]);
    const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

    return hex;
  }

  return {
    getRandomGradient,
    rgbToHex
  }
};

export default useColor;
